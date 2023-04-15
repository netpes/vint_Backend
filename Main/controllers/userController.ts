// Essential imports
import mongoose from "mongoose";
import { Request, Response } from "express";

const bcrypt = require("bcrypt");
const jsonwebtoken = require("jsonwebtoken");
const nodemailer = require("nodemailer");
// const { cloudinaryUpload } = require("../GlobaFunction/CloudinaryFunctions");

const User = require("../models/userModel");
const EmailVerify = require("../models/EmailVerifyModel");
// const Product = require("../models/productModel");

const res200 = (res: Response, obj) => {
  res.status(200).json(obj);
};

const res400 = (res: Response, obj) => {
  res.status(400).json(obj);
};
const res500 = (res: Response, err, obj) => {
  res.status(500).json({ ...obj, err });
};

const checkIfEmailValid = (toEmail: string) => {
  console.log("checkIfEmailValid");

  if (!toEmail.endsWith("@gmail.com")) {
    console.log("This Mail Address Is Not Valid!!!");
    return false;
  }

  console.log("This Mail Address Is Valid");
  return true;
};

const sendEmail = (subject: string, html: string, toEmail: string) => {
  console.log("sendEmail");

  try {
    if (!toEmail.endsWith("@gmail.com")) return false;

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      service: "gmail",
      port: 465,
      secure: true, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    transporter.sendMail({
      from: "Vint System",
      to: toEmail,
      subject: subject,
      text: "",
      html: html,
    });

    return true;
  } catch (error) {
    console.log({ message: "Error - Email", err: error });
    return false;
  }
};

const createNewEmailVerify = async (user) => {
  try {
    console.log("createNewEmailVerify");

    const VerificationCode = Math.round(Math.random() * 899999 + 100000);
    sendEmail(
      "Email Verification",
      `<b> Your Code For Verification Is: ${VerificationCode}</b>`,
      user.email
    );

    const isNewEmailVerify = await EmailVerify.findOneAndUpdate(
      { userID: user._id },
      { code: VerificationCode }
    );

    if (!isNewEmailVerify) {
      const newEmailVerify = await EmailVerify.create({
        userID: user._id,
        code: VerificationCode,
      });

      await newEmailVerify.save();
    }

    user.isActive = false;
    await user.save();

    return true;
  } catch (error) {
    return false;
  }
};

const passwordGenerator = (newPasswordLength: number) => {
  console.log("passwordGenerator");

  const chars =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

  let newPassword = "";

  for (let i = 0; i < newPasswordLength; i++) {
    newPassword += chars[Math.floor(Math.random() * chars.length)];
  }
  return newPassword;
};

// (userID, newPassword)
const changePassword = async (req: Request, res: Response) => {
  try {
    console.log("changePassword");
    const { userID, newPassword } = req.body;

    if (!mongoose.Types.ObjectId.isValid(userID) || !newPassword)
      return res400(res, { message: "Error - changePassword" });

    const hashPassword = await bcrypt.hash(newPassword, 10);

    User.findByIdAndUpdate(userID, { password: hashPassword }).then((user) => {
      if (!user.password) {
        res400(res, { message: "Error - changePassword" });
      } else {
        res200(res, { message: "Password changed" });
      }
    });
  } catch (err) {
    res500(res, err, { message: "Error - change password" });
  }
};

// (userID)
const sendVerifyEmailAgain = async (req: Request, res: Response) => {
  console.log("sendVerifyEmailAgain");

  try {
    const { userID } = req.body;
    if (!mongoose.Types.ObjectId.isValid(userID))
      return res400(res, { message: "userID false" });

    User.findById(userID).then((user) => {
      if (!user) return res400(res, { message: "User not found" });
      else {
        if (!checkIfEmailValid(user.email)) {
          return res400(res, { message: "This Mail Address Is Not Valid!!!" });
        }

        createNewEmailVerify(user).then((isSuccess) => {
          if (isSuccess) {
            res200(res, {
              message: "User Updated successfully",
            });
          } else {
            res500(res, {}, { message: "Error signing up" });
          }
        });
      }
    });
  } catch (err) {
    res500(res, err, { message: "Error - sendVerifyEmailAgain" });
  }
};

