const Users = require("../models/userModel");
const Products = require("../models/productModel");
const Analytics = require("../models/analyticsModel");
const {
  GetProductFromProductArray,
  GetUnseen,
  AddSeen,
  CalcSummary,
  GetProductTags,
  GetRandomizedProducts,
  SortByTags,
  GetSeen,
  GetScore,
  sortAndRemoveDuplicate,
  GetTag,
  SumSellers,
  GetProductViaIds,
} = require("./assets");
import { Request, Response } from "express";

module.exports = {
  // {userId, productsArr: [{productId, liked:bool, observed, clicks: bool}]}
  AddAnalytics: (req: Request, res: Response) => {
    const { userId, productsArr } = req.body;
    Analytics.findOne({ userId: userId }).then((userAnalytics: any) => {
      Products.find({ _id: { $in: [productsArr.productId] } }).then(
        (products: any) => {
          products.map((product: any) => {
            let tags = product.tags;
            if (product.liked) {
              userAnalytics?.liked.push(product.productId);
              userAnalytics?.save().then(() => {
                CalcSummary(
                  userId,
                  userAnalytics?.clicks,
                  userAnalytics?.observer,
                  userAnalytics?.liked
                );
              });
            }
            if (product.click) {
              tags?.map((tag: any) => {
                let check = false;
                userAnalytics?.clicks.map((exist_tag: any) => {
                  if (tag === exist_tag.tag) {
                    check = true;
                    exist_tag.score += 1;
                  }
                });
                if (check) {
                  userAnalytics?.clicks.push({ tag: tag, score: 1 });
                }
              });
              userAnalytics?.save().then(() => {
                CalcSummary(
                  userId,
                  userAnalytics?.clicks,
                  userAnalytics?.observer,
                  userAnalytics?.liked
                );
              });
            }
            if (product.observer > 0) {
              tags.map((tag: any) => {
                let check = false;
                userAnalytics?.observer.map((exist_tag: any) => {
                  if (tag === exist_tag.tag) {
                    check = true;
                    exist_tag.score += 1;
                  }
                });
                if (check) {
                  userAnalytics?.observer.push({ tag: tag, score: 1 });
                }
              });
              userAnalytics?.save().then(() => {
                CalcSummary(
                  userId,
                  userAnalytics?.clicks,
                  userAnalytics?.observer,
                  userAnalytics?.liked
                );
              });
            }
          });
        }
      );
      try {
        AddSeen(userId, GetProductFromProductArray(productsArr));
      } catch (e) {
        console.log(e);
        return false;
      }
    });
  },
  Search: async (req: Request, res: Response) => {
    try {
      const { userId, input } = req.body;
      const Answer: any[] = [];
      let highMatchProducts;
      let lowMatchProducts;
      Products.find().then((products: any) => {
        //filter high match products:
        highMatchProducts = products.filter((product: any) => {
          return (
            product.name.toLowerCase().includes(input.toLowerCase()) ||
            product.category.toLowerCase().includes(input.toLowerCase())
          );
        });
        if (highMatchProducts.length > 0) {
          Answer.push(...SortByTags(userId, highMatchProducts));
        }
        //filter low match products:
        const lowMatchProducts = products.filter((product: any) => {
          return product.tags.filter((tag: any) => {
            return input.toLowerCase().includes(tag.toLowerCase());
          });
        });
        if (lowMatchProducts.length > 0) {
          Answer.push(...SortByTags(userId, lowMatchProducts));
        }
        if (Answer.length === 0) {
          res.json("no products found");
        }
        res.json(Array.from(new Set(Answer)));
      });
    } catch (e) {
      console.log(e);
    }
  },
  GetFollowingFeed: async (req: Request, res: Response) => {
    const { userId } = req.body;
    const productsArr: any[] = [];
    let answer;
    Users.findOne({ _id: userId }).then((user: any) => {
      Users.find({ _id: { $in: user?.following } }).then(
        (followingSellers: any) => {
          followingSellers.map((seller: any) => {
            Products.find({ _id: { $in: seller?.products } }).then(
              (products: any) => {
                productsArr.push(SortByTags(seller._id, products));
              }
            );
          });
        }
      );
    });
    answer = SortByTags(userId, productsArr);
    // add filter with unseen
    res.json(answer);
  },
  MyTown: async (req: Request, res: Response) => {
    const { town } = req.body;
    let allLiked: any[] = [];
    Users.find({ location: town }).then((users: any) => {
      Analytics.find({
        userId: { $in: users.map((user: any) => user._id) },
      }).then((allCurrectUsers: any) => {
        allCurrectUsers.map((user: any) => {
          allLiked.push(user.liked);
        });
        // insert times repeated function
        res.json(sortAndRemoveDuplicate(allLiked));
      });
    });
  },
};
