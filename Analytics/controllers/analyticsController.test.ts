import { describe, expect, test } from "@jest/globals";
import axios from "axios";

describe("add analytics", () => {
  test("add analytics", async () => {
    const body = {
      user_id: "6412b596ded730d91035bac1",
      productsArr: [
        {
          productId: "6412d17f0c5fc72471c6c6d8",
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
