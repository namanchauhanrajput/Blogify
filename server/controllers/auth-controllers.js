const User = require("../models/user-model");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
require("dotenv").config();

// ========================= REGISTER =========================
const register = async (req, res) => {
  try {
    const { username, name, email, phone, password } = req.body;

    const userExist = await User.findOne({ username });
    if (userExist) {
      return res.status(400).json({ message: "Username is not available" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      username,
      name,
      email,
      phone,
      password: hashedPassword,
    });

    res.status(201).json({
      message: "User registered successfully",
      token: newUser.generateToken(),
      userId: newUser._id.toString(),
    });
  } catch (error) {
    console.log("Register error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ========================= LOGIN =========================
const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const userExist = await User.findOne({ username });

    if (!userExist) {
      return res.status(400).json({ message: "Invalid Username or Password" });
    }

    const isMatch = await bcrypt.compare(password, userExist.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid Username or Password" });
    }

    const token = userExist.generateToken();

    return res.status(200).json({
      message: "Login successful",
      token,
      userId: userExist._id.toString(),
    });

  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// ========================= USER INFO =========================
const user = async (req, res) => {
  try {
    const userData = req.user;
    res.status(200).json({ userData });
  } catch (error) {
    res.status(500).json({ message: "Server error from user route" });
  }
};

// ==================== EMAIL TRANSPORTER ====================
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ========================= FORGET PASSWORD =========================
const forgetPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    user.otpExpiry = Date.now() + 10 * 60 * 1000;
    await user.save();

    await transporter.sendMail({
      to: user.email,
      subject: "Password Reset OTP",
      text: `Your OTP is ${otp}. It is valid for 10 minutes.`
    });

    res.json({ message: "OTP sent to your email" });
  } catch (err) {
    console.error("Forget password error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ========================= RESET PASSWORD =========================
const resetPassword = async (req, res) => {
  try {
    const { otp, newPassword, confirmPassword } = req.body;

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const user = await User.findOne({
      otp,
      otpExpiry: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();

    res.json({ message: "Password reset successful" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};


module.exports = {
  register,
  login,
  user,
  forgetPassword,
  resetPassword,

};
