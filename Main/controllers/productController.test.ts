import { describe, expect, test } from "@jest/globals";
const { CreateProduct } = require("./productController");
describe("Create product", () => {
  test("Create product", () => {
    const req = {
      body: {
        userId: "6412b56a782e9380f0d415fc",
        productName: "Shirt",
        productDescription: "gr8 shirt",
        productPrice: 35,
        productMedia: [{ type: "image" }],
        productCategory: "shirt",
        onBid: false,
        size: "M",
        productCondition: "AA",
        tags: "This and that",
      },
    };
    expect(CreateProduct(req, "hey")).toBeTruthy();
  });
});
