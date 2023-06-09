import { tagobj } from "./types";
import { describe } from "@jest/globals";

const User = require("../models/userModel");
const Products = require("../models/productModel");
const Analytics = require("../models/analyticsModel");
const GetTag = (tag) => {
  return tag.tag;
};
const GetScore = (tag) => {
  return tag.score;
};
const Local_GetProductTags = async (productId) => {
  if (productId) {
    const product = await Products.findById(productId);
    console.log("this is product tags function , ", product?.tags);
    return product?.tags;
  } else {
    return [];
  }
};

module.exports = {
  GetSeen: (user_id) => {
    Analytics.findOne({ user_id: user_id }).then((analytics) => {
      if (analytics) {
        return analytics?.seen;
      } else {
        return "error";
      }
    });
  },
  AddSeen: (user_id, seen) => {
    const divider = 1;
    let cases = 0;
    console.log("this is seen " + seen);
    console.log(user_id);
    try {
      Analytics.findOne({ user_id: user_id }).then((analytics) => {
        if (analytics) {
          // Make any necessary modifications to the document
          const seenLength = analytics?.seen.length;
          const unseenLength = analytics?.unseen.length;
          console.log(
            "seen length " + seenLength + "unseen length " + unseenLength
          );
          try {
            const new_seen = [...analytics?.seen];
            new_seen.push(...seen);

            // analytics?.markModified("seen");
            if (unseenLength > 0) {
              if (seenLength >= unseenLength / divider) {
                cases = 1;
                const oldest_seen = new_seen.slice(-(seenLength / divider));
                analytics?.unseen.push(...oldest_seen);
                analytics.seen = [
                  ...new_seen.slice(seenLength - seenLength / divider),
                ];
                analytics?.markModified("unseen");
                analytics?.markModified("seen");
                console.log(analytics.seen, analytics.unseen);
              } else {
                cases = 2;
                analytics?.seen.unshift(...seen);
                console.log(analytics.seen);
                analytics?.markModified("seen");
              }
            } else {
              cases = 3;
              analytics.unseen =new_seen;
              analytics.seen = [];
              analytics?.markModified("unseen");
              analytics?.markModified("seen");
            }
            console.log("case " + cases);
            // Reload the document from the database
            Analytics.findByIdAndUpdate(analytics._id, analytics)
              .then(() => {})
              .catch((err) => {
                console.log(err);
              });
          } catch (err) {
            console.log(err);
          }
        }
      });
    } catch (err) {
      console.log(err);
    }
  },
  // :TODO: add filter and update unseen!
  SortUnseen: async (user_id) =>{
    try {
    // Big(O) - O(n)
      Analytics.findOne({user_id:user_id}).then((analytics)=>{
        //insert filter here
        const sorted = analytics.unseen
        sorted.sort((a,b)=>{
          return b.score - a.score
        })
        analytics.unseen = sorted
        analytics.save()
      })
    } catch(e){
      console.log(e)
    }
  },

  GetProductTags: async (productId) => {
    if (productId) {
      const product = await Products.findById(productId);
      console.log("this is product tags function , ", product.tags);
      return Object.values(product.tags);
    } else {
      return [];
    }
  },
  CalcSummary: async (user_id, clicks, observers, liked) => {
    let sum = [];
    console.log(
      "this is clicks ",
      clicks,
      "this is observers ",
      observers,
      "this is liked ",
      liked
    );

    const likedtags = await Promise.all(
      liked.map(async (likedProduct) => {
        console.log(likedProduct);
        return await Local_GetProductTags(likedProduct);
      })
    );
    // convert all matrix values to the primary array
    const flattenedLikedTags = likedtags.flat();

    // convert observer score
    const observertoClicks = observers.map((observer) => {
      return { tag: observer.tag, score: observer.score / 10 };
    });
    // merge
    sum = clicks.map((click) => {
      let check = false;
      if (observertoClicks.length > 0) {
        observertoClicks.map((toClick) => {
          if (toClick.tag === click.tag) {
            click.score += toClick.score;
            check = true;
          }
        });
      }
      console.log("liked tags: ", flattenedLikedTags);
      if (flattenedLikedTags.length > 0) {
        flattenedLikedTags.forEach((likeToClick) => {
          if (likeToClick === click.tag) {
            //for each like click add 10 scores
            click.score += 10;
            check = true;
          } else if (!sum.some((item) => item.tag === likeToClick)) {
            sum.push({ tag: likeToClick, score: 10 });
          }
        });
      }

      if (!check) {
        observertoClicks.forEach((toClick) => {
          check = false;
          toClick &&
            clicks.forEach((click) => {
              if (toClick.tag === click.tag) {
                check = true;
              }
            });
          if (!check && toClick) {
            sum.push(toClick);
          }
        });
      }
      return click;
    });
    const analytics = await Analytics.findOne({ user_id: user_id });
    console.log("this is summary ", sum);
    analytics.sum = sum;

    analytics.sum.sort((a, b) => {
      return b.score - a.score;
    });
    await analytics.save();
    return true;
  },
  GetProductFromProductArray: (productArr) => {
    let products = [];
    productArr.map((product) => {
      products.push(product._id);
    });
    return products;
  },
  // need to test!
  SortByTags: async (user_id, products) => {
    let analytics = await Analytics.findOne({ user_id: user_id });
    const answer = [];
    console.log("that is products ,", products)
    //O(N^2)
    products.forEach((product) => {
      let matchRank = 0;
      analytics?.sum.forEach((tag) => {
        if (product.tags?.includes(tag.tag)) {
          matchRank += tag.score;
        }
      });
      answer.push({ productId: product._id, score: matchRank });
    });
    console.log("this is products", products, " this is answer ", answer)
// O(N)
    answer.sort((a, b) => b.score - a.score); //O(N log N)
    // big problem here, unseen rest everytime.
    const newAnalytics = { ...analytics?.toObject(), unseen: answer };
    await Analytics.updateOne({ _id: analytics?._id }, {unseen:answer});

    return answer;
  },

  // seller preferences is the sum of the following sellers publishedProductsSum
  SumSellers: (user_id) => {
    User.findOne({ _id: user_id })
      .populate("following")
      .then((seller) => {
        Analytics.find({
          _id: { $in: [seller?.map((single) => single._id)] },
        }).then((sellersStatistics) => {
          let favSellers = [];
          sellersStatistics.map((singleSeller) => {
            singleSeller.myPublishedProductsSum.map((tag) => {
              let check = false;
              if (favSellers.length > 0) {
                favSellers.map((favTag) => {
                  if (favTag.tag === tag.tag) {
                    favTag.score += tag.score; //check for better option
                  }
                });
              } else {
                check = true;
                favSellers.push({ tag: tag.tag, score: 1 });
              }
              if (!check) {
                favSellers.push({ tag: tag.tag, score: 1 });
              }
            });
          });
          Analytics.findOne({ _id: user_id }).then((analytics) => {
            favSellers.sort((a, b) => a.score - b.score);
            analytics.sellerPreferences = favSellers;
            let sellerSuggestions = [];
            Analytics.find().then((users) => {
              users.map((user) => {
                //here compare each seller to the user preference.
                let singleSellerArray = [];
                user.myPublishedProductsSum.map((tag) => {
                  // seller avg tag score
                  analytics.sellerPreferences.map((favTag) => {
                    // user avg fav seller tag score
                    if (tag.tag === favTag.tag) {
                      singleSellerArray.push({
                        tag: tag.tag,
                        score: favTag.score,
                      });
                    }
                  });
                });

                function getTheSum(sellerArray) {
                  let sum = 0;
                  sellerArray.forEach((tag) => {
                    sum = sum + tag.score;
                  });
                  return sum;
                }

                sellerSuggestions.push({
                  seller: user._id,
                  score: getTheSum(singleSellerArray),
                });
              });
            });
            sellerSuggestions.sort((a, b) => a.score - b.score);
            analytics.suggestedSellers = sellerSuggestions;
            analytics?.save();
          });
        });
      });
  },
  GetUnseen: async (user_id) => {
    try {
      console.log(user_id);
      const analytics = Analytics.findOne({ user_id: user_id });
      if (analytics) {
        console.log(analytics?.unseen);
        return analytics?.unseen;
      }
    } catch (err) {
      console.log(err);
    }
  },
  sortAndRemoveDuplicate: (arr) => {
    let clone = [];
    for (let i = 0; i < arr.length; i++) {
      if (clone.length > 0) {
        let check = false;
        clone.map((element) => {
          if (arr[i] === element.value) {
            element.count++;
            check = true;
          }
        });
        if (!check) {
          clone.push({ value: arr[i], count: 1 });
        }
      } else {
        clone.push({ value: arr[i], count: 1 });
      }
    }
    return clone.sort((a, b) => b.count - a.count);
  },
  GetRandomizedProducts: (user_id) => {
    return User.findOne({ user_id: user_id }).then((user) => {
      if (user) {
        return user?.fastLoadProducts;
      }
    });
  },
  GetProductViaIds: async (productsArr) => {
    Products.find({ _id: { $in: productsArr } }).then((products) => {
      return products;
    });
  },
  GetProductViaProductId:  async (productsArr) => {
    Products.find({ _id: { $in: productsArr.map(product=>product.productId) } }).then((products) => {
      return products;
    });
  },
  SortAnalytics: async (user_id: string, productsArr: object[]) => {
    try {
      let counter = 0;
      const userAnalytics = await Analytics.findOne({ user_id: user_id });
      let clicks = [];
      if (userAnalytics.clicks.length > 2) {
        clicks = [...userAnalytics.clicks];
      }
      console.log(userAnalytics.clicks);
      console.log(productsArr);
      const productPromises = productsArr.map(async (product: any, index) => {
        let tags = await Local_GetProductTags(product.productId);
        console.log("tags arrived, :", tags, "and index ", index);
        if (product.liked) {
          userAnalytics?.liked.push(product.productId);
        }
        if (product.clicks) {
          tags.map((tag: string) => {
            let check = false;
            if (
              (clicks && userAnalytics.clicks.length > 0) ||
              clicks.length > 0
            ) {
              clicks.map((exist_tag: tagobj) => {
                if (tag == exist_tag?.tag) {
                  check = true;
                  console.log("increase click count of ", exist_tag);
                  exist_tag.score = exist_tag.score + 1;
                  return exist_tag;
                }
              });
            }
            if (!check) {
              console.log("pushing ", tag);
              clicks.push({ tag: tag, score: 1 });
            }
          });
        }
        if (product.observer > 0) {
          tags.map((tag: any) => {
            let check = false;
            userAnalytics?.observer.map((exist_tag: any) => {
              if (tag == exist_tag.tag) {
                check = true;
                return (exist_tag.score += 1);
              }
            });
            if (!check) {
              userAnalytics?.observer.push({ tag: tag, score: 1 });
            }
          });
        }
        console.log("that index ", index);
      });
      await Promise.all(productPromises);
      return returnAnswer(clicks, userAnalytics);
      function returnAnswer(clicks, userAnalytics) {
        userAnalytics.clicks = clicks;
        userAnalytics.save().then((rs) => {
          console.log("this is modified ", rs);
        });
        return {
          clicks: userAnalytics.clicks,
          observer: userAnalytics.observer,
          liked: userAnalytics.liked,
        };
      }
    } catch (err) {
      console.log(err);
    }
  },
};
