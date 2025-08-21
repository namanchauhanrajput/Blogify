import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { Heart, MessageSquare } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { endpoints, authHeaders } from "../api";

const API_URL = "https://bloging-platform.onrender.com";

const BlogDetail = () => {
  const { id } = useParams();
  const { token, user } = useAuth();

  const [blog, setBlog] = useState(null);
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [loading, setLoading] = useState(true);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [commentCount, setCommentCount] = useState(0);
  const [posting, setPosting] = useState(false); // ✅ loader for Post button

  // ✅ Fetch blog details
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await axios.get(endpoints.getBlog(id));
        const blogData = res.data.blog;
        setBlog(blogData);

        setLiked(blogData.likes?.some((l) => l === user?._id));
        setLikesCount(blogData.likes?.length || 0);
        setCommentCount(blogData.comments?.length || blogData.commentsCount || 0);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching blog:", error);
        setLoading(false);
      }
    };
    fetchBlog();
  }, [id, user]);

  // ✅ Fetch all comments
  const fetchComments = async () => {
    try {
      setCommentsLoading(true);
      const res = await axios.get(endpoints.comments(id));
      let allComments = res.data.comments || [];

      // latest first
      allComments = allComments.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

      setComments(allComments);
      setCommentCount(allComments.length);
      setCommentsLoading(false);
    } catch (error) {
      console.error("Error fetching comments:", error);
      setCommentsLoading(false);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );

  if (!blog) return <p className="text-center">Blog not found</p>;

  const blogImageUrl = blog?.image
    ? blog.image.startsWith("https")
      ? blog.image
      : `${API_URL}${blog.image}`
    : null;

  const createdAt = blog?.createdAt ? new Date(blog.createdAt) : new Date();

  // ✅ Like handler
  const toggleLike = async () => {
    if (!token) return alert("Please login to like");

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

  // ✅ Comment handler
  const submitComment = async (e) => {
    e.preventDefault();
    if (!token) return alert("Please login to comment");
    if (!commentText.trim()) return;

    try {
      setPosting(true); // start loader
      const res = await fetch(endpoints.comment(blog._id), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...authHeaders(token),
        },
        body: JSON.stringify({ text: commentText }),
      });

      if (!res.ok) throw new Error("Failed to add comment");

      const data = await res.json();

      // Ensure user data is present in new comment
      const newComment = {
        ...data.comment,
        user: {
          _id: user._id,
          username: user.username || user.name || "Anonymous",
        },
        createdAt: new Date().toISOString(),
      };

      setComments((prev) => [newComment, ...prev]);
      setCommentCount((prev) => prev + 1);
      setCommentText("");
    } catch (err) {
      console.error(err);
    } finally {
      setPosting(false); // stop loader
    }
  };

  const handleToggleComments = () => {
    if (!showComments) {
      fetchComments();
    }
    setShowComments((p) => !p);
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow">
      {/* Author with clickable link */}
      <p className="text-gray-600 text-sm mb-2">
        By{" "}
        {blog.author?._id ? (
          <Link
            to={`/profile/${blog.author._id}`}
            className="font-semibold text-blue-600 hover:underline"
          >
            {blog.author.username}
          </Link>
        ) : (
          <span className="font-semibold">Unknown</span>
        )}
      </p>

      {/* Title */}
      <h1 className="text-3xl font-bold mb-2">{blog.title}</h1>

      {/* Date */}
      <p className="text-gray-500 text-sm mb-4">
        {createdAt.toLocaleDateString()}
      </p>

      {/* Blog Image */}
      {blogImageUrl && (
        <img
          src={blogImageUrl}
          alt={blog.title}
          className="w-full h-72 object-cover rounded-lg mb-6"
        />
      )}

      {/* Content */}
      <p className="text-gray-700 leading-relaxed mb-6">{blog.content}</p>

      {/* Actions */}
      <div className="flex items-center gap-6 text-gray-600 mb-4">
        <button
          onClick={toggleLike}
          className={`flex items-center gap-1 ${
            liked ? "text-rose-600" : "text-gray-600"
          }`}
        >
          <Heart size={20} fill={liked ? "currentColor" : "none"} />
          {likesCount}
        </button>

        {/* Comment button with loader */}
        <button
          onClick={handleToggleComments}
          className="flex items-center gap-2 hover:text-blue-600 relative"
        >
          {commentsLoading ? (
            <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <MessageSquare size={20} />
          )}
          {commentCount}
        </button>
      </div>

      {/* Comments Section */}
      {showComments && (
        <>
          <form onSubmit={submitComment} className="mb-6">
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="w-full border rounded-lg p-2 mb-2"
              rows={3}
              placeholder="Write a comment..."
            ></textarea>
            <button
              type="submit"
              disabled={posting}
              className={`px-4 py-2 rounded-lg text-white flex items-center justify-center ${
                posting
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {posting ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                "Post Comment"
              )}
            </button>
          </form>

          {commentsLoading ? (
            <div className="flex justify-center items-center py-6">
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="space-y-3">
              {comments.length > 0 ? (
                comments.map((c) => {
                  const username =
                    c.user?.username ||
                    c.user?.name ||
                    c.author?.username ||
                    "Anonymous";
                  const userId = c.user?._id || c.author?._id;
                  const date = c.createdAt
                    ? new Date(c.createdAt).toLocaleDateString()
                    : "";
                  return (
                    <div
                      key={c._id}
                      className="border rounded-lg p-3 bg-gray-50 text-sm"
                    >
                      <div className="flex justify-between items-center">
                        {/* Comment author clickable */}
                        {userId ? (
                          <Link
                            to={`/profile/${userId}`}
                            className="font-medium text-blue-600 hover:underline"
                          >
                            {username}
                          </Link>
                        ) : (
                          <span className="font-medium">{username}</span>
                        )}

                        <span className="text-gray-400 text-xs">{date}</span>
                      </div>
                      <p>{c.text}</p>
                    </div>
                  );
                })
              ) : (
                <p className="text-gray-500">No comments yet.</p>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default BlogDetail;
