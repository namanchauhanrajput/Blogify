const Blog = require("../models/blog-model");
const cloudinary = require("../config/cloudinary");
const Notification = require("../models/notification-model"); // 🟢 Notification model import

// CREATE BLOG
exports.createBlog = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Image file is required" });
    }

    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { resource_type: "image" },
        (err, result) => {
          if (err) reject(err);
          else resolve(result);
        }
      );
      stream.end(req.file.buffer);
    });

    const newBlog = new Blog({
      title: req.body.title,
      content: req.body.content,
      image: result.secure_url,
      imagePublicId: result.public_id,
      category: req.body.category || "",
      author: req.user._id, // logged-in user ID
    });

    const savedBlog = await newBlog.save();
    res.status(201).json(savedBlog);
  } catch (err) {
    res
      .status(500)
      .json({ message: err.message, extraDetails: "Error from Backend" });
  }
};

// GET ALL BLOGS
exports.getAllBlogs = async (req, res) => {
  try {
    const { search, category } = req.query;
    let filter = {};

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { content: { $regex: search, $options: "i" } },
      ];
    }

    if (category) {
      filter.category = category;
    }

    const blogs = await Blog.find(filter)
      .populate("author", "name username profilePhoto")
      .sort({ createdAt: -1 });

    res.json(blogs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET SINGLE BLOG BY ID
exports.getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id)
      .populate("author", "name username profilePhoto") // 🟢 include author
      .populate("comments.user", "name username profilePhoto") // 🟢 include comments user
      .populate("likes", "name username profilePhoto"); // 🟢 include liked users

    if (!blog) return res.status(404).json({ error: "Blog not found" });

    const userId = req.user?._id?.toString() || null;
    const isLikedByCurrentUser = userId
      ? blog.likes.some((u) => u._id.toString() === userId)
      : false;

    res.json({
      blog,
      likesCount: blog.likes.length,
      isLikedByCurrentUser,
      likedUsers: blog.likes, // 🟢 send list of users who liked
      createdAt: blog.createdAt,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE BLOG
exports.updateBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    blog.title = req.body.title || blog.title;
    blog.content = req.body.content || blog.content;
    blog.category = req.body.category || blog.category;

    if (req.file && req.file.buffer) {
      if (blog.imagePublicId) {
        await cloudinary.uploader.destroy(blog.imagePublicId);
      }

      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { resource_type: "image" },
          (err, result) => {
            if (err) reject(err);
            else resolve(result);
          }
        );
        stream.end(req.file.buffer);
      });

      blog.image = result.secure_url;
      blog.imagePublicId = result.public_id;
    }

    const updatedBlog = await blog.save();
    res.json(updatedBlog);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE BLOG
exports.deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    if (blog.imagePublicId) {
      await cloudinary.uploader.destroy(blog.imagePublicId);
    }

    await blog.deleteOne();
    res.json({ message: "Blog and its image deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// TOGGLE LIKE
exports.toggleLikeBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    const userId = req.user._id;
    const alreadyLiked = blog.likes.includes(userId);

    if (alreadyLiked) {
      blog.likes.pull(userId);
    } else {
      blog.likes.push(userId);

      // 🟢 Create notification only when like added
      if (blog.author.toString() !== userId.toString()) {
        await Notification.create({
          recipient: blog.author,
          sender: userId,
          type: "like",
          blog: blog._id,
          text: "liked your blog",
        });
      }
    }

    await blog.save();

    const populatedBlog = await Blog.findById(req.params.id).populate(
      "likes",
      "name username profilePhoto"
    );

    res.status(200).json({
      message: alreadyLiked ? "Unliked the blog" : "Liked the blog",
      liked: !alreadyLiked,
      likesCount: blog.likes.length,
      likedUsers: populatedBlog.likes, // 🟢 return liked users list
      createdAt: blog.createdAt,
    });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

// ADD COMMENT
exports.addComment = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    const comment = {
      user: req.user._id,
      text: req.body.text,
      createdAt: new Date(),
    };

    blog.comments.push(comment);
    await blog.save();

    // 🟢 Create notification for comment
    if (blog.author.toString() !== req.user._id.toString()) {
      await Notification.create({
        recipient: blog.author,
        sender: req.user._id,
        type: "comment",
        blog: blog._id,
        text: req.body.text ,
      });
    }

    const populatedBlog = await Blog.findById(req.params.id).populate(
      "comments.user",
      "name username profilePhoto"
    );

    res.status(200).json({
      message: "Comment added",
      comments: populatedBlog.comments,
    });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

// GET COMMENTS
exports.getComments = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id).populate(
      "comments.user",
      "name username"
    );
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    res.status(200).json({ comments: blog.comments });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

// GET UNIQUE CATEGORIES
exports.getCategories = async (req, res) => {
  try {
    const categories = await Blog.distinct("category");
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};
