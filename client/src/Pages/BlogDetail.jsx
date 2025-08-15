// src/Pages/BlogDetail.jsx
import { useEffect, useMemo, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { endpoints, authHeaders } from "../api";
import { useAuth } from "../context/AuthContext";

export const BlogDetail = () => {
  const { id } = useParams();
  const { token, user } = useAuth();
  const navigate = useNavigate();

  const [blog, setBlog] = useState(null);
  const [likesCount, setLikesCount] = useState(0);
  const [liked, setLiked] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [loading, setLoading] = useState(true);

  const isAuthor = useMemo(
    () => blog?.author?._id && user?._id && blog.author._id === user._id,
    [blog, user]
  );

  const fetchBlog = async () => {
    try {
      const res = await fetch(endpoints.blog(id), {
        headers: token ? authHeaders(token) : {},
      });
      const data = await res.json();
      setBlog(data.blog || data);
      setLikesCount(data.likesCount ?? (data.blog?.likes?.length || 0));
      setLiked(Boolean(data.isLikedByCurrentUser));
    } catch (e) {
      console.error("Get blog error", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlog();
    // eslint-disable-next-line
  }, [id]);

  const toggleLike = async () => {
    try {
      // optimistic UI
      setLiked((p) => !p);
      setLikesCount((c) => (liked ? c - 1 : c + 1));

      const res = await fetch(endpoints.like(id), {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeaders(token) },
      });

      if (!res.ok) throw new Error("Failed to like/unlike");
      // optional: trust backend response to sync
      const data = await res.json();
      setLiked(data.liked);
      setLikesCount(data.likesCount);
    } catch (e) {
      // revert if failed
      setLiked((p) => !p);
      setLikesCount((c) => (liked ? c + 1 : c - 1));
      console.error(e);
    }
  };

  const postComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    try {
      const res = await fetch(endpoints.comment(id), {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeaders(token) },
        body: JSON.stringify({ text: commentText.trim() }),
      });
      if (!res.ok) throw new Error("Failed to comment");

      const { comment } = await res.json();
      setBlog((b) => ({ ...b, comments: [...(b.comments || []), comment] }));
      setCommentText("");
    } catch (e) {
      console.error(e);
    }
  };

  const deleteBlog = async () => {
    if (!window.confirm("Delete this blog?")) return;
    try {
      const res = await fetch(endpoints.blog(id), {
        method: "DELETE",
        headers: authHeaders(token),
      });
      if (!res.ok) throw new Error("Failed to delete");
      navigate("/");
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) return <div className="max-w-4xl mx-auto p-6">Ruko jaraaa savar krooo</div>;
  if (!blog) return <div className="max-w-4xl mx-auto p-6">Not found</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {blog.image && (
        <img
          src={blog.image}
          alt={blog.title}
          className="w-full h-full sm:w-auto sm:h-80 lg:h-[500px] object-cover mb-4"
        />
      )}
      <h1 className="text-3xl font-bold mb-2">{blog.title}</h1>
      <div className="text-gray-600 mb-4">
        By {blog.author?.name || blog.author?.username} •{" "}
        {new Date(blog.createdAt).toLocaleString()}
      </div>

      <p className="text-lg leading-8 whitespace-pre-wrap">{blog.content}</p>

      <div className="flex items-center gap-3 mt-6">
        <button
          onClick={toggleLike}
          className={`px-4 py-2 rounded-lg ${liked ? "bg-rose-600" : "bg-gray-900"} text-white`}
        >
          {liked ? "Unlike" : "Like"} ({likesCount})
        </button>

        {isAuthor && (
          <>
            <Link
              to={`/edit/${blog._id}`}
              className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
            >
              Edit
            </Link>
            <button
              onClick={deleteBlog}
              className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
            >
              Delete
            </button>
          </>
        )}
      </div>

      {/* Comments */}
      <section className="mt-8">
        <h2 className="text-xl font-semibold mb-3">Comments</h2>

        {blog.comments?.length ? (
          <ul className="space-y-3">
            {blog.comments.map((c, i) => (
              <li key={i} className="bg-white rounded-xl shadow p-3">
                <div className="text-sm text-gray-500 mb-1">
                  {c.user?.name || c.user?.username || "User"} •{" "}
                  {new Date(c.createdAt).toLocaleString()}
                </div>
                <p>{c.text}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No comments yet.</p>
        )}

        {token && (
          <form onSubmit={postComment} className="mt-4 flex gap-2">
            <input
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Write a comment..."
              className="flex-1 border rounded-lg px-4 py-2"
            />
            <button
              className="px-4 py-2 rounded-lg bg-gray-900 text-white"
              type="submit"
            >
              Post
            </button>
          </form>
        )}
      </section>
    </div>
  );
};
