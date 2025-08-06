const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth-controllers");

// ✅ Import controllers and middleware
const {signupSchema, loginSchema} = require("../validators/auth-validator");
const validate = require("../middlewares/validate-middleware");
const authMiddleware = require("../middlewares/auth-middleware");


// ✅ Register route using .route().post()

router.route("/register")
  .post(validate(signupSchema), authController.register);

// ✅ Login route

router.route("/login")
  .post(validate(loginSchema), authController.login);

// ✅ Get user

router.route("/user").get(authMiddleware, authController.user);

module.exports = router;
