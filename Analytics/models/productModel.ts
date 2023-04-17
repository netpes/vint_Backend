import mongoose from "mongoose";

const product_schema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true, default: "" },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  gender: { type: String, enum: ["M", "F", "U"], required: true, default: "U" },
  price: { type: Array, required: true },
  condition: { type: String, required: false },
  size: { type: String, required: false },
  onBid: { type: Boolean, required: true, default: false },
  description: { type: String, required: true, default: "" },
  media: [
    {
      url: {
        type: String,
        required: true,
        default:
          "https://m.media-amazon.com/images/M/MV5BNGM0ZjBkNjMtZjUyNi00MTA1LWIxYTMtNjY2MTNjNzA4ZDdmXkEyXkFqcGdeQXVyMTI1NDEyNTM5._V1_.jpg",
      },
      type: { type: String, required: true },
    },
  ],
  date: { type: Date, default: Date.now },
  status: { type: Boolean, default: true },
  review: { type: String, required: false },
  watchers: { type: Number, required: true, default: 0 },
  tags: { type: Array, required: false },
});

module.exports = mongoose.model("products", product_schema);
