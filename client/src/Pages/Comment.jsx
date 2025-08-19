import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";


const API_URL = "https://bloging-platform.onrender.com";

const Comment = () => {
  const { id } = useParams();
  const { token, user } = useAuth();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  // ✅ Fetch comments when page loads
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/blog/${id}`);
        setComments(res.data?.blog?.comments || []);
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };
    fetchComments();
  }, [id]);

  // ✅ Add new comment
  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const res = await axios.post(
        `${API_URL}/api/blog/comment/${id}`,
        { text: newComment },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data?.blog?.comments) {
        setComments(res.data.blog.comments);
      } else if (res.data?.comments) {
        setComments(res.data.comments);
      }

      setNewComment("");
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Comments</h2>

      {/* ✅ Add comment form at top */}
      {user ? (
        <form onSubmit={handleAddComment} className="mb-6 flex gap-2">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            className="flex-1 border rounded px-3 py-2"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Post
          </button>
        </form>
      ) : (
        <p className="mb-6 text-gray-500">Please login to add a comment.</p>
      )}

      {/* ✅ Comments list */}
      {comments.length === 0 ? (
        <p>No comments yet.</p>
      ) : (
        comments.map((c) => (
          <div key={c._id} className="p-4 border-b">
            <p className="font-semibold">{c.user?.username || "Anonymous"}</p>
            <p>{c.text}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default Comment;
