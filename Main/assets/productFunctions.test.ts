import { describe, expect, test } from "@jest/globals";
const { removeDuplicates, GetTags } = require("./productFunctions");

describe("remove Duplicates", () => {
  test("remove Duplicates", () => {
    const array: number[] = [5, 4, 3, 2, 5, 4, 2];
    expect(removeDuplicates(array)).toEqual([5, 4, 3, 2]);
  });
});
describe("GetTags", () => {
  test("GetTags", () => {
    expect(GetTags("test1", "test2", "test1", "test1 test2 test3")).toEqual([
      "test1",
      "test2",
      "test3",
    ]);
  });
});
