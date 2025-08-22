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
    ? blog.content.slice(0, maxLength) + "..."
    : blog?.content;

  const toggleLike = async () => {
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

  const handleDelete = async () => {
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

  return (
    <article className="w-full h-full relative">
      {/* Blog image full-screen card */}
      {blogImageUrl && (
        <img
          src={blogImageUrl}
          alt={blog?.title || "Blog image"}
          className="w-full h-full object-contain"
        />
      )}

      {/* Absolute overlay content */}
      <div className="absolute top-0 left-0 w-full h-full flex flex-col justify-between p-4 bg-black/25 text-white">
        {/* Top bar with author and menu */}
        <div className="flex items-center gap-3 text-xs sm:text-sm">
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

          {authorId ? (
            <Link
              to={`/profile/${authorId}`}
              className="hover:underline text-blue-300 font-medium"
            >
              {authorName}
            </Link>
          ) : (
            <span>{authorName}</span>
          )}

          {user?._id === authorId && (
            <div className="ml-auto relative" ref={menuRef}>
              <button
                onClick={() => setMenuOpen((prev) => !prev)}
                className="p-1 rounded-full hover:bg-white/10"
              >
                <MoreVertical size={18} />
              </button>
              {menuOpen && (
                <div className="absolute right-0 mt-2 w-32 bg-gray-900 border border-gray-700 rounded-lg shadow-lg z-20">
                  <button
                    onClick={() => navigate(`/edit-blog/${blog._id}`)}
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
            <button
              onClick={toggleLike}
              className={`flex items-center gap-1 ${
                liked ? "text-rose-400" : "text-white"
              }`}
            >
              <Heart size={18} fill={liked ? "currentColor" : "none"} />
              {likesCount}
            </button>

            <Link
              to={`/comments/${blog._id}`}
              className="flex items-center gap-1 hover:text-blue-400 ml-4"
            >
              <MessageSquare size={18} />
              {blog.comments?.length || 0}
            </Link>

            <Link
              to={`/blog/${blog?._id}`}
              className="ml-4 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-sm"
            >
              Read More
            </Link>

            <span className="ml-auto text-sm text-gray-300">
              {createdAt.toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}
