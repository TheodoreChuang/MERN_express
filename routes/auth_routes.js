const express = require("express");
const router = express.Router();
const { celebrate, Joi } = require("celebrate");
const AuthController = require("../controllers/auth_controller");

//// @Base Route '/'

//// Login exist user
router.post(
  "/login",
  celebrate({
    body: {
      email: Joi.string()
        .email()
        .required(),
      password: Joi.string().required()
    }
  }),
  AuthController.login
);

//// Register new user
router.post(
  "/register",
  celebrate({
    body: {
      first_name: Joi.string()
        .min(1)
        .max(40)
        .required(),
      last_name: Joi.string()
        .min(1)
        .max(40)
        .required(),
      nickname: Joi.string()
        .min(1)
        .max(40)
        .required(),
      email: Joi.string()
        .email()
        .required(),
      password: Joi.string()
        .min(6)
        .max(40)
        .required(),
      terms_conditions: Joi.boolean()
        .valid(true)
        .required()
    }
  }),
  AuthController.register
);

//// Forget Password Feature:

//// Forget Password 1: Send password reset link
router.post(
  "/reseturl",
  celebrate({
    body: {
      email: Joi.string()
        .email()
        .required()
    }
  }),
  AuthController.sendPasswordResetURL
);

//// Forget Password 2: Reset password token
router.get("/resetpassword/:token", AuthController.verifyPasswordToken);

//// Forget Password 3: Reset password
router.put(
  "/resetpassword/:token",
  celebrate({
    body: {
      password: Joi.string()
        .min(6)
        .max(40)
        .required()
    }
  }),
  AuthController.changePasswordViaEmail
);

//// Change password while logged in App
router.put(
  "/changepassword",
  passport.authenticate("jwt", { session: false }),
  // celebrate({
  //   body: {
  //     password: Joi.string()
  //       .min(6)
  //       .max(40)
  //       .required()
  //   }
  // }),
  AuthController.changePassword
);

module.exports = router;
