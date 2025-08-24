import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { authHeaders } from "../api";
import { Bell, Check } from "lucide-react";
import { Link } from "react-router-dom";

const API_URL = "http://localhost:5000";

export const Notifications = () => {
  const { token } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔹 fetch notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await axios.get(
          `${API_URL}/api/notifications`,
          authHeaders(token)
        );
        console.log("Notifications API Response:", res.data);
        setNotifications(res.data.notifications || res.data || []);
      } catch (err) {
        console.error(
          "Error fetching notifications:",
          err.response?.data || err.message
        );
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchNotifications();
  }, [token]);

  // 🔹 mark as read
  const markAsRead = async (id) => {
    try {
      await axios.put(
        `${API_URL}/api/notifications/${id}/read`,
        {},
        authHeaders(token)
      );
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
    } catch (err) {
      console.error("Error marking notification as read:", err);
    }
  };

  const getPhotoUrl = (photo) => {
    if (!photo) return "/default-avatar.png";
    return photo.startsWith("http") ? photo : `${API_URL}${photo}`;
  };

  if (loading) return <p className="text-center">Loading notifications...</p>;

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <Bell /> Notifications
      </h2>

      {notifications.length === 0 ? (
        <p className="text-gray-500 text-center">No notifications yet</p>
      ) : (
        <ul className="space-y-3">
          {notifications.map((n) => (
            <li
              key={n._id}
              className={`p-4 rounded-2xl shadow-md flex items-center justify-between ${
                n.isRead ? "bg-gray-100" : "bg-blue-100"
              }`}
            >
              <div className="flex items-center gap-3">
                <img
                  src={getPhotoUrl(n.sender?.profilePhoto)}
                  alt="User"
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <p className="text-sm">
                    <span className="font-semibold">
                      {n.sender?.name || "Someone"}
                    </span>{" "}
                    {n.text}
                  </p>
                  {n.blog && (
                    <Link
                      to={`/blog/${n.blog._id}`}
                      className="text-blue-600 text-xs underline"
                    >
                      View blog: {n.blog.title}
                    </Link>
                  )}
                  <p className="text-xs text-gray-500">
                    {new Date(n.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
              {!n.isRead && (
                <button
                  onClick={() => markAsRead(n._id)}
                  className="text-green-600 hover:text-green-800"
                >
                  <Check />
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
