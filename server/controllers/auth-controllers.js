const User = require("../models/user-model");
const bcrypt = require("bcryptjs");

// ========================= REGISTER =========================

const register = async (req, res) => {
  try {
    console.log(req.body);
    const { username, name, email, phone, password } = req.body;

    // ✅ Check by username instead of email
    const userExist = await User.findOne({ username });
    if (userExist) {
      return res.status(400).json({ message: "Username is not avilable" });
    }

    // ✅ Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Create new user
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

    // ✅ Find user by username instead of email
    const userExist = await User.findOne({ username });

    if (!userExist) {
      return res.status(400).json({ message: "Invalid Username or Password" });
    }

    // ✅ Compare password
    const isMatch = await bcrypt.compare(password, userExist.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid Username or Password" });
    }

    // ✅ Generate token
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
    console.log(userData);
    res.status(200).json({ userData });
  } catch (error) {
    res.status(500).json({ message: "Server error from user route" });
  }
};

module.exports = { register, login, user };
