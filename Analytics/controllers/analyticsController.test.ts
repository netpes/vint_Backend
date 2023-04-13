import { describe, expect, test } from "@jest/globals";
import axios from "axios";

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
describe("add analytics", () => {
  test("add analytics", async () => {
    const body = {
      user_id: "6412b596ded730d91035bac1",
      productsArr: [
        {
          productId: "642ad19c73a781edccbecbe4",
          liked: true,
          observed: 0,
          clicks: true,
        },
        {
          productId: "6412c802a259648cb1fb64ed",
          liked: true,
          observed: 0,
          clicks: true,
        },
      ],
    };
    const res = await axios.post("http://localhost:5050/addAnalytics", body);
    expect(res.data).toBeTruthy();
  });
});
describe("getproductTags", () => {
  test("", async () => {
    const productId = "6412d17f0c5fc72471c6c6d8";
    console.log(await GetProductTags(productId));
    expect(await GetProductTags(productId)).toBeTruthy();
  });
});
// clicks and observer is'nt working!
