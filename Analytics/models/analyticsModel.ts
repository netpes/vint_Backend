import mongoose from "mongoose";

const analytics_schema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  clicks: [
    {
      tag: { type: String, default: 0 },
      score: { type: Number, default: 0 },
    },
  ],
  observer: [
    {
      tag: { type: String, default: 0 },
      score: { type: Number, default: 0 },
    },
  ],
  liked: [{ ref: "products", type: mongoose.Schema.Types.ObjectId }],
  sum: [
    {
      tag: { type: String, default: 0 },
      score: { type: Number, default: 0 },
    },
  ],
  seen: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "products",
        required: false,
      },
      score: { type: Number, default: 0, required: false },
      //check if i insert products ids !
    },
  ],
  unseen: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "products",
        required: false,
      },
      score: { type: Number, default: 0, required: false },
      //check if inserted products ids !
    },
  ],
  sellerPreferences: [
    {
      tag: { type: String, default: 0 },
      score: { type: Number, default: 0 },
    },
  ],
  myPublishedProductsSum: [
    {
      tag: { type: String, default: 0 },
      score: { type: Number, default: 0 },
    },
  ],
  suggestedSellers: [
    {
      seller: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      score: { type: Number, default: 0 },
    },
  ],
});

module.exports = mongoose.model("analytics", analytics_schema);
