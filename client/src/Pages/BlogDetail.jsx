import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { MessageSquare, Heart } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { endpoints, authHeaders } from "../api";

const API_URL = "https://bloging-platform.onrender.com";

const BlogDetail = () => {
  const { id } = useParams();
  const { token, user } = useAuth();

  const [blog, setBlog] = useState(null);
  const [author, setAuthor] = useState(null);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [loading, setLoading] = useState(true);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [commentCount, setCommentCount] = useState(0);
  const [posting, setPosting] = useState(false);

  // Likes
  const [likesCount, setLikesCount] = useState(0);
  const [likedUsers, setLikedUsers] = useState([]);
  const [isLiked, setIsLiked] = useState(false);
  const [likeLoading, setLikeLoading] = useState(false);
  const [showLikes, setShowLikes] = useState(false);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await axios.get(endpoints.getBlog(id), {
          headers: authHeaders(token),
        });

        const blogData = res.data.blog;
        setBlog(blogData);
        setCommentCount(blogData.comments?.length || blogData.commentsCount || 0);

        // Likes
        setLikesCount(res.data.likesCount || 0);
        setLikedUsers(res.data.likedUsers || []);
        setIsLiked(res.data.isLikedByCurrentUser || false);

        if (blogData?.author?._id) {
          const authorRes = await axios.get(
            `${API_URL}/api/blog/user/${blogData.author._id}`,
            { headers: authHeaders(token) }
          );
          setAuthor(authorRes.data.userProfile);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching blog:", error);
        setLoading(false);
      }
    };
    fetchBlog();
  }, [id, token]);

  const handleLikeToggle = async () => {
    if (!token) return alert("Please login to like");
    try {
      setLikeLoading(true);
      const res = await axios.post(
        endpoints.like(id),
        {},
        { headers: authHeaders(token) }
      );

      setIsLiked(res.data.liked);
      setLikesCount(res.data.likesCount);
      setLikedUsers(res.data.likedUsers || []);
    } catch (err) {
      console.error("Error toggling like:", err);
    } finally {
      setLikeLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      setCommentsLoading(true);
      const res = await axios.get(endpoints.comments(id));
      let allComments = res.data.comments || [];
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
      <div className="flex justify-center items-center min-h-screen bg-white dark:bg-black">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );

  if (!blog)
    return (
      <div className="min-h-screen flex justify-center items-center bg-white dark:bg-black text-gray-700 dark:text-gray-300">
        Blog not found
      </div>
    );

  const blogImageUrl = blog?.image
    ? blog.image.startsWith("https")
      ? blog.image
      : `${API_URL}${blog.image}`
    : null;

  const createdAt = blog?.createdAt ? new Date(blog.createdAt) : new Date();

  const submitComment = async (e) => {
    e.preventDefault();
    if (!token) return alert("Please login to comment");
    if (!commentText.trim()) return;
    try {
      setPosting(true);
      const res = await fetch(endpoints.comment(blog._id), {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeaders(token) },
        body: JSON.stringify({ text: commentText }),
      });
      if (!res.ok) throw new Error("Failed to add comment");
      const data = await res.json();
      const newComment = {
        ...data.comment,
        user: {
          _id: user._id,
          username: user.username || user.name || "Anonymous",
          profilePhoto: user.profilePhoto || "",
        },
        createdAt: new Date().toISOString(),
      };
      setComments((prev) => [newComment, ...prev]);
      setCommentCount((prev) => prev + 1);
      setCommentText("");
    } catch (err) {
      console.error(err);
    } finally {
      setPosting(false);
    }
  };

  const handleToggleComments = () => {
    if (!showComments) fetchComments();
    setShowComments((p) => !p);
  };

  const getProfilePhotoUrl = (photo) => {
    if (!photo) return "/default-avatar.png";
    if (photo.startsWith("https")) return photo;
    return `${API_URL}${photo}`;
  };

  const timeAgo = (date) => {
    if (!date) return "";
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 30) return `${days}d ago`;
    const months = Math.floor(days / 30);
    if (months < 12) return `${months}mo ago`;
    const years = Math.floor(months / 12);
    return `${years}y ago`;
  };

  return (
    <>
    <div className="pt-14"></div>
    <div className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-white px-4 sm:px-6 lg:px-8 py-10">
      <div className="max-w-3xl mx-auto rounded-xl transition-colors duration-300">
        {/* Author */}
        <div className="flex items-center gap-3 mb-5">
          <img
            src={getProfilePhotoUrl(author?.profilePhoto)}
            alt={blog.author?.username}
            className="w-12 h-12 rounded-full object-cover border border-gray-300 dark:border-gray-700"
          />
          <div>
            <Link
              to={`/profile/${blog.author?._id}`}
              className="font-semibold text-gray-900 dark:text-white hover:underline"
            >
              {blog.author?.username || "Unknown"}
            </Link>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              {createdAt.toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-5 leading-snug">
          {blog.title}
        </h1>

        {/* Blog Image */}
        {blogImageUrl && (
          <img
            src={blogImageUrl}
            alt={blog.title}
            className="w-full max-h-[70vh] object-contain rounded-lg mb-6"
          />
        )}

        {/* Content */}
        <div
          className="prose prose-lg dark:prose-invert max-w-none text-justify leading-relaxed mb-8"
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />

        {/* Actions */}
        <div className="flex items-center gap-8 text-gray-600 dark:text-gray-300 mb-8">
          {/* Like Button */}
          <button
            onClick={handleLikeToggle}
            disabled={likeLoading}
            className={`flex items-center gap-2 text-base sm:text-lg ${
              isLiked ? "text-red-500" : "hover:text-red-500"
            }`}
          >
            {likeLoading ? (
              <div className="w-5 h-5 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <Heart
                size={22}
                className={isLiked ? "fill-red-500 text-red-500" : ""}
              />
            )}
          </button>

          {/* Likes Count Toggle */}
          <span
            onClick={() => setShowLikes((p) => !p)}
            className="cursor-pointer text-base sm:text-lg hover:underline"
          >
            {likesCount} {likesCount === 1 ? "Like" : "Likes"}
          </span>

          {/* Comments toggle */}
          <button
            onClick={handleToggleComments}
            className="flex items-center gap-2 text-base sm:text-lg hover:text-blue-600 dark:hover:text-blue-400"
          >
            {commentsLoading ? (
              <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <MessageSquare size={22} />
            )}
            <span>{commentCount}</span>
          </button>
        </div>

        {/* Liked Users */}
        {showLikes && likesCount > 0 && (
          <div className="mb-6 border rounded-lg p-4 bg-gray-50 dark:bg-black">
            <h3 className="font-semibold text-lg mb-3">Liked by:</h3>
            <div className="space-y-3">
              {likedUsers.map((u) => (
                <div
                  key={u._id}
                  className="flex items-center justify-between p-2 rounded-md bg-white dark:bg-black shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={getProfilePhotoUrl(u.profilePhoto)}
                      alt={u.username}
                      className="w-9 h-9 rounded-full object-cover"
                    />
                    <Link
                      to={`/profile/${u._id}`}
                      className="font-medium text-gray-900 dark:text-white hover:underline"
                    >
                      {u.username || u.name || "User"}
                    </Link>
                  </div>
                  <span className="text-xs text-gray-500">
                    {timeAgo(u.likedAt || u.createdAt || blog.createdAt)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Comments */}
        {showComments && (
          <div className="mt-6 space-y-6">
            <form onSubmit={submitComment} className="space-y-3">
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="w-full border rounded-lg p-3 dark:bg-black dark:border-gray-700 dark:text-gray-100 text-sm sm:text-base"
                rows={3}
                placeholder="Write a comment..."
              ></textarea>
              <button
                type="submit"
                disabled={posting}
                className={`px-5 py-2 rounded-lg text-white text-sm sm:text-base flex items-center justify-center ${
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
              <div className="space-y-4">
                {comments.length > 0 ? (
                  comments.map((c) => {
                    const username =
                      c.user?.username || c.user?.name || c.author?.username || "Anonymous";
                    const userId = c.user?._id || c.author?._id;
                    const profilePhoto = getProfilePhotoUrl(
                      c.user?.profilePhoto || c.author?.profilePhoto
                    );
                    const date = timeAgo(c.createdAt);

                    return (
                      <div
                        key={c._id}
                        className="border rounded-lg p-4 bg-gray-100 dark:bg-black dark:border-gray-700 text-sm sm:text-base pb-12"
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <img
                            src={profilePhoto || "/default-avatar.png"}
                            alt={username}
                            className="w-9 h-9 rounded-full object-cover border border-gray-300 dark:border-gray-700"
                          />
                          {userId ? (
                            <Link
                              to={`/profile/${userId}`}
                              className="font-medium text-gray-900 dark:text-white hover:underline"
                            >
                              {username}
                            </Link>
                          ) : (
                            <span className="font-medium text-gray-900 dark:text-white">
                              {username}
                            </span>
                          )}
                          <span className="text-gray-400 text-xs ml-auto">{date}</span>
                        </div>
                        <p className="text-gray-700 dark:text-gray-200 leading-relaxed">{c.text}</p>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-gray-500 dark:text-gray-400 text-center">No comments yet.</p>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
    </>
  );
};

export default BlogDetail;
