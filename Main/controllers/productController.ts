// Essential imports
import mongoose from "mongoose";
const Users = require("../models/userModel");
const Products = require("../models/productModel");
const { removeDuplicates, GetTags } = require("../assets/productFunctions");
//Types:
import { Request, Response } from "express";
import { SingleProduct } from "./types";

module.exports = {
  CreateProduct: async (req: Request, res: Response) => {
    try {
      const {
        userId,
        productName,
        productDescription,
        productPrice,
        productMedia,
        productCategory,
        onBid,
        size,
        productCondition,
        tags,
      } = req.body;
      let modifiedTags = GetTags(
        tags,
        productName,
        productCategory,
        productDescription
      );
      const product: SingleProduct = new Products({
        name: productName,
        description: productDescription,
        price: productPrice,
        media: [{ type: "image" }],
        category: productCategory,
        onBid: onBid,
        size: size,
        condition: productCondition,
        seller: userId,
        tags: modifiedTags,
      });
      // @ts-ignore
      await product.save();
      res.send(true);
    } catch (err) {
      console.log(err);
      res.send(false);
      return false
    }
  },
  EditProduct: async (req: Request, res: Response) => {
    try {
      const {
        productId,
        userId,
        productName,
        productDescription,
        productPrice,
        productMedia,
        productCategory,
        onBid,
        productCondition,
        tags,
      } = req.body;
      let modifiedtags: string[] = GetTags(
        tags,
        productName,
        productCategory,
        productDescription
      );
      Products.findOneAndUpdate(
        { _id: productId },
        {
          name: productName,
          description: productDescription,
          price: productPrice,
          media: productMedia,
          category: productCategory,
          onBid: onBid,
          condition: productCondition,
          seller: userId,
          tags: modifiedtags,
        }
      ).then((result) => {
        res.send(result);
      });
    } catch (err) {
      res.send(false);
      console.log(err);
    }
  },
  DeleteProduct: async (req: Request, res: Response) => {
    try {
      const { productId, userId } = req.body;
      Products.findOneAndDelete({ _id: productId, seller: userId }).then(
        (result) => {
          res.send(result);
        }
      );
    } catch (err) {
      console.log(err);
      res.send(err);
    }
  },
  GetProductById: (req: Request, res: Response) => {
    try {
      const { productId } = req.body;
      Products.findOne({ _id: productId }).then((result) => {
        res.send(result);
      });
    } catch (err) {
      console.log(err);
      res.send(err);
    }
  },
  GetFeed: async (req: Request, res: Response) => {
    try {
      Products.find().then((result) => {
        res.send(result);
      });
    } catch (err) {
      console.log(err);
      res.send(err);
    }
  },
};
