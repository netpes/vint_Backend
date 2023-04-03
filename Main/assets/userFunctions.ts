// const bcrypt = require("bcrypt");
// const jsonwebtoken = require("jsonwebtoken");
// const nodemailer = require("nodemailer");
// const User = require("../models/userModel")
// const EmailVerify = require("../models/EmailVerifyModel")
// const checkEmail = (toEmail) => {
//     if (!toEmail.endsWith("@gmail.com")) {
//         console.log("This Mail Address Is Not Valid!!!");
//         return false;
//     }
//     return true;
// };

// const sendEmail = (subject, html, toEmail) => {
//     try {
//         if (!toEmail.endsWith("@gmail.com")) return;

//         const transporter = nodemailer.createTransport({
//             host: "smtp.gmail.com",
//             service: "gmail",
//             port: 465,
//             secure: true, // true for 465, false for other ports
//             auth: {
//                 user: process.env.EMAIL,
//                 pass: process.env.EMAIL_PASSWORD,
//             },
//         });

//         transporter.sendMail({
//             from: "Vint System",
//             to: toEmail,
//             subject: subject,
//             text: "",
//             html: html,
//         });
//         // .then((response) => {
//         //   // console.log({
//         //   //   message: "Email sent successfully",
//         //   //   response,
//         //   // });
//         //   console.log("response", response);
//         // });
//     } catch (error) {
//         console.log({message: "Error - Email", err: error});
//     }
// };
// const passwordGenerator = (newPasswordLength) => {
//     const chars =
//         "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

//     let newPassword = "";

//     for (let i = 0; i < newPasswordLength; i++) {
//         newPassword += chars[Math.floor(Math.random() * chars.length)];
//     }
//     return newPassword;
// };

// const changePassword = async (req, res) => {
//     try {
//         const body = req.body;
//         const newPassword = await bcrypt.hash(req.body.newPassword, 10);

//         User.findByIdAndUpdate(body.userID, {password: newPassword}).then(
//             (user) => {
//                 if (!user.password) {
//                     res.status(400).json({message: "Error - changePassword"});
//                 } else {
//                     console.log(newPassword);
//                     res.status(200).json({message: "Password changed"});
//                 }
//             }
//         );
//     } catch (err) {
//         res.status(500).json({message: "Error - change password", err: err});
//     }
// };

// const sendVerifyEmailAgain = (req, res) => {
//     try {
//         const body = req.body;

//         if (!checkEmail(body.email))
//             return res
//                 .status(400)
//                 .json({message: "This Mail Address Is Not Valid!!!"});

//         User.findById(body.userID).then((user) => {
//             if (!user) return res.status(400).json({message: "User not found"});
//             else {
//                 const VerificationCode = Math.round(Math.random() * 899999 + 100000);

//                 sendEmail(
//                     "Email Verification",
//                     `<b> Your Code For Verification Is: ${VerificationCode}</b>`,
//                     body.email
//                 );

//                 const newEmailVerify = new EmailVerify({
//                     userID: user._id,
//                     code: VerificationCode,
//                 });

//                 newEmailVerify.save().then((emailVerify) => {
//                     if (!emailVerify)
//                         return res
//                             .status(400)
//                             .json({message: "Failed To Send Verification Code"});
//                     else {
//                         console.log({message: "Verification Code sent successfully"});

//                         user.isActive = false;
//                         user
//                             .save()
//                             .then((user) => {
//                                 res.status(200).send({message: "User Updated successfully"});
//                             })
//                             .catch((err) => {
//                                 return res.status(500).json({
//                                     message: "Error - sendVerifyEmailAgain - User Update",
//                                     err: err,
//                                 });
//                             });
//                     }
//                 });
//             }
//         });
//     } catch (err) {
//         res.status(500).json({message: "Error - sendVerifyEmailAgain", err: err});
//     }
// };

// module.exports = {sendEmail, passwordGenerator, changePassword, sendVerifyEmailAgain, checkEmail}