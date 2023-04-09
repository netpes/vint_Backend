import express from "express";
const router = express.Router();
const multer = require("multer");
const upload = multer();

const {
  signUp,
  login,
  changePassword,
  verifyEmail,
  changeEmail,
  deleteAccount,
  forgotPassword,
  sendVerifyEmailAgain,
  userInfo,
  verifyToken,
  getUserById,
  getFollowingList,
  addSellerToFollowingList,
  removeSellerFromFollowingList,

  getWishList,
  removeFromWishList,
  addToWishList,

  getUserProductsList,
  addProductToUserProductsList,
  removeProductFromUserProductsList,
} = require("../controllers/userController");

router.post("/signUp", signUp);
router.post("/login", login);
router.post("/changePassword", changePassword);
router.post("/verifyEmail", verifyEmail);
router.post("/changeEmail", changeEmail);
router.post("/deleteAccount", deleteAccount);
router.post("/forgotPassword", forgotPassword);
router.post("/sendVerifyEmailAgain", sendVerifyEmailAgain);
router.post("/userinfo", userInfo);

router.post("/verifyToken", verifyToken);
// router.post(
//   "/changeProfilePicture",
//   upload.single("file"),
//   changeProfilePicture
// );

router.post("/getUserById", getUserById);

router.post("/getFollowingList", getFollowingList);
router.post("/addSellerToFollowingList", addSellerToFollowingList);
router.post("/removeSellerFromFollowingList", removeSellerFromFollowingList);

router.post("/getUserProductsList", getUserProductsList);
router.post("/addProductToUserProductsList", addProductToUserProductsList);
router.post(
  "/removeProductFromUserProductsList",
  removeProductFromUserProductsList
);

router.post("/getWishList", getWishList);
router.post("/addToWishList", addToWishList);
router.post("/removeFromWishList", removeFromWishList);

module.exports = router;
