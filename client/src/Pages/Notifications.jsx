import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { Bell, Check, MessageSquare, Heart } from "lucide-react";
import { Link } from "react-router-dom";

const API_URL = "http://localhost:5000/api/notifications";

export default function Notifications() {
  const { token } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔹 Memoized Auth headers
  const authHeaders = useMemo(
    () => ({
      headers: { Authorization: `Bearer ${token}` },
      withCredentials: true,
    }),
    [token]
  );

  // 🔹 Mark single as read
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

  // 🔹 Mark all as read
  const markAllAsRead = async () => {
    try {
      await axios.put(`${API_URL}/read-all`, {}, authHeaders);
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (err) {
      console.error("Error marking all notifications:", err);
    }
  };

  // 🔹 Fetch notifications
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
      <div className="p-4 text-center text-gray-600 dark:text-gray-300">
        Please login to view notifications.
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold flex items-center gap-2 text-gray-800 dark:text-gray-100">
          <Bell className="w-5 h-5" /> Notifications
        </h2>
        {notifications.length > 0 && (
          <button
            onClick={markAllAsRead}
            className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
          >
            Mark all as read
          </button>
        )}
      </div>

      {/* Loading */}
      {loading ? (
        <p className="text-gray-500 dark:text-gray-400">
          Loading notifications...
        </p>
      ) : notifications.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">
          No notifications found.
        </p>
      ) : (
        // 🔹 FIX: scrollable container so it works in mobile too
        <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-1">
          {notifications.map((n) => (
            <div
              key={n._id}
              className={`flex items-start gap-3 p-3 rounded-lg shadow-sm border transition ${
                n.isRead
                  ? "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                  : "bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-700"
              }`}
            >
              {/* Sender avatar */}
              <img
                src={
                  n.sender?.profilePhoto ||
                  "https://via.placeholder.com/40?text=U"
                }
                alt="sender"
                className="w-10 h-10 rounded-full object-cover"
              />

              {/* Content */}
              <div className="flex-1">
                <p className="text-sm text-gray-800 dark:text-gray-200">
                  <Link
                    to={`/profile/${n.sender?._id}`}
                    className="font-semibold text-blue-600 dark:text-white hover:underline"
                  >
                    {n.sender?.name || n.sender?.username || "Someone"}
                  </Link>{" "}
                  {n.type === "like" ? (
                    <span className="text-pink-600 dark:text-pink-400 flex items-center gap-1">
                      <Heart className="w-4 h-4" /> liked your blog
                    </span>
                  ) : (
                    <span className="text-green-600 dark:text-green-400 flex items-center gap-1">
                      <MessageSquare className="w-4 h-4" /> commented:{" "}
                      <span className="italic">"{n.text}"</span>
                    </span>
                  )}
                </p>

                {n.blog && (
                  <Link
                    to={`/blog/${n.blog._id}`}
                    className="text-xs text-blue-600 dark:text-white hover:underline"
                  >
                    View blog: {n.blog.title}
                  </Link>
                )}

                <p className="text-xs text-gray-500 dark:text-gray-400">
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
