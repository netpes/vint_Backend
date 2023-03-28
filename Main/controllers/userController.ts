import mongoose from 'mongoose'
const User = require("../models/userModel")
const Email = require("../models/EmailVerifyModel")
const {sendEmail, passwordGenerator, changePassword, sendVerifyEmailAgain, checkEmail} = require("../assets/userFunctions")
module.exports = {
    Signup:(req,res)=>{

    }
}