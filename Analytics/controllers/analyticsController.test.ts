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
