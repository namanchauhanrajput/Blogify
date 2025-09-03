import { Link, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { Heart, MessageSquare, Edit, Trash2, MoreVertical } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { endpoints, authHeaders } from "../api";
import { useAuth } from "../context/AuthContext";

export default function BlogCard({ blog, onDelete }) {
  const { token, user } = useAuth();
  const navigate = useNavigate();
  const author = blog?.author || {};
  const authorName = author?.username || "Unknown";
  const authorId = author?._id || "";
  const profilePhoto = author?.profilePhoto;
  const createdAt = blog?.createdAt ? new Date(blog.createdAt) : new Date();

  const [liked, setLiked] = useState(
    blog?.likes?.some((l) => l === user?._id) || false
  );
  const [likesCount, setLikesCount] = useState(blog?.likes?.length || 0);
  const [imgError, setImgError] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const API_URL = "https://bloging-platform.onrender.com";
  const profileImageUrl = profilePhoto
    ? profilePhoto.startsWith("https")
      ? profilePhoto
      : `${API_URL}${profilePhoto}`
    : null;
  const blogImageUrl = blog?.image
    ? blog.image.startsWith("https")
      ? blog.image
      : `${API_URL}${blog.image}`
    : null;

  const maxLength = 120;
  const showReadMore = blog?.content?.length > maxLength;
  const trimmedContent = showReadMore
    ? blog.content.slice(0, maxLength) + "...."
    : blog?.content;

  // ✅ Format time ago
  const formatTimeAgo = (date) => {
    const now = new Date();
    const diff = Math.floor((now - date) / 1000); // seconds

    if (diff < 60) return `${diff} sec ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hr ago`;
    if (diff < 604800) return `${Math.floor(diff / 86400)} d ago`;
    if (diff < 2592000) return `${Math.floor(diff / 604800)} w ago`;

    return date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "long",
      year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
    });
  };

  const toggleLike = async (e) => {
    e.stopPropagation();
    if (!token) return navigate("/login");
    try {
      setLiked((p) => !p);
      setLikesCount((c) => (liked ? c - 1 : c + 1));
      const res = await fetch(endpoints.like(blog._id), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...authHeaders(token),
        },
      });
      if (!res.ok) throw new Error("Like failed");
      const data = await res.json();
      setLiked(data.liked);
      setLikesCount(data.likesCount);
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (e) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this blog?")) return;
    try {
      const res = await fetch(endpoints.deleteBlog(blog._id), {
        method: "DELETE",
        headers: {
          ...authHeaders(token),
        },
      });
      if (!res.ok) throw new Error("Delete failed");
      onDelete?.(blog._id);
    } catch (err) {
      console.error(err);
      alert("Failed to delete blog");
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

  const handleCardClick = () => {
    navigate(`/blog/${blog._id}`);
  };

  return (
    <article
      onClick={handleCardClick}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-lg transition cursor-pointer flex flex-col"
    >
      {/* Blog Image with Hover Animation */}
      {blogImageUrl && (
        <motion.img
          src={blogImageUrl}
          alt={blog?.title || "Blog image"}
          className="w-full h-60 object-cover"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
        />
      )}

      {/* Content */}
      <div className="flex flex-col flex-1 p-4">
        {/* Category + Date */}
        <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mb-2">
          <span className="px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200">
            {blog?.category || "General"}
          </span>
          <span className="ml-2">{formatTimeAgo(createdAt)}</span>
        </div>

        {/* Title */}
        <h3 className="text-lg font-semibold mb-1 line-clamp-2 text-gray-900 dark:text-gray-100">
          {blog?.title || "Untitled"}
        </h3>

        {/* Description */}
        <p className="text-sm text-gray-700 dark:text-gray-300 mb-4 line-clamp-3">
          {trimmedContent}
        </p>

        {/* Footer with Author + Actions */}
        <div className="flex items-center justify-between mt-auto">
          {/* Author */}
          <div className="flex items-center gap-2">
            {profileImageUrl && !imgError ? (
              <img
                src={profileImageUrl}
                alt={authorName}
                className="w-8 h-8 rounded-full object-cover border"
                onError={() => setImgError(true)}
              />
            ) : (
              <div className="w-8 h-8 rounded-full border flex items-center justify-center font-semibold bg-gray-200 text-gray-700">
                {authorName?.charAt(0)?.toUpperCase() || "U"}
              </div>
            )}
            <Link
              to={`/profile/${authorId}`}
              onClick={(e) => e.stopPropagation()}
              className="text-sm font-medium text-gray-800 dark:text-gray-200 hover:underline"
            >
              {authorName}
            </Link>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
            {/* Like button */}
            <button
              onClick={toggleLike}
              className={`flex items-center gap-1 ${
                liked ? "text-rose-500" : ""
              }`}
            >
              <Heart size={16} fill={liked ? "currentColor" : "none"} />
              {likesCount}
            </button>

            {/* Comment button */}
            <Link
              to={`/comments/${blog._id}`}
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1 hover:text-blue-500"
            >
              <MessageSquare size={16} />
              {blog.comments?.length || 0}
            </Link>

            {/* Author’s own menu (Edit/Delete) */}
            {user?._id === authorId && (
              <div className="relative" ref={menuRef}>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setMenuOpen((prev) => !prev);
                  }}
                  className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <MoreVertical size={16} />
                </button>
                <AnimatePresence>
                  {menuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 bottom-full mb-2 w-32 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-20"
                    >
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/edit-blog/${blog._id}`);
                        }}
                        className="flex items-center gap-2 px-3 py-2 w-full text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
                      >
                        <Edit size={14} /> Edit
                      </button>
                      <button
                        onClick={handleDelete}
                        className="flex items-center gap-2 px-3 py-2 w-full text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-800 text-red-500"
                      >
                        <Trash2 size={14} /> Delete
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
