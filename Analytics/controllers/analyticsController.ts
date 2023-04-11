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
import { AnalyticsType, ProductType } from "./types";

module.exports = {
  // {user_id, productsArr: [{productId, liked:bool, observed, clicks: bool}]}
  AddAnalytics: (req: Request, res: Response) => {
    const { user_id, productsArr } = req.body;
    const productIds = productsArr.map((p) => p.productId);
    console.log(productIds);
    Analytics.findOne({ user_id: user_id }).then((userAnalytics: any) => {
      console.log("this is analytics " + userAnalytics);
      productsArr.map((product: any) => {
        let tags = product.tags;
        if (product.liked) {
          userAnalytics?.liked.push(product.productId);
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
        }
      });
      try {
        // @ts-ignore
        userAnalytics.save().then((rs) => {
          console.log("this is saved analytics" + rs);
          CalcSummary(
            user_id,
            userAnalytics?.clicks,
            userAnalytics?.observer,
            userAnalytics?.liked
          ).then(async () => {
            await AddSeen(user_id, productIds);
            await res.json({ success: true });
            await console.log(true);
          });
        });
      } catch (e) {
        console.log(e);
        res.send(false);
      }
    });
  },
  Search: async (req: Request, res: Response) => {
    try {
      const { user_id, input } = req.body;
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
          Answer.push(...SortByTags(user_id, highMatchProducts));
        }
        //filter low match products:
        const lowMatchProducts = products.filter((product: any) => {
          return product.tags.filter((tag: any) => {
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
  GetFollowingFeed: async (req: Request, res: Response) => {
    const { user_id } = req.body;
    const productsArr: any[] = [];
    let answer;
    Users.findOne({ _id: user_id }).then((user: any) => {
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
    answer = SortByTags(user_id, productsArr);
    // add filter with unseen
    res.json(answer);
  },
  MyTown: async (req: Request, res: Response) => {
    const { town } = req.body;
    let allLiked: any[] = [];
    Users.find({ location: town }).then((users: any) => {
      Analytics.find({
        user_id: { $in: users.map((user: any) => user._id) },
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