export {
  checkIfEmailValid,
  sendEmail,
  createNewEmailVerify,
  passwordGenerator,
};

/// (name,password,email,phone,username)
exports.signUp = async (req: Request, res: Response) => {
  try {
    console.log("signUp");
    const { password, email } = req.body;

    if (!checkIfEmailValid(email))
      return res
        .status(400)
        .json({ message: "This Mail Address Is Not Valid!!!" });

    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      ...req.body,
      password: hashPassword,
    });

    newUser.save().then((user) => {
      if (!user) res.status(400).json({ message: "User Creation Failed" });
      else {
        const token = jsonwebtoken.sign(
          { id: user._id },
          process.env.JWT_TOKEN
        );

        createNewEmailVerify(user).then((isSuccess) => {
          console.log(isSuccess);

          if (isSuccess) {
            res200(res, {
              message: "User Created",
              userID: user._id,
              token,
              email: email,
            });
          } else {
            res500(res, {}, { message: "Error signing up" });
          }
        });
      }
    });
  } catch (error) {
    res500(res, error, { message: "Error signing up" });
  }
};

/// (userID, code)
exports.verifyEmail = (req: Request, res: Response) => {
  try {
    console.log("verifyEmail");

    if (!mongoose.Types.ObjectId.isValid(req.body.userID))
      return res400(res, { message: "userID false" });

    EmailVerify.findOne({ userID: req.body.userID }).then((emailVerify) => {
      if (!emailVerify)
        res.status(400).json({ message: "emailVerify not found" });
      else {
        if (req.body.code == emailVerify.code.toString()) {
          EmailVerify.findOneAndDelete({ userID: req.body.userID }).catch(
            (err) => {
              return res
                .status(500)
                .json({ message: "VerifyEmail - delete failed", err });
            }
          );

          User.findByIdAndUpdate(req.body.userID, { isActive: true }).catch(
            (err) => {
              return res
                .status(500)
                .json({ message: "User Update - Update failed", err });
            }
          );

          res.status(200).json({
            message: "The Verification Code Is Correct",
            correctCode: true,
          });
        } else {
          res.status(200).json({
            message: "The Verification Code Is Wrong",
            correctCode: false,
          });
        }
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Error - verifyEmail", err: error });
  }
};

/// (userID)
exports.userInfo = (req: Request, res: Response) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.body.userID))
      return res400(res, { message: "userID false" });

    const { userID } = req.body;
    User.findOne({ _id: userID })
      .populate("userProducts")
      .then((user) => {
        res.send(user);
      });
  } catch (error) {
    res500(res, error, { message: "" });
  }
};

//    expect(res.statusCode >= 400).toBe(true);
//    expect(res.statusCode).toBe(200);

/// (username, password)
exports.login = (req: Request, res: Response) => {
  try {
    console.log("login");

    const { username, password } = req.body;

    User.findOne({ username: username }).then((user) => {
      if (!user) res.status(400).json({ message: "User not found" });
      else {
        const token = jsonwebtoken.sign(
          { id: user._id },
          process.env.JWT_TOKEN
        );

        bcrypt
          .compare(password.toString(), user.password)
          .then((bcryptPassword) => {
            if (!bcryptPassword) {
              res.status(400).json({ message: "Password incorrect" });
            } else {
              User.findByIdAndUpdate(user._id, {
                loginCounter: user.loginCounter + 1,
              }).catch(() => {
                return res
                  .status(400)
                  .json({ message: "login - User Update Failed" });
              });

              res.status(200).json({
                message: "User Logged in",
                userID: user._id,
                isActive: user.isActive,
                token,
                email: req.body.email,
              });
            }
          });
      }
    });
  } catch (err) {
    res.status(500).json({ message: "Error - login", err: err });
  }
};

