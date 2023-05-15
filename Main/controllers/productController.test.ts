import { describe, expect, test } from "@jest/globals";
import axios from "axios";

describe("Create product", () => {
  test("Create product", async () => {
    const body = {
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
    const res = await axios.post(
      "http://localhost:8081/product/createProduct",
      body
    );
    expect(res.data).toBeTruthy();
  });
});
describe("Edit product", () => {
  test("Edit product", async () => {
    const body = {
      productId: "64245022801116e5c8b35b1f",
      userId: "6412b56a782e9380f0d415fc",
      productName: "Shift",
      productDescription: "gr2 shirt",
      productPrice: 31,
      productMedia: [{ type: "image" }],
      productCategory: "shirt",
      onBid: false,
      size: "M",
      productCondition: "AA",
      tags: "This and that",
    };
    const res = await axios.post(
      "http://localhost:8081/product/EditProduct",
      body
    );
    console.log(res.data);
    expect(res.data).toBeTruthy();
  });
});
describe("get Feed", () => {
  test("get Feed", async () => {
    const res = await axios.get("http://localhost:8081/product/getFeed");
    console.log(res.data);
    expect(res.data).toBeTruthy();
  });
});
describe("delete product", () => {
  test("delete product", async () => {
    const body = {
      productId: "642aa47642fa445f12ebf471",
      userId: "6412b56a782e9380f0d415fc",
    };
    const res = await axios.post(
      "http://localhost:8081/product/deleteProduct",
      body
    );
    console.log(res.data);
    expect(res.data).toBeTruthy();
  });
});
describe("GET product BY ID", () => {
  test("GET product BY ID", async () => {
    const body = {
      productId: "6412c802a259648cb1fb64ed",
    };
    const res = await axios.post(
      "http://localhost:8081/product/getProductById",
      body
    );
    console.log(res.data);
    expect(res.data).toBeTruthy();
  });
});
