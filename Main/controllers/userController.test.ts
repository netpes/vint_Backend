import { typeUser } from "./types";
import { afterAll, beforeAll, describe, expect, test } from "@jest/globals";

const User = require("../models/userModel");
const EmailVerify = require("../models/EmailVerifyModel");

const supertest = require("supertest");
const app = require("../app");
const request = supertest(app);
import { connect, close } from "../db";

const {
  checkIfEmailValid,
  sendEmail,
  createNewEmailVerify,
  passwordGenerator,
} = require("./userController");

const globalUser: typeUser = {
  username: "1",
  email: "vinttnrr@gmail.com",
  name: "user",
  password: "1",
  phone: "0500000000",
  _id: "111111111111111111111111",
};

const verifyEmailCode = "";

describe("User", () => {
  beforeAll(() => {
    connect().catch((err) => console.log(err));
  });

  afterAll(() => {
    close().catch((err) => console.log(err));
  });

  test("checkIfEmailValid", () => {
    const toEmail = globalUser.email;

    expect(checkIfEmailValid(toEmail)).toBe(true);
  });

  test("sendEmail", () => {
    const subject = "subject";
    const html = "<h1></h1>";
    const toEmail = globalUser.email;

    expect(sendEmail(subject, html, toEmail)).toBe(true);
  });

  test("createNewEmailVerify", async () => {
    const user = await User.findById(globalUser._id);

    expect(await createNewEmailVerify(user)).toBe(true);
  });

  test("passwordGenerator", () => {
    const newPassword = passwordGenerator(8);
    expect(newPassword.length).toBe(8);
    expect(typeof newPassword).toBe("string");
  });

  test("deleteAccount good status", async () => {
    const body = {
      userID: globalUser._id,
    };

    const res = await request.post("/user/deleteAccount").send(body);

    expect(res.statusCode).toBe(200);
  });

  test("deleteAccount bad status", async () => {
    const body = {
      userID: "",
    };

    const res = await request.post("/user/deleteAccount").send(body);

    expect(res.statusCode >= 400).toBe(true);
  });

  test("signUp good status", async () => {
    await User.deleteMany({});

    const body: typeUser = { ...globalUser };

    const res = await request.post("/user/signUp").send(body);

    expect(res.statusCode).toBe(200);
  });

  test("signUp bad status", async () => {
    const body: typeUser = { ...globalUser };

    const res = await request.post("/user/signUp").send(body);

    expect(res.statusCode >= 400).toBe(true);
  });

  test("changePassword good status", async () => {
    const body = {
      userID: globalUser._id,
      newPassword: "1",
    };

    const res = await request.post("/user/changePassword").send(body);

    expect(res.statusCode).toBe(200);
  });

  test("changePassword bad status without userID", async () => {
    const body = {
      userID: "",
      newPassword: "qwer",
    };

    const res = await request.post("/user/changePassword").send(body);

    expect(res.statusCode >= 400).toBe(true);
  });

  test("changePassword bad status without password", async () => {
    const body = {
      userID: globalUser._id,
      newPassword: "",
    };

    const res = await request.post("/user/changePassword").send(body);

    expect(res.statusCode >= 400).toBe(true);
  });

  test("sendVerifyEmailAgain good status", async () => {
    const body = {
      userID: globalUser._id,
    };

    const res = await request.post("/user/sendVerifyEmailAgain").send(body);

    expect(res.statusCode).toBe(200);
  });

  test("sendVerifyEmailAgain bad status without userID", async () => {
    const body = {
      userID: "",
    };

    const res = await request.post("/user/sendVerifyEmailAgain").send(body);

    expect(res.statusCode >= 400).toBe(true);
  });

  test("verifyEmail good status", async () => {
    const code = await EmailVerify.findOne({ userID: globalUser._id });

    console.log(code);

    const body = {
      userID: globalUser._id,
      code: code.code,
    };

    const res = await request.post("/user/verifyEmail").send(body);

    expect(res.statusCode).toBe(200);
  });

  test("verifyEmail bad status", async () => {
    const body = {
      userID: globalUser._id,
      code: "",
    };

    const res = await request.post("/user/verifyEmail").send(body);

    expect(res.statusCode >= 400).toBe(true);
  });

  test("userInfo good status", async () => {
    const body = {
      userID: globalUser._id,
    };

    const res = await request.post("/user/userInfo").send(body);

    expect(res.statusCode).toBe(200);
  });

  test("userInfo bad status", async () => {
    const body = {
      userID: "",
    };

    const res = await request.post("/user/userInfo").send(body);

    expect(res.statusCode >= 400).toBe(true);
  });

  test("login good status", async () => {
    const body = {
      username: globalUser.username,
      password: globalUser.password,
    };

    const res = await request.post("/user/login").send(body);
    console.error(res.body);

    expect(res.statusCode).toBe(200);
  });

  test("login bad status without username", async () => {
    const body = {
      username: "",
      password: globalUser.password,
    };

    const res = await request.post("/user/login").send(body);

    expect(res.statusCode >= 400).toBe(true);
  });

  test("login bad status without password", async () => {
    const body = {
      username: globalUser.username,
      password: "",
    };

    const res = await request.post("/user/login").send(body);

    expect(res.statusCode >= 400).toBe(true);
  });

  test("changeEmail good status", async () => {
    const body = {
      userID: globalUser._id,
      newEmail: globalUser.email,
    };

    const res = await request.post("/user/changeEmail").send(body);

    expect(res.statusCode).toBe(200);
  });

  test("changeEmail bad status without userID", async () => {
    const body = {
      userID: "",
      newEmail: globalUser.email,
    };

    const res = await request.post("/user/changeEmail").send(body);

    expect(res.statusCode >= 400).toBe(true);
  });

  test("changeEmail bad status without newEmail", async () => {
    const body = {
      userID: globalUser._id,
      newEmail: "",
    };

    const res = await request.post("/user/changeEmail").send(body);
    expect(res.statusCode >= 400).toBe(true);
  });

  test("forgotPassword good status", async () => {
    const body = {
      username: globalUser.username,
    };

    const res = await request.post("/user/forgotPassword").send(body);

    expect(res.statusCode).toBe(200);
  });

  test("forgotPassword bad status", async () => {
    const body = {
      username: "",
    };

    const res = await request.post("/user/forgotPassword").send(body);

    expect(res.statusCode >= 400).toBe(true);
  });

  test("verifyToken good status", async () => {
    const body = {
      userID: globalUser._id,
      token:
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjExMTExMTExMTExMTExMTExMTExMTExMSIsImlhdCI6MTY4MTQ4MTU4NH0.cu_opAYxbCqGyQX0vZHK6e6lnHEXQyO6ExogubXectI",
    };

    const res = await request.post("/user/verifyToken").send(body);

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ message: "Verify Token", verify: true });
  });

  test("verifyToken bad status without userID", async () => {
    const body = {
      userID: "",
      token:
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjExMTExMTExMTExMTExMTExMTExMTExMSIsImlhdCI6MTY4MTQ4MTU4NH0.cu_opAYxbCqGyQX0vZHK6e6lnHEXQyO6ExogubXectI",
    };

    const res = await request.post("/user/verifyToken").send(body);

    expect(res.statusCode >= 400).toBe(true);
  });

  test("verifyToken bad status without token", async () => {
    const body = {
      userID: globalUser._id,
      token: "",
    };

    const res = await request.post("/user/verifyToken").send(body);

    expect(res.statusCode >= 400).toBe(true);
  });

  test("getUserById good status", async () => {
    const body = {
      userID: globalUser._id,
    };

    const res = await request.post("/user/getUserById").send(body);

    expect(res.statusCode).toBe(200);
  });

  test("getUserById bad status", async () => {
    const body = {
      userID: "",
    };

    const res = await request.post("/user/getUserById").send(body);

    expect(res.statusCode >= 400).toBe(true);
  });

  test("Add another user for following tests", async () => {
    const body: typeUser = {
      username: "2",
      email: "vinttnrr2@gmail.com",
      name: "user2",
      password: "2",
      phone: "0500000002",
      _id: "222222222222222222222222",
    };

    const res = await request.post("/user/signUp").send(body);

    expect(res.statusCode).toBe(200);
  });

  test("getFollowingList good status", async () => {
    const body = {
      userID: globalUser._id,
    };

    const res = await request.post("/user/getFollowingList").send(body);

    expect(res.statusCode).toBe(200);
  });

  test("getFollowingList bad status", async () => {
    const body = {
      userID: "",
    };

    const res = await request.post("/user/getFollowingList").send(body);

    expect(res.statusCode >= 400).toBe(true);
  });

  test("addSellerToFollowingList good status", async () => {
    const body = {
      userID: globalUser._id,
      newFollowingID: "222222222222222222222222",
    };

    const res = await request.post("/user/addSellerToFollowingList").send(body);

    expect(res.statusCode).toBe(200);
  });

  test("addSellerToFollowingList bad status", async () => {
    const body = {
      userID: "",
      newFollowingID: "",
    };

    const res = await request.post("/user/addSellerToFollowingList").send(body);

    expect(res.statusCode >= 400).toBe(true);
  });

  test("removeSellerFromFollowingList good status", async () => {
    const body = {
      userID: globalUser._id,
      idToRemove: "222222222222222222222222",
    };

    const res = await request
      .post("/user/removeSellerFromFollowingList")
      .send(body);

    expect(res.statusCode).toBe(200);
  });

  test("removeSellerFromFollowingList bad status without userID", async () => {
    const body = {
      userID: "",
      idToRemove: "222222222222222222222222",
    };

    const res = await request
      .post("/user/removeSellerFromFollowingList")
      .send(body);

    expect(res.statusCode >= 400).toBe(true);
  });

  test("removeSellerFromFollowingList bad status without newFollowingID", async () => {
    const body = {
      userID: globalUser._id,
      idToRemove: "",
    };

    const res = await request
      .post("/user/removeSellerFromFollowingList")
      .send(body);

    expect(res.statusCode >= 400).toBe(true);
  });

  test("getUserProductsList good status", async () => {
    const body = {
      userID: globalUser._id,
    };

    const res = await request.post("/user/getUserProductsList").send(body);

    expect(res.statusCode).toBe(200);
  });

  test("getUserProductsList bad status", async () => {
    const body = {
      userID: "",
    };

    const res = await request.post("/user/getUserProductsList").send(body);

    expect(res.statusCode >= 400).toBe(true);
  });

  test("addProductToUserProductsList good status", async () => {
    const body = {
      userID: globalUser._id,
      productID: "6412c802a259648cb1fb64ed",
    };
    const res = await request
      .post("/user/addProductToUserProductsList")
      .send(body);

    expect(res.statusCode).toBe(200);
  });

  test("addProductToUserProductsList bad status without userID", async () => {
    const body = {
      userID: globalUser._id,
      productID: "6412c802a259648cb1fb64ed",
    };
    const res = await request
      .post("/user/addProductToUserProductsList")
      .send(body);

    expect(res.statusCode >= 400).toBe(true);
  });

  test("addProductToUserProductsList bad status without productID", async () => {
    const body = {
      userID: globalUser._id,
      productID: "",
    };
    const res = await request
      .post("/user/addProductToUserProductsList")
      .send(body);

    expect(res.statusCode >= 400).toBe(true);
  });

  test("removeProductFromUserProductsList good status", async () => {
    const body = {
      userID: globalUser._id,
      productIDToRemove: "6412b66799d3a23e507dcdd0",
    };

    const res = await request
      .post("/user/removeProductFromUserProductsList")
      .send(body);

    expect(res.statusCode).toBe(200);
  });

  test("removeProductFromUserProductsList bad status without userID", async () => {
    const body = {
      userID: "",
      productIDToRemove: "6412b66799d3a23e507dcdd0",
    };

    const res = await request
      .post("/user/removeProductFromUserProductsList")
      .send(body);

    expect(res.statusCode >= 400).toBe(true);
  });

  test("removeProductFromUserProductsList bad status without productIDToRemove", async () => {
    const body = {
      userID: globalUser._id,
      productIDToRemove: "",
    };

    const res = await request
      .post("/user/removeProductFromUserProductsList")
      .send(body);

    expect(res.statusCode >= 400).toBe(true);
  });

  test("getWishList good status", async () => {
    const body = {
      userID: globalUser._id,
    };

    const res = await request.post("/user/getWishList").send(body);

    expect(res.statusCode).toBe(200);
  });

  test("getWishList bad status", async () => {
    const body = {
      userID: "",
    };

    const res = await request.post("/user/getWishList").send(body);

    expect(res.statusCode >= 400).toBe(true);
  });

  test("addToWishList good status", async () => {
    const body = {
      userID: globalUser._id,
      productID: "6412c802a259648cb1fb64ed",
    };

    const res = await request.post("/user/addToWishList").send(body);

    expect(res.statusCode).toBe(200);
  });

  test("addToWishList bad status without userID", async () => {
    const body = {
      userID: "",
      productID: "6412c802a259648cb1fb64ed",
    };

    const res = await request.post("/user/addToWishList").send(body);

    expect(res.statusCode >= 400).toBe(true);
  });

  test("addToWishList bad status without productID", async () => {
    const body = {
      userID: globalUser._id,
      productID: "",
    };

    const res = await request.post("/user/addToWishList").send(body);

    expect(res.statusCode >= 400).toBe(true);
  });

  test("removeFromWishList good status", async () => {
    const body = {
      userID: globalUser._id,
      productIDToRemove: "6412b66799d3a23e507dcdd0",
    };

    const res = await request.post("/user/removeFromWishList").send(body);

    expect(res.statusCode).toBe(200);
  });

  test("removeFromWishList bad status without userID", async () => {
    const body = {
      userID: "",
      productIDToRemove: "6412b66799d3a23e507dcdd0",
    };

    const res = await request.post("/user/removeFromWishList").send(body);

    expect(res.statusCode >= 400).toBe(true);
  });

  test("removeFromWishList bad status without productIDToRemove", async () => {
    const body = {
      userID: globalUser._id,
      productIDToRemove: "",
    };

    const res = await request.post("/user/removeFromWishList").send(body);

    expect(res.statusCode >= 400).toBe(true);
  });

  // // test("changeProfilePicture", async () => {
  // //   const body = {
  // //     userID: globalUserID,
  // //     image:""
  // //   };
});
