import { describe, expect, test } from "@jest/globals";
import axios from "axios";
import { typeUser } from "./types";

const {
  checkEmail,
  sendEmail,
  passwordGenerator,
} = require("../controllers/productController");

const globalUser: typeUser = {
  username: "username",
  email: "vinttnrr@gmail.com",
  name: "user",
  password: "user-password",
  phone: "0500000000",
};
const globalUserID = "";
const verifyEmailCode = "";

test("checkEmail", () => {
  const toEmail = globalUser.email;

  expect(checkEmail(toEmail)).toBe(true);
});

test("sendEmail", () => {
  const subject = "subject";
  const html = "<h1></h1>";
  const toEmail = globalUser.email;

  expect(sendEmail(subject, html, toEmail)).toBe(true);
});

test("passwordGenerator", () => {
  const newPassword = passwordGenerator(8);
  expect(newPassword.length).toBe(8);
  expect(typeof newPassword).toBe("string");
});

test("changePassword", async () => {
  const body = {
    userID: globalUserID,
    newPassword: "qwer",
  };

  const res = await axios.post(
    `${process.env.BACKEND_URL_FOR_TESTS}user/changePassword`,
    body
  );

  expect(res).toBeTruthy();
});

test("sendVerifyEmailAgain", async () => {
  const body = {
    userID: globalUserID,
    email: globalUser.email,
  };

  const res = await axios.post(
    `${process.env.BACKEND_URL_FOR_TESTS}user/sendVerifyEmailAgain`,
    body
  );

  expect(res).toBeTruthy();
});

test("signUp", async () => {
  const body: typeUser = { ...globalUser };

  const res = await axios.post(
    `${process.env.BACKEND_URL_FOR_TESTS}user/signUp`,
    body
  );

  expect(res).toBeTruthy();
});

test("verifyEmail", async () => {
  const body = {
    userID: globalUserID,
    code: verifyEmailCode,
  };

  const res = await axios.post(
    `${process.env.BACKEND_URL_FOR_TESTS}user/verifyEmail`,
    body
  );

  expect(res).toBeTruthy();
});

test("userInfo", async () => {
  const body = {
    userID: globalUserID,
  };

  const res = await axios.post(
    `${process.env.BACKEND_URL_FOR_TESTS}user/userInfo`,
    body
  );

  expect(res).toBeTruthy();
});

test("login", async () => {
  const body = {
    username: globalUser.username,
    password: globalUser.password,
  };

  const res = await axios.post(
    `${process.env.BACKEND_URL_FOR_TESTS}user/login`,
    body
  );

  expect(res).toBeTruthy();
});

test("changeEmail", async () => {
  const body = {
    userID: globalUserID,
    newEmail: globalUser.email,
  };

  const res = await axios.post(
    `${process.env.BACKEND_URL_FOR_TESTS}user/changeEmail`,
    body
  );

  expect(res).toBeTruthy();
});

test("forgotPassword", async () => {
  const body = {
    username: globalUser.username,
  };

  const res = await axios.post(
    `${process.env.BACKEND_URL_FOR_TESTS}user/forgotPassword`,
    body
  );

  expect(res).toBeTruthy();
});

test("deleteAccount", async () => {
  const body = {
    userID: globalUserID,
  };

  const res = await axios.post(
    `${process.env.BACKEND_URL_FOR_TESTS}user/deleteAccount`,
    body
  );

  expect(res).toBeTruthy();
});

// test("changeProfilePicture", async () => {
//   const body = {
//     userID: globalUserID,
//     image:""
//   };

//   const res = await axios.post(
//     `${process.env.BACKEND_URL_FOR_TESTS}user/changeProfilePicture`,
//     body
//   );

//   expect(res).toBeTruthy();
// });

// test("getWishList", async () => {
//   const body = {
//     userID: globalUserID,
//   };

//   const res = await axios.post(
//     `${process.env.BACKEND_URL_FOR_TESTS}user/getWishList`,
//     body
//   );

//   expect(res).toBeTruthy();
// });

// test("addToWishList", async () => {});

// test("removeFromWishList", async () => {});

// test("addProductToUserProductsList", async () => {});
// test("removeProductFromUserProductsList", async () => {});
// test("getUserProductsList", async () => {});

// test("addSellerToFollowingList", async () => {});

// test("removeSellerFromFollowingList", async () => {});

// test("getFollowingList", async () => {});

// test("verifyToken", async () => {});

// test("getUserById", async () => {});
