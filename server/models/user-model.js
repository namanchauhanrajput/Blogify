const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  password: { type: String, required: true }, // Plain password for testing
  isAdmin: { type: Boolean, default: false }, 
});

userSchema.methods.comparePassword = async function (password) {
  return password === this.password;
};

// ✅ JWT token generation
userSchema.methods.generateToken = function () {
  try {
    return jwt.sign(
      {
        userId: this._id.toString(),
        email: this.email,
        isAdmin: this.isAdmin,
      },
      process.env.JWT_KEY,
      {
        expiresIn: "30d",
      }
    );
  } catch (error) {
    console.error("Token error:", error);
  }
};

const User = new mongoose.model("User", userSchema);
module.exports = User;
