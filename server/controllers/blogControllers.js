const Blog = require("../models/blog-model");
const cloudinary = require("../config/cloudinary");

// Create a blog
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
      category: req.body.category || "",
      author: req.user._id,
    });

    const savedBlog = await newBlog.save();
    res.status(201).json(savedBlog);
  } catch (err) {
    res.status(500).json({ message: err.message, extraDetails: "Error from Backend" });
  }
};

// Get all blogs
exports.getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find()
      .populate("author", "name username")
      .sort({ createdAt: -1 });
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get blog by ID
exports.getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id)
      .populate("author", "name username")
      .populate("comments.user", "name username");

    if (!blog) return res.status(404).json({ error: "Blog not found" });

    const userId = req.user?._id?.toString() || null;
    const isLikedByCurrentUser = userId ? blog.likes.includes(userId) : false;

    res.json({
      blog,
      likesCount: blog.likes.length,
      isLikedByCurrentUser,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update blog
exports.updateBlog = async (req, res) => {
  try {
    const updatedData = {
      title: req.body.title,
      content: req.body.content,
      category: req.body.category,
    };

    if (req.file && req.file.buffer) {
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

      updatedData.image = result.secure_url;
    }

    const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, updatedData, {
      new: true,
    });

    if (!updatedBlog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    res.json(updatedBlog);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete blog
exports.deleteBlog = async (req, res) => {
  try {
    const deletedBlog = await Blog.findByIdAndDelete(req.params.id);
    if (!deletedBlog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    res.json({ message: "Blog deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Toggle like blog
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
    }

    await blog.save();

    res.status(200).json({
      message: alreadyLiked ? "Unliked the blog" : "Liked the blog",
      liked: !alreadyLiked,
      likesCount: blog.likes.length,
    });
  } catch (error) {
    console.error("Like toggle error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

// Add comment
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

    res.status(200).json({ message: "Comment added", comment });
  } catch (error) {
    console.error("Add comment error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

// Get comments for a blog
exports.getComments = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id).populate("comments.user", "name username");

    if (!blog) return res.status(404).json({ message: "Blog not found" });

    res.status(200).json({ comments: blog.comments });
  } catch (error) {
    console.error("Get comments error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};
