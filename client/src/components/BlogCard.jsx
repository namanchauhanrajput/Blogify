import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Heart, MessageSquare, Edit, Trash2 } from "lucide-react";
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

  // ✅ Like handler
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

  // ✅ Delete handler
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

  return (
    <article className="bg-white rounded-2xl transition duration-300 overflow-hidden flex flex-col shadow hover:shadow-lg border border-gray-100">
      {/* Author row */}
      <div className="flex items-center gap-3 px-4 pt-4 text-xs sm:text-sm text-gray-600">
        {profileImageUrl && !imgError ? (
          <img
            src={profileImageUrl}
            alt={authorName}
            className="w-9 h-9 rounded-full object-cover border"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-9 h-9 rounded-full border flex items-center justify-center font-semibold bg-gray-200">
            {authorName?.charAt(0)?.toUpperCase() || "U"}
          </div>
        )}

        {authorId ? (
          <Link
            to={`/profile/${authorId}`}
            className="hover:underline text-blue-600 font-medium"
          >
            {authorName}
          </Link>
        ) : (
          <span>{authorName}</span>
        )}

        <span className="text-gray-400 ml-auto">
          {createdAt.toLocaleDateString()}
        </span>
      </div>

      {/* Blog image */}
      {blogImageUrl && (
        <div className="w-full mt-3">
          <img
            src={blogImageUrl}
            alt={blog?.title || "Blog image"}
            className="w-full h-52 object-cover object-center rounded-lg"
          />
        </div>
      )}

      {/* Content */}
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-lg sm:text-xl font-semibold mb-2 line-clamp-2">
          {blog?.title || "Untitled"}
        </h3>
        <p className="text-gray-600 text-sm sm:text-base mb-3">
          {trimmedContent}
        </p>

        {/* Actions */}
        <div className="flex items-center justify-between mt-auto">
          <div className="flex gap-4 text-gray-600 text-sm">
            {/* Like button */}
            <button
              onClick={toggleLike}
              className={`flex items-center gap-1 ${
                liked ? "text-rose-600" : "text-gray-600"
              }`}
            >
              <Heart size={18} fill={liked ? "currentColor" : "none"} />
              {likesCount}
            </button>

            {/* Comment button */}
            <Link
              to={`/comments/${blog._id}`}
              className="flex items-center gap-1 hover:text-blue-600"
            >
              <MessageSquare size={18} /> {blog.comments?.length || 0}
            </Link>
          </div>

          <div className="flex items-center gap-2">
            {user?._id === authorId && (
              <>
                <button
                  onClick={() => navigate(`/edit-blog/${blog._id}`)}
                  className="text-gray-500 hover:text-blue-600"
                >
                  <Edit size={18} />
                </button>
                <button
                  onClick={handleDelete}
                  className="text-gray-500 hover:text-red-600"
                >
                  <Trash2 size={18} />
                </button>
              </>
            )}

            {showReadMore && (
              <Link
                to={`/blog/${blog?._id}`}
                className="px-3 py-1.5 rounded-lg bg-gray-900 text-white hover:bg-black text-sm sm:text-base"
              >
                Read More
              </Link>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
