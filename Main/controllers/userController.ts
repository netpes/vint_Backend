// Essential imports
import mongoose from "mongoose";
const User = require("../models/userModel");
const Email = require("../models/EmailVerifyModel");

// External Functions
const {
  sendEmail,
  passwordGenerator,
  changePassword,
  sendVerifyEmailAgain,
  checkEmail,
} = require("../assets/userFunctions");
// Types
import { User } from "./types/userTypes";

module.exports = {
  Signup: (req, res) => {},
};
