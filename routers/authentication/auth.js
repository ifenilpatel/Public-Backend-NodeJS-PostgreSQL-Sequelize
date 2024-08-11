const express = require("express");
let router = express.Router();

const { auth } = require("../../configuration/middleware/guard.js");

const {
  fun_Register_User,
  fun_Signin,
  fun_Send_Email_OTP,
  fun_Verify_Email,
  fun_Forgot_Password,
  fun_Change_Password,
} = require("../../controllers/modules/authentication/auth.ctrl.js");

router.post("/register", (request, response) => {
  return fun_Register_User(request, response);
});

router.post("/emailverification", auth, (request, response) => {
  return fun_Verify_Email(request, response);
});

router.post("/signin", (request, response) => {
  return fun_Signin(request, response);
});

router.post("/resendemailotp", (request, response) => {
  return fun_Send_Email_OTP(request, response);
});

router.post("/forgotpassword", (request, response) => {
  return fun_Forgot_Password(request, response);
});

router.post("/changepassword", auth, (request, response) => {
  return fun_Change_Password(request, response);
});

module.exports = router;
