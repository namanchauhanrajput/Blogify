import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { Bell, Check, MessageSquare, Heart } from "lucide-react";
import { Link } from "react-router-dom";

const API_URL = "https://bloging-platform.onrender.com/api/notifications";

export default function Notifications() {
  const { token } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Memoized Auth headers
  const authHeaders = useMemo(
    () => ({
      headers: { Authorization: `Bearer ${token}` },
      withCredentials: true,
    }),
    [token]
  );

  // Mark single as read
  const markAsRead = async (id) => {
    try {
      await axios.put(`${API_URL}/${id}/read`, {}, authHeaders);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
    } catch (err) {
      console.error("Error marking notification as read:", err);
    }
  };

  //Mark all as read
  const markAllAsRead = async () => {
    try {
      await axios.put(`${API_URL}/read-all`, {}, authHeaders);
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (err) {
      console.error("Error marking all notifications:", err);
    }
  };

  // Fetch notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await axios.get(API_URL, authHeaders);
        setNotifications(res.data);
      } catch (err) {
        console.error("Error fetching notifications:", err);
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchNotifications();
  }, [token, authHeaders]);

  if (!token) {
    return (
      <div className="p-6 text-center text-gray-600 dark:text-gray-300 dark:bg-black min-h-screen">
        Please login to view notifications.
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-4 mt-16 pb-10 dark:bg-black min-h-screen transition-all">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2 text-gray-800 dark:text-gray-100">
          <Bell className="w-6 h-6" /> Notifications
        </h2>
        {notifications.length > 0 && (
          <button
            onClick={markAllAsRead}
            className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg shadow transition"
          >
            Mark all as read
          </button>
        )}
      </div>

      {/* Loading */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-10">
          <svg
            className="animate-spin h-8 w-8 text-blue-600 mb-2"
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
          <p className="text-gray-500 dark:text-gray-400">
            Loading notifications...
          </p>
        </div>
      ) : notifications.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400 text-center py-10">
          No notifications found.
        </p>
      ) : (
        // Scrollable container
        <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar pb-4">
          {notifications.map((n) => (
            <div
              key={n._id}
              className={`flex items-start gap-3 p-4 rounded-xl shadow-md border transition-all ${
                n.isRead
                  ? "bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700"
                  : "bg-blue-50 dark:bg-blue-900/30 border-blue-300 dark:border-blue-600"
              }`}
            >
              {/* Sender avatar */}
              <img
                src={
                  n.sender?.profilePhoto ||
                  "https://via.placeholder.com/40?text=U"
                }
                alt="sender"
                className="w-12 h-12 rounded-full object-cover border"
              />

              {/* Content */}
              <div className="flex-1">
                <p className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed">
                  <Link
                    to={`/profile/${n.sender?._id}`}
                    className="font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    {n.sender?.name || n.sender?.username || "Someone"}
                  </Link>{" "}
                  {n.type === "like" ? (
                    <span className="text-pink-600 dark:text-pink-400 flex items-center gap-1 inline-flex">
                      <Heart className="w-4 h-4" /> liked your blog
                    </span>
                  ) : (
                    <span className="text-green-600 dark:text-green-400 flex items-center gap-1 inline-flex">
                      <MessageSquare className="w-4 h-4" /> commented:{" "}
                      <span className="italic">"{n.text}"</span>
                    </span>
                  )}
                </p>

                {n.blog && (
                  <Link
                    to={`/blog/${n.blog._id}`}
                    className="text-xs text-blue-600 dark:text-blue-400 hover:underline block mt-1"
                  >
                    View blog: {n.blog.title}
                  </Link>
                )}

                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {new Date(n.createdAt).toLocaleString()}
                </p>
              </div>

              {/* Mark as read button */}
              {!n.isRead && (
                <button
                  onClick={() => markAsRead(n._id)}
                  className="text-xs flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:underline"
                >
                  <Check className="w-4 h-4" /> Mark read
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
