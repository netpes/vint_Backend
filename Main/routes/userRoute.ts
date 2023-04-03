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
  verifyToken
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

// router.post(
//   "/changeProfilePicture",
//   upload.single("file"),
//   changeProfilePicture
// );

router.post("/verifyToken", verifyToken);

// router.post("/getWishList", getWishList);
// router.post("/removeFromWishList", removeFromWishList);
// router.post("/addToWishList", addToWishList);

// router.post("/addSellerToFollowingList", addSellerToFollowingList);
// router.post("/getFollowingList", getFollowingList);
// router.post("/removeSellerFromFollowingList", removeSellerFromFollowingList);

// router.post(
//   "/removeProductFromUserProductsList",
//   removeProductFromUserProductsList
// );
// router.post("/getUserProductsList", getUserProductsList);
// router.post("/addProductToUserProductsList", addProductToUserProductsList);
// router.post("/getUserById", getUserById);

module.exports = router;
