const User = require("../models/userModel");
const Products = require("../models/productModel");
const Analytics = require("../models/analyticsModel");
const GetTag = (tag) => {
  return tag.tag;
};
const GetScore = (tag) => {
  return tag.score;
};
const Local_GetProductTags = (productId) => {
  return Products.findOne({ _id: productId }).then((product) => {
    if (product) {
      return product?.tags;
    }
  });
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
    const divider = 3;
    Analytics.findOne({ user_id: user_id }).then((analytics) => {
      if (analytics) {
        const seenLength = analytics?.seen.length;
        const unseenLength = analytics?.unseen.length;
        try {
          analytics?.seen.unshift(seen);
          analytics?.markModified("seen");
          analytics?.save();
          if (seenLength >= unseenLength / divider) {
            const oldest_seen = analytics?.seen.slice(-(seenLength / divider));
            analytics?.unseen.push(oldest_seen);
            analytics.seen = analytics?.seen.slice(
              seenLength - seenLength / divider
            );

            analytics?.markModified("unseen");
            analytics?.markModified("seen");
            analytics?.save();
          }
          return true;
        } catch (err) {
          console.log(err);
          return false;
        }
      }
    });
  },
  GetProductTags: (productId) => {
    return Products.findOne({ _id: productId }).then((product) => {
      if (product) {
        return product?.tags;
      }
    });
  },
  CalcSummary: (user_id, clicks, observers, liked) => {
    let likedtags = [];
    liked.map((likedProduct) => {
      likedtags.push(...Local_GetProductTags(likedProduct));
    });

    const toClicks = observers.map((observer) => {
      return (observer.score = observer.score / 10);
    });
    const sum = clicks.map((click) => {
      let check = false;
      toClicks.map((toClick) => {
        if (toClick.tag === click.tag) {
          click.score += toClick.score;
          check = true;
        }
      });
      likedtags.map((likeToClick) => {
        if (likeToClick === click.tag) {
          //for each like click add 10 scores
          click.score += 10;
          check = true;
        }
        if (!sum.tag.includes(likeToClick)) {
          sum.push({ tag: likeToClick, score: 10 });
        }
      });
      if (!check) {
        toClicks.map((toClick) => {
          check = false;
          clicks.map((click) => {
            if (toClick.tag === click.tag) {
              check = true;
            }
          });
          if (!check) {
            sum.push(toClick);
          }
        });
      }
    });
    Analytics.findOne({ user_id: user_id }).then((analytics) => {
      analytics.sum = sum;

      analytics?.sum?.sort(GetScore);
      Analytics?.save();
    });
  },

  GetProductFromProductArray: (productArr) => {
    let products = [];
    productArr.map((product) => {
      products.push(product._id);
    });
    return products;
  },
  SortByTags: (user_id, products) => {
    const Answer = [];
    // Analytics.findOne({ user_id: user_id }).then((analytics) => {
    //   products.map((product) => {
    //     let matchRank = 0;
    //     analytics?.sum.map((tag) => {
    //       if (product.tags?.includes(GetTag(tag))) {
    //         matchRank = matchRank + tag.score;
    //       }
    //     });
    //     Answer.push({ product, score: matchRank });
    //   });
    //   // Answer.sort(GetScore);
    //   analytics.unseen = Answer.sort(GetScore);
    //   analytics?.save();
    // });
    // return Answer.sort(GetScore);
    return products;
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
};
