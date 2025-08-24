const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    recipient: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // jis user ko notify karna hai
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },   // jisne like/comment kiya
    type: { type: String, enum: ["like", "comment"], required: true },               // notification type
    blog: { type: mongoose.Schema.Types.ObjectId, ref: "Blog" },                     // related blog
    text: { type: String }, // optional message
    isRead: { type: Boolean, default: false }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notification", notificationSchema);
