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

exports.models = {
  // {userId, productsArr: [{productId, liked:bool, observed, clicks: bool}]}
  AddAnalytics: (req: Request, res: Response) => {
    const { user_id, productsArr } = req.body;
    Analytics.findOne({ user_id: user_id }).then((userAnalytics) => {
      Products.find({ _id: { $in: [productsArr.productId] } }).then(
        (products) => {
          products.map((product) => {
            let tags = product.tags;
            if (product.liked) {
              userAnalytics?.liked.push(product.productId);
              userAnalytics?.save().then(() => {
                CalcSummary(
                  user_id,
                  userAnalytics?.clicks,
                  userAnalytics?.observer,
                  userAnalytics?.liked
                );
              });
            }
            if (product.click) {
              tags?.map((tag) => {
                let check = false;
                userAnalytics?.clicks.map((exist_tag) => {
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
                  user_id,
                  userAnalytics?.clicks,
                  userAnalytics?.observer,
                  userAnalytics?.liked
                );
              });
            }
            if (product.observer > 0) {
              tags.map((tag) => {
                let check = false;
                userAnalytics?.observer.map((exist_tag) => {
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
                  user_id,
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
        AddSeen(user_id, GetProductFromProductArray(productsArr));
      } catch (e) {
        console.log(e);
      }
    });
  },
  Search: async (req, res) => {
    try {
      const { user_id, input } = req.body;
      const Answer = [];
      let highMatchProducts;
      let lowMatchProducts;
      Products.find().then((products) => {
        //filter high match products:
        highMatchProducts = products.filter((product) => {
          return (
            product.name.toLowerCase().includes(input.toLowerCase()) ||
            product.category.toLowerCase().includes(input.toLowerCase())
          );
        });
        if (highMatchProducts.length > 0) {
          Answer.push(...SortByTags(user_id, highMatchProducts));
        }
        //filter low match products:
        const lowMatchProducts = products.filter((product) => {
          return product.tags.filter((tag) => {
            return input.toLowerCase().includes(tag.toLowerCase());
          });
        });
        if (lowMatchProducts.length > 0) {
          Answer.push(...SortByTags(user_id, lowMatchProducts));
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
  GetFollowingFeed: async (req, res) => {
    const { user_id } = req.body;
    const productsArr = [];
    let answer;
    Users.findOne({ _id: user_id }).then((user) => {
      Users.find({ _id: { $in: user?.following } }).then((followingSellers) => {
        followingSellers.map((seller) => {
          Products.find({ _id: { $in: seller?.products } }).then((products) => {
            productsArr.push(SortByTags(seller._id, products));
          });
        });
      });
    });
    answer = SortByTags(user_id, productsArr);
    // add filter with unseen
    res.json(answer);
  },
  MyTown: async (req, res) => {
    const { town } = req.body;
    let allLiked = [];
    let clone = [];
    Users.find({ location: town }).then((users) => {
      Analytics.find({ user_id: { $in: users.map((user) => user._id) } }).then(
        (allCurrectUsers) => {
          allCurrectUsers.map((user) => {
            allLiked.push(user.liked);
          });
          // insert times repeated function
          res.json(sortAndRemoveDuplicate(allLiked));
        }
      );
    });
  },
};
