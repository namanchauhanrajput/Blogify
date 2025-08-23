import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

const API_URL = "https://bloging-platform.onrender.com";

const Comment = () => {
  const { id } = useParams();
  const { token, user } = useAuth();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);

  // Fetch comments
  useEffect(() => {
    const fetchComments = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API_URL}/api/blog/${id}`);
        setComments(res.data?.blog?.comments || []);
      } catch (error) {
        console.error("Error fetching comments:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchComments();
  }, [id]);

  // Add new comment
  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    if (!token) {
      alert("Please login to add a comment.");
      return;
    }

    try {
      setPosting(true);
      const res = await axios.post(
        `${API_URL}/api/blog/comment/${id}`,
        { text: newComment },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data?.comment) {
        const comment = {
          ...res.data.comment,
          user: {
            _id: user._id,
            username: user.username || user.name || "Anonymous",
          },
          createdAt: new Date().toISOString(),
        };
        setComments((prev) => [comment, ...prev]);
      } else if (res.data?.blog?.comments) {
        setComments(res.data.blog.comments);
      } else if (res.data?.comments) {
        setComments(res.data.comments);
      }

      setNewComment("");
    } catch (error) {
      console.error("Error adding comment:", error);
    } finally {
      setPosting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white dark:bg-gray-900 dark:text-gray-100 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Comments</h2>

      {/* Add comment form */}
      {user ? (
        <form onSubmit={handleAddComment} className="mb-6 flex gap-2">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            className="flex-1 border rounded px-3 py-2 bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={posting}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center justify-center disabled:opacity-50 transition"
          >
            {posting && (
              <svg
                className="animate-spin h-5 w-5 text-white mr-2"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4l3-3-3-3v4a12 12 0 00-12 12h4z"
                />
              </svg>
            )}
            {posting ? "Posting..." : "Post"}
          </button>
        </form>
      ) : (
        <p className="mb-6 text-gray-500 dark:text-gray-400">
          Please login to add a comment.
        </p>
      )}

      {/* Comments list */}
      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-[150px]">
          <svg
            className="animate-spin h-10 w-10 text-blue-600 mb-2"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4l3-3-3-3v4a12 12 0 00-12 12h4z"
            />
          </svg>
          <p className="text-gray-600 dark:text-gray-400">Loading comments...</p>
        </div>
      ) : comments.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-400">No comments yet.</p>
      ) : (
        comments.map((c) => {
          const username = c.user?.username || c.user?.name || "Anonymous";
          const userId = c.user?._id;
          const createdAt = c.createdAt
            ? new Date(c.createdAt).toLocaleString()
            : "";

          return (
            <div
              key={c._id}
              className="p-4 border-b border-gray-200 dark:border-gray-700"
            >
              <div className="flex justify-between items-center">
                <p className="font-semibold">
                  {userId ? (
                    <Link
                      to={`/profile/${userId}`}
                      className="text-blue-600 dark:text-blue-400"
                    >
                      {username}
                    </Link>
                  ) : (
                    <span>{username}</span>
                  )}
                </p>
                {createdAt && (
                  <span className="text-gray-400 text-sm">{createdAt}</span>
                )}
              </div>
              <p className="text-gray-800 dark:text-gray-300 mt-1">{c.text}</p>
            </div>
          );
        })
      )}
    </div>
  );
};

export default Comment;
