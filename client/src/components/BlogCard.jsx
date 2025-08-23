import { Link, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { Heart, MessageSquare, Edit, Trash2, MoreVertical } from "lucide-react";
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

  // ✅ Get first comment (if any)
  const firstComment =
    blog?.comments && blog.comments.length > 0
      ? blog.comments[0]?.text || ""
      : "";

  return (
    <article
      className="w-full h-full relative cursor-pointer bg-gray-200"
      onClick={handleCardClick}
    >
      {/* ✅ Image with background fill */}
      {blogImageUrl && (
        <div className="w-full h-full flex items-center justify-center bg-gray-500">
          <img
            src={blogImageUrl}
            alt={blog?.title || "Blog image"}
            className="w-full h-full object-contain"
          />
        </div>
      )}

      <div className="absolute top-0 left-0 w-full h-full flex flex-col justify-between p-4 text-white">
        {/* Top bar with author and menu */}
        <div className="flex items-center gap-3 text-xs sm:text-sm">
          {authorId ? (
            <Link
              to={`/profile/${authorId}`}
              onClick={(e) => e.stopPropagation()}
              className="flex-shrink-0"
            >
              {profileImageUrl && !imgError ? (
                <img
                  src={profileImageUrl}
                  alt={authorName}
                  className="w-9 h-9 rounded-full object-cover border"
                  onError={() => setImgError(true)}
                />
              ) : (
                <div className="w-9 h-9 rounded-full border flex items-center justify-center font-semibold bg-gray-200 text-gray-700">
                  {authorName?.charAt(0)?.toUpperCase() || "U"}
                </div>
              )}
            </Link>
          ) : (
            <div className="w-9 h-9 rounded-full border flex items-center justify-center font-semibold bg-gray-200 text-gray-700">
              {authorName?.charAt(0)?.toUpperCase() || "U"}
            </div>
          )}

          {authorId ? (
            <Link
              to={`/profile/${authorId}`}
              onClick={(e) => e.stopPropagation()}
              className="font-medium text-gray-100 hover:no-underline"
            >
              {authorName}
            </Link>
          ) : (
            <span>{authorName}</span>
          )}

          {user?._id === authorId && (
            <div className="ml-auto relative" ref={menuRef}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setMenuOpen((prev) => !prev);
                }}
                className="p-1 rounded-full hover:bg-white/10"
              >
                <MoreVertical size={18} />
              </button>
              {menuOpen && (
                <div className="absolute right-0 mt-2 w-32 bg-gray-900 border border-gray-700 rounded-lg shadow-lg z-20">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/edit-blog/${blog._id}`);
                    }}
                    className="flex items-center gap-2 px-3 py-2 w-full text-left text-sm hover:bg-gray-800"
                  >
                    <Edit size={16} /> Edit
                  </button>
                  <button
                    onClick={handleDelete}
                    className="flex items-center gap-2 px-3 py-2 w-full text-left text-sm hover:bg-gray-800 text-red-500"
                  >
                    <Trash2 size={16} /> Delete
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Bottom overlay */}
        <div>
          <h3 className="text-lg sm:text-xl font-semibold mb-1 line-clamp-2">
            {blog?.title || "Untitled"}
          </h3>
          <p className="text-sm line-clamp-2">{trimmedContent}</p>

          <div className="flex items-center mt-2">
            {/* Like button */}
            <button
              onClick={toggleLike}
              className={`flex items-center gap-1 ${
                liked ? "text-rose-400" : "text-white"
              }`}
            >
              <Heart size={18} fill={liked ? "currentColor" : "none"} />
              {likesCount}
            </button>

            {/* Comment button + preview */}
            <Link
              to={`/comments/${blog._id}`}
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1 hover:text-blue-400 ml-4 max-w-[60%] truncate"
            >
              <MessageSquare size={18} />
              <span>{blog.comments?.length || 0}</span>
              {firstComment && (
                <span className="ml-2 text-xs text-gray-200 truncate">
                  {firstComment}
                </span>
              )}
            </Link>

            {/* Date */}
            <span className="ml-auto text-sm text-gray-300">
              {formatTimeAgo(createdAt)}
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}
