// Essential imports
import mongoose from "mongoose";
const Users = require("../models/userModel");
const Products = require("../models/productModel");
const { removeDuplicates, GetTags } = require("../assets/productFunctions");
//Types:
import { SingleProduct } from "./types/productTypes";
import { Request, Response } from "express";

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
      res.send(true)
    } catch (err) {
      console.log(err);
      return false;
      res.send(false);
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
      console.log(err);
    }
  },
};
