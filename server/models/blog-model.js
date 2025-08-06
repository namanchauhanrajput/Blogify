const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema(
  {
    // Blog Title
    title: {
      type: String,
      required: true,
    },

    // Blog Content
    content: {
      type: String,
      required: true,
    },

    // Cloudinary Image URL (optional)
    image: {
      type: String,
    },

    // Category (optional)
    // category: {
    //   type: String,
    // },

    // Likes: Array of User ObjectIds
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    // Comments: Array of comment objects
    comments: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        text: {
          type: String,
          required: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    // Author: Reference to the blog creator
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields to the blog
  }
);

module.exports = mongoose.model("Blog", blogSchema);
