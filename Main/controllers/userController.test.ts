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

test("verifyToken", async () => {
  const body = {
    userID: globalUserID,
    token:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0MmFhNmI2MTVmMTgwOTM4NDgzODI4ZCIsImlhdCI6MTY4MDUyMjM5OX0.Ws_I1I8U3x4Mf2wR4GMtEDYFLnwzSEvx17_fzr6N8y0",
  };

  const res = await axios.post(
    `${process.env.BACKEND_URL_FOR_TESTS}user/verifyToken`,
    body
  );

  console.log(res);

  expect(res.status).toBe(200);
  expect(res.data).toEqual({ message: "Verify Token", verify: true });
});

test("getUserById", async () => {
  const body = {
    userID: globalUserID,
  };

  const res = await axios.post(
    `${process.env.BACKEND_URL_FOR_TESTS}user/getUserById`,
    body
  );

  expect(res.status).toBe(200);
});

test("getFollowingList", async () => {
  const body = {
    userID: globalUserID,
  };

  const res = await axios.post(
    `${process.env.BACKEND_URL_FOR_TESTS}user/getFollowingList`,
    body
  );

  expect(res.status).toBe(200);
});

test("addSellerToFollowingList", async () => {
  const body = {
    userID: globalUserID,
    newFollowingID: "6412b66799d3a23e507dcdd0",
  };

  const res = await axios.post(
    `${process.env.BACKEND_URL_FOR_TESTS}user/addSellerToFollowingList`,
    body
  );

  expect(res.status).toBe(200);
});

test("removeSellerFromFollowingList", async () => {
  const body = {
    userID: globalUserID,
    idToRemove: "6412b66799d3a23e507dcdd0",
  };

  const res = await axios.post(
    `${process.env.BACKEND_URL_FOR_TESTS}user/removeSellerFromFollowingList`,
    body
  );

  expect(res.status).toBe(200);
});

test("getUserProductsList", async () => {
  const body = {
    userID: globalUserID,
  };

  const res = await axios.post(
    `${process.env.BACKEND_URL_FOR_TESTS}user/getUserProductsList`,
    body
  );

  expect(res.status).toBe(200);
});

test("addProductToUserProductsList", async () => {
  const body = {
    userID: globalUserID,
    productID: "6412c802a259648cb1fb64ed",
  };

  const res = await axios.post(
    `${process.env.BACKEND_URL_FOR_TESTS}user/addProductToUserProductsList`,
    body
  );

  expect(res.status).toBe(200);
});

test("removeProductFromUserProductsList", async () => {
  const body = {
    userID: globalUserID,
    productIDToRemove: "6412b66799d3a23e507dcdd0",
  };

  const res = await axios.post(
    `${process.env.BACKEND_URL_FOR_TESTS}user/removeProductFromUserProductsList`,
    body
  );

  expect(res.status).toBe(200);
});

test("getWishList", async () => {
  const body = {
    userID: globalUserID,
  };

  const res = await axios.post(
    `${process.env.BACKEND_URL_FOR_TESTS}user/getWishList`,
    body
  );

  expect(res.status).toBe(200);
});

test("addToWishList", async () => {
  const body = {
    userID: globalUserID,
    productID: "6412c802a259648cb1fb64ed",
  };

  const res = await axios.post(
    `${process.env.BACKEND_URL_FOR_TESTS}user/addToWishList`,
    body
  );

  expect(res.status).toBe(200);
});

test("removeFromWishList", async () => {
  const body = {
    userID: globalUserID,
    productIDToRemove: "6412b66799d3a23e507dcdd0",
  };

  const res = await axios.post(
    `${process.env.BACKEND_URL_FOR_TESTS}user/removeFromWishList`,
    body
  );

  expect(res.status).toBe(200);
});

// test("changeProfilePicture", async () => {
//   const body = {
//     userID: globalUserID,
//     image:""
//   };
