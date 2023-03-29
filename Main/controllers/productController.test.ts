import { describe, expect, test } from "@jest/globals";
import axios from "axios";
const { CreateProduct } = require("./productController");
describe("Create product", () => {
  test("Create product", async () => {
      const body= {
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
    };
    const res = await axios.post("http://localhost:8081/product/createProduct", body);
    expect(res).toBeTruthy();
  });
});
