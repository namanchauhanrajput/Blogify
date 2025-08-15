const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth-controllers");

const { signupSchema, loginSchema } = require("../validators/auth-validator");
const validate = require("../middlewares/validate-middleware");
const authMiddleware = require("../middlewares/auth-middleware");

router.post("/register", validate(signupSchema), authController.register);
router.post("/login", validate(loginSchema), authController.login);
router.get("/user", authMiddleware, authController.user);

router.post("/forget-password", authController.forgetPassword);
router.post("/reset-password", authController.resetPassword);

module.exports = router;
