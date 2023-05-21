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

describe("tested", () => {
  test("add analytics", async () => {
    // after three days of doom, i can declare add analytics as functional function!
    const body = {
      user_id: "6460ac2367089a26535337b5",
      productsArr: [
        {
          productId: "6460a11838bc40dc994d1bf5",
          liked: true,
          observed: 0,
          clicks: true,
        },
        {
          productId: "6460a14f38bc40dc994d1c52",
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
describe("tested", () => {
  test("search with analytics", async () => {
    const body = {
      user_id: "6412b596ded730d91035bac1",
      input: "shirt",
    };
    const res = await axios.post("http://localhost:5050/search", body);
    console.log(res.data);
    expect(res.data).toBeTruthy();
  });
});

describe("tested --need to test if the answer is sorted", () => {
  test("getfeed", async () => {
    const body = {
      user_id: "6460ac2367089a26535337b5",
    };
    const res = await axios.post("http://localhost:5050/getfeed", body);
    console.log(res.data);
    expect(res.data).toBeTruthy();
  });
});