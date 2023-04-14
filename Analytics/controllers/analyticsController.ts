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
  SortAnalytics,
  SumSellers,
  GetProductViaIds,
} = require("./assets");
import { Request, Response } from "express";
import { AnalyticsType, ProductType, tagarray, tagobj } from "./types";

module.exports = {
  // {user_id, productsArr: [{productId, liked:bool, observed, clicks: bool}]}
  AddAnalytics: async (req: Request, res: Response) => {
    const { user_id, productsArr } = req.body;
    const productIds = productsArr.map((p) => p.productId);

    console.log(productIds);
    try {
      await AddSeen(user_id, productIds); // add to seen -- tested works!
      SortAnalytics(user_id, productsArr)
        .then((analytics) => {
          // Ensure that analytics data is available before calling CalcSummary()
          CalcSummary(
            user_id,
            Object.values(analytics?.clicks),
            Object.values(analytics?.observer),
            analytics?.liked
          ).then((result) => {
            console.log(result);
          });
          res.json({ success: true });
        })
        .catch((error) => {
          console.log(error);
          res.json({ success: false, error });
        });
      console.log(true);
    } catch (err) {
      console.log(err);
    }
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