/// (userID, newEmail)
exports.changeEmail = (req: Request, res: Response) => {
  try {
    const { userID, newEmail } = req.body;
    if (!mongoose.Types.ObjectId.isValid(userID))
      return res400(res, { message: "userID false" });

    if (!checkIfEmailValid(newEmail))
      return res
        .status(400)
        .json({ message: "This Mail Address Is Not Valid!!!" });

    User.findByIdAndUpdate(userID, { email: newEmail }).then((user) => {
      if (!user) {
        res.status(400).json({ message: "Change Email Faild" });
      } else {
        sendVerifyEmailAgain(req, res);
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Error - changeEmail", err: error });
  }
};

/// (username)
exports.forgotPassword = (req: Request, res: Response) => {
  try {
    const { username } = req.body;
    User.findOne({ username: username }).then((user) => {
      if (!user) res.status(400).json({ message: "Can't Find User" });
      else {
        if (!checkIfEmailValid(user.email))
          return res
            .status(403)
            .json({ message: "This Mail Address Is Not Valid!!!" });

        const newPassword = passwordGenerator(8);
        sendEmail(
          "Forgot Password",
          `<div> Your New Password Is: <strong>${newPassword}</strong> You Can Change This Password</div>
          <div> <strong> Vint System </strong> </div>`,
          user.email
        );

        changePassword(
          { body: { userID: user._id, newPassword: newPassword } },
          res
        );

        // res.status(200).json({message: "Password Sent To User Email"});
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Error - forgotPassword", err: error });
  }
};

/// (userID)
exports.deleteAccount = (req: Request, res: Response) => {
  try {
    const { userID } = req.body;
    if (!mongoose.Types.ObjectId.isValid(userID))
      return res400(res, { message: "userID false" });

    User.findByIdAndDelete(userID).then((user) => {
      if (!user) res.status(400).json({ message: "User not found" });
      else {
        sendEmail(
          "Account Deleted",
          `<div> Goodbye ${user.name} Your Account Has Deleted </div>
          <div> <strong> Vint System </strong> </div>`,
          user.email
        );
        res.status(200).json({ message: "User deleted" });
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Error - Delete Account", err: error });
  }
};

/// (token, userID)//////
exports.verifyToken = async (req: Request, res: Response) => {
  try {
    console.log("verifyToken");

    if (!mongoose.Types.ObjectId.isValid(req.body.userID))
      return res400(res, { message: "userID false" });

    const user = await User.findById(req.body.userID);
    if (!user) {
      return res.status(400).json({ message: "User not found", verify: false });
    }

    try {
      const decoded = await jsonwebtoken.verify(
        req.body.token,
        process.env.JWT_TOKEN
      );
      return res.status(200).json({ message: "Verify Token", verify: true });
    } catch (err) {
      console.log("this is err", err);
      return res.status(400).json({ message: "Unverify Token", verify: false });
    }
  } catch (err) {
    console.log("this is err", err);
    res
      .status(500)
      .json({ message: "Error - verifyToken", err: err, verify: false });
  }
};

//////////////////// (userID) ///////////////
exports.getUserById = (req: Request, res: Response) => {
  try {
    console.log("getUserById");

    if (!mongoose.Types.ObjectId.isValid(req.body.userID))
      return res400(res, { message: "userID false" });

    User.findById(req.body.userID).then((user) => {
      if (!user) res.status(400).json({ message: "User Not Found" });
      else {
        res.status(200).json({ message: "User Found", user });
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Error - getUserById", error });
  }
};

exports.changePassword = changePassword;

exports.sendVerifyEmailAgain = sendVerifyEmailAgain;

//////////// Following List //////////////////////////////////////////////////////////////////
// (userID)
exports.getFollowingList = (req: Request, res: Response) => {
  try {
    console.log("getFollowingList");

    if (!mongoose.Types.ObjectId.isValid(req.body.userID))
      return res400(res, { message: "userID false" });

    User.findById(req.body.userID).then((user) => {
      if (!user) res.status(400).json({ message: "User not found" });
      else {
        user?.populate("following").then((populateUser) => {
          res.status(200).json({
            message: "following list",
            following: populateUser.following,
          });
        });
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Error - getFollowingList", err: error });
  }
};

// (userID, newFollowingID)
exports.addSellerToFollowingList = (req: Request, res: Response) => {
  try {
    console.log("addSellerToFollowingList");

    if (!mongoose.Types.ObjectId.isValid(req.body.userID))
      return res400(res, { message: "userID false" });

    User.findById(req.body.userID).then((user) => {
      if (!user) res.status(400).json({ message: "User not found" });
      else {
        if (user.following.includes(req.body.newFollowingID)) {
          res200(res, { message: "User Already In FollowingList" });
        } else {
          const tempArray = [...user.following];
          tempArray.push(req.body.newFollowingID);
          User.findByIdAndUpdate(req.body.userID, {
            following: tempArray,
          }).then((updateUser) => {
            res200(res, { message: "updated", user: updateUser });
          });
        }
      }
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error - addSellerToFollowingList", err: error });
  }
};

/// (userID, idToRemove)
exports.removeSellerFromFollowingList = (req: Request, res: Response) => {
  try {
    console.log("removeSellerFromFollowingList");

    if (!mongoose.Types.ObjectId.isValid(req.body.userID))
      return res400(res, { message: "userID false" });

    User.findById(req.body.userID).then((user) => {
      if (!user) res.status(400).json({ message: "User not found" });
      else {
        if (!user.following.includes(req.body.idToRemove)) {
          res.status(400).json({ message: "The userID Is Not Listed" });
        } else {
          User.findByIdAndUpdate(req.body.userID, {
            following: [
              ...user.following.filter(
                (item) => item.toString() != req.body.idToRemove
              ),
            ],
          }).then((updateUser) => {
            res200(res, { message: "Following Removed" });
          });
        }
      }
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error - removeSellerFromFollowingList", err: error });
  }
};

//////////// userProducts //////////////////////////////////////////////////////////////////
//(userID)
exports.getUserProductsList = (req: Request, res: Response) => {
  try {
    console.log("getUserProductsList");

    if (!mongoose.Types.ObjectId.isValid(req.body.userID))
      return res400(res, { message: "userID false" });

    User.findById(req.body.userID).then((user) => {
      if (!user) res.status(400).json({ message: "User not found" });
      else {
        user.populate("userProducts").then((populateUser) => {
          res.status(200).json({
            message: "user Products",
            userProducts: populateUser.userProducts,
          });
        });
      }
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error - getUserProductsList", err: error });
  }
};

/// (userID, productID)
exports.addProductToUserProductsList = (req: Request, res: Response) => {
  try {
    console.log("addProductToUserProductsList");

    if (!mongoose.Types.ObjectId.isValid(req.body.userID))
      return res400(res, { message: "userID false" });

    User.findById(req.body.userID).then((user) => {
      if (!user) res.status(400).json({ message: "User not found" });
      else {
        if (user.userProducts.includes(req.body.productID)) {
          res200(res, { message: "Product Already In userProducts" });
        } else {
          const tempArray = [...user.userProducts];
          tempArray.push(req.body.productID);
          User.findByIdAndUpdate(req.body.userID, {
            userProducts: tempArray,
          }).then((updateUser) => {
            res200(res, { message: "updated", user: updateUser });
          });
        }
      }
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error - addProductToUserProductsList", err: error });
  }
};

/// (userID, productIDToRemove)
exports.removeProductFromUserProductsList = (req: Request, res: Response) => {
  try {
    console.log("removeProductFromUserProductsList");

    if (!mongoose.Types.ObjectId.isValid(req.body.userID))
      return res400(res, { message: "userID false" });

    User.findById(req.body.userID).then((user) => {
      if (!user) res.status(400).json({ message: "User not found" });
      else {
        if (!user.userProducts.includes(req.body.productIDToRemove)) {
          res.status(400).json({ message: "The productID Is Not Listed" });
        } else {
          User.findByIdAndUpdate(req.body.userID, {
            userProducts: [
              ...user.userProducts.filter(
                (item) => item.toString() != req.body.productIDToRemove
              ),
            ],
          }).then((updateUser) => {
            res200(res, { message: "Product Removed" });
          });
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      message: "Error - removeProductFromUserProductsList",
      err: error,
    });
  }
};

////////// wish list //////////////////////////////////////////////////////////////////

// (userID)
exports.getWishList = (req: Request, res: Response) => {
  try {
    console.log("getWishList");

    if (!mongoose.Types.ObjectId.isValid(req.body.userID))
      return res400(res, { message: "userID false" });

    User.findById(req.body.userID).then((user) => {
      if (!user) res.status(400).json({ message: "User not found" });
      else {
        user.populate("WishList").then((populateUser) => {
          res.status(200).json({
            message: "wish list",
            countOFItems: user.WishList.length,
            WishList: populateUser.WishList,
          });
        });
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Error - getWishList", err: error });
  }
};

/// (userID, productID)
exports.addToWishList = (req: Request, res: Response) => {
  try {
    console.log("addToWishList");

    if (!mongoose.Types.ObjectId.isValid(req.body.userID))
      return res400(res, { message: "userID false" });

    User.findById(req.body.userID).then((user) => {
      if (!user) res.status(400).json({ message: "User not found" });
      else {
        if (user.WishList.includes(req.body.productID)) {
          res200(res, { message: "Product Already In WishList" });
        } else {
          const tempArray = [...user.WishList];
          tempArray.push(req.body.productID);
          User.findByIdAndUpdate(req.body.userID, {
            WishList: tempArray,
          }).then((updateUser) => {
            res200(res, { message: "updated", user: updateUser });
          });
        }
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Error - addToWishList", err: error });
  }
};

/// (userID, productIDToRemove)
exports.removeFromWishList = (req: Request, res: Response) => {
  try {
    console.log("removeFromWishList");

    if (!mongoose.Types.ObjectId.isValid(req.body.userID))
      return res400(res, { message: "userID false" });

    User.findById(req.body.userID).then((user) => {
      if (!user) res.status(400).json({ message: "User not found" });
      else {
        if (!user.WishList.includes(req.body.productIDToRemove)) {
          res.status(400).json({ message: "The productID Is Not Listed" });
        } else {
          User.findByIdAndUpdate(req.body.userID, {
            WishList: [
              ...user.WishList.filter(
                (item) => item.toString() != req.body.productIDToRemove
              ),
            ],
          }).then((updateUser) => {
            res200(res, { message: "Product Removed" });
          });
        }
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Error - removeFromWishList", err: error });
  }
};

////////////// (userID,  image = (size,mimetype,data,typeImageOrVideo))
// exports.changeProfilePicture = async (req: Request, res: Response) => {
//   try {
//     const {size, mimetype, data, typeImageOrVideo} = req.file;

//     const {userID} = req.body;

//     const pic_URL = await cloudinaryUpload({
//       size,
//       mimetype,
//       data,
//       typeImageOrVideo,
//     });

//     User.findByIdAndUpdate(userID, {profilePicture: pic_URL}).then((user) => {
//       if (!user) res.status(404).json({message: "Can't Find User"});
//       else {
//         res.status(200).json({
//           message: "Update Successfuly - Profile Picture",
//           URL: pic_URL,
//         });
//       }
//     });
//   } catch (error) {
//     res.status(500).json({message: "Error - changeProfilePicture", err: error});
//   }
// };
