import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Heart, MessageSquare, Pencil, Trash2, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function MyProfile() {
  const { token, user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [isEditing, setIsEditing] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    bio: "",
    twitter: "",
    linkedin: "",
    instagram: "",
    github: "",
    website: "",
  });

  const [profilePhoto, setProfilePhoto] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  // Delete loader
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Context menu
  const [contextMenu, setContextMenu] = useState(null);
  const longPressTimeout = useRef(null);

  // Delete confirmation
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const navigate = useNavigate();

  // Fetch profile + blogs
  useEffect(() => {
    if (!user?._id) return;
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `https://bloging-platform.onrender.com/api/blog/user/${user._id}`
        );
        setProfile(res.data.userProfile);
        setBlogs(res.data.blogs || []);
        setFormData({
          name: res.data.userProfile.name || "",
          username: res.data.userProfile.username || "",
          bio: res.data.userProfile.bio || "",
          twitter: res.data.userProfile.socialLinks?.twitter || "",
          linkedin: res.data.userProfile.socialLinks?.linkedin || "",
          instagram: res.data.userProfile.socialLinks?.instagram || "",
          github: res.data.userProfile.socialLinks?.github || "",
          website: res.data.userProfile.socialLinks?.website || "",
        });
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, [user]);

  // Handle file select
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setProfilePhoto(file);
    setPreview(URL.createObjectURL(file));
  };

  // Update profile
  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("username", formData.username);
      data.append("bio", formData.bio);
      data.append(
        "socialLinks",
        JSON.stringify({
          twitter: formData.twitter,
          linkedin: formData.linkedin,
          instagram: formData.instagram,
          github: formData.github,
          website: formData.website,
        })
      );
      if (profilePhoto) data.append("profilePhoto", profilePhoto);

      const res = await axios.put(
        "https://bloging-platform.onrender.com/api/blog/user/update/profile",
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setProfile(res.data.user);
      setIsEditing(false);
      alert(" Profile updated successfully!");
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  //  Delete blog
  const handleDelete = async (id) => {
    setDeleteLoading(true);
    try {
      await axios.delete(
        `https://bloging-platform.onrender.com/api/blog/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setBlogs((prev) => prev.filter((b) => b._id !== id));
      setDeleteConfirm(null);
      setContextMenu(null);
    } catch (err) {
      console.error(err);
      alert("Failed to delete blog");
    } finally {
      setDeleteLoading(false);
    }
  };

  // Close context menu on outside click
  useEffect(() => {
    const closeMenu = () => setContextMenu(null);
    if (contextMenu) {
      window.addEventListener("click", closeMenu);
    }
    return () => window.removeEventListener("click", closeMenu);
  }, [contextMenu]);

  if (!profile) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-white dark:bg-black">
        <div className="flex flex-col items-center">
          <svg
            className="animate-spin h-10 w-10 text-gray-900 dark:text-white mb-2"
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
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            Loading profile...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-white dark:bg-black text-black dark:text-white px-4 sm:px-6 md:px-10 py-6 transition-all mt-16 flex flex-col">
      <div className="max-w-6xl mx-auto w-full flex-1 flex flex-col">
        {/* Profile Header */}
        <div className="bg-transparent rounded-2xl p-6 mb-6 flex flex-col md:flex-row items-center md:items-start gap-6 border border-gray-200 dark:border-gray-700">
          {/* Profile Photo */}
          <div className="flex-shrink-0">
            <img
              src={
                preview ||
                profile.profilePhoto ||
                "https://via.placeholder.com/150/111827/ffffff?text=User"
              }
              alt="Profile"
              className="w-28 h-28 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-transparent"
            />
          </div>

          {/* Info */}
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-2xl font-semibold tracking-tight flex items-center justify-center md:justify-start">
              {profile.username || profile.name}
              {profile.isVerified && (
                <span className="ml-2 inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-600 text-white text-xs">
                  ✓
                </span>
              )}
            </h2>

            {/* Posts count */}
            <div className="mt-2 flex flex-col md:flex-row md:items-center md:gap-4 items-center">
              <div className="flex flex-col items-center md:items-start">
                <p className="text-xl font-bold">{blogs.length}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Posts
                </p>
              </div>
            </div>

            {profile.name && (
              <p className="mt-2 text-sm text-gray-700 dark:text-gray-300 font-medium">
                {profile.name}
              </p>
            )}

            {profile.bio && (
              <p className="mt-2 text-gray-600 dark:text-gray-400 max-w-xl mx-auto md:mx-0">
                {profile.bio}
              </p>
            )}

            {/* Social Links */}
            <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-3">
              {profile.socialLinks?.twitter && (
                <a
                  href={profile.socialLinks.twitter}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm hover:underline text-blue-500"
                >
                  Twitter
                </a>
              )}
              {profile.socialLinks?.linkedin && (
                <a
                  href={profile.socialLinks.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm hover:underline text-blue-600"
                >
                  LinkedIn
                </a>
              )}
              {profile.socialLinks?.instagram && (
                <a
                  href={profile.socialLinks.instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm hover:underline text-pink-500"
                >
                  Instagram
                </a>
              )}
              {profile.socialLinks?.github && (
                <a
                  href={profile.socialLinks.github}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm hover:underline text-gray-700 dark:text-gray-300"
                >
                  GitHub
                </a>
              )}
              {profile.socialLinks?.website && (
                <a
                  href={profile.socialLinks.website}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm hover:underline text-green-500"
                >
                  Website
                </a>
              )}
            </div>
          </div>

          {/* Edit Button */}
          <div className="mt-4 md:mt-0 flex-shrink-0">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition w-full md:w-auto"
            >
              {isEditing ? "Cancel" : "Edit Profile"}
            </button>
          </div>
        </div>

        {/* Update Form */}
        {isEditing && (
          <form
            onSubmit={handleUpdate}
            className="bg-white dark:bg-black shadow-md rounded-xl p-6 mb-6 border dark:border-gray-800"
          >
            <h3 className="text-xl font-semibold mb-4">Update Profile</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Full Name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="p-2 border rounded-lg w-full dark:bg-black dark:border-gray-900 dark:text-white"
              />
              <input
                type="text"
                placeholder="Username"
                value={formData.username}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
                className="p-2 border rounded-lg w-full dark:bg-black dark:border-gray-900 dark:text-white"
              />
            </div>

            <textarea
              placeholder="Bio"
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              className="p-2 border rounded-lg w-full mt-4 dark:bg-black dark:border-gray-900 dark:text-white"
            />

            <div className="grid md:grid-cols-2 gap-4 mt-4">
              {["twitter", "linkedin", "instagram", "github", "website"].map(
                (field) => (
                  <input
                    key={field}
                    type="url"
                    placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                    value={formData[field]}
                    onChange={(e) =>
                      setFormData({ ...formData, [field]: e.target.value })
                    }
                    className="p-2 border rounded-lg w-full dark:bg-black dark:border-gray-700 dark:text-white"
                  />
                )
              )}
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium">Profile Photo</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="mt-2"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-6 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center w-full md:w-auto"
            >
              {loading && (
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
              {loading ? "Updating..." : "Update Profile"}
            </button>
          </form>
        )}

        {/* Blogs Grid */}
        <div className="bg-transparent rounded-xl p-2 flex-1">
          <h3 className="text-lg font-medium mb-4">My Posts</h3>
          {blogs.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400">No blogs yet.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {blogs.map((blog) => {
                const likeCount = blog?.likes?.length ?? blog?.likeCount ?? 0;
                const commentCount =
                  blog?.comments?.length ?? blog?.commentCount ?? 0;
                const imageUrl =
                  blog?.image ||
                  blog?.coverImage ||
                  blog?.images?.[0] ||
                  blog?.thumbnail ||
                  "";

                return (
                  <div
                    key={blog._id}
                    className="relative group overflow-hidden rounded-md bg-gray-100 dark:bg-gray-900"
                    onContextMenu={(e) => {
                      e.preventDefault();
                      const rect = e.currentTarget.getBoundingClientRect();
                      setContextMenu({
                        x: rect.left + rect.width / 2 - 80,
                        y:
                          rect.top +
                          rect.height / 2 -
                          40 +
                          window.scrollY,
                        blog,
                      });
                    }}
                    onTouchStart={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      longPressTimeout.current = setTimeout(() => {
                        setContextMenu({
                          x: rect.left + rect.width / 2 - 80,
                          y:
                            rect.top +
                            rect.height / 2 -
                            40 +
                            window.scrollY,
                          blog,
                        });
                      }, 600);
                    }}
                    onTouchEnd={() =>
                      clearTimeout(longPressTimeout.current)
                    }
                  >
                    <button
                      onClick={() => navigate(`/blog/${blog._id}`)}
                      className="block w-full h-64 sm:h-56 lg:h-48 p-0 m-0"
                    >
                      <img
                        src={
                          imageUrl ||
                          "https://via.placeholder.com/600x400/0f172a/ffffff?text=Post"
                        }
                        alt={blog.title || "blog image"}
                        className="w-full h-full object-cover transform transition-transform duration-300 group-hover:scale-105"
                        onError={(e) => {
                          e.currentTarget.src =
                            "https://via.placeholder.com/600x400/0f172a/ffffff?text=Post";
                        }}
                      />
                    </button>

                    {/* Hover overlay */}
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all duration-200">
                      <div className="opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-200 flex items-center gap-6 text-white">
                        <div className="flex items-center gap-2 text-sm">
                          <Heart className="w-4 h-4" />
                          <span className="font-medium">{likeCount}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <MessageSquare className="w-4 h-4" />
                          <span className="font-medium">{commentCount}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Context Menu */}
        <AnimatePresence>
          {contextMenu && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
              className="absolute bg-white backdrop-blur-md bg-white/60 dark:bg-black/60 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg z-50"
              style={{ top: contextMenu.y, left: contextMenu.x }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => {
                  navigate(`/edit-blog/${contextMenu.blog._id}`);
                  setContextMenu(null);
                }}
                className="flex items-center gap-2 px-4 py-2 w-full hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <Pencil className="w-4 h-4" /> Edit Blog
              </button>
              <button
                onClick={() => setDeleteConfirm(contextMenu.blog)}
                className="flex items-center gap-2 px-4 py-2 w-full hover:bg-gray-100 dark:hover:bg-gray-700 text-red-600"
              >
                <Trash2 className="w-4 h-4" /> Delete Blog
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Delete Confirmation */}
        <AnimatePresence>
          {deleteConfirm && (
            <motion.div
              className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="bg-white backdrop-blur-md bg-white/60 dark:bg-black/60 rounded-lg shadow-lg p-6 w-80"
              >
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold">Confirm Delete</h2>
                  <button
                    onClick={() => setDeleteConfirm(null)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Are you sure you want to delete this blog?
                </p>
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setDeleteConfirm(null)}
                    className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleDelete(deleteConfirm._id)}
                    disabled={deleteLoading}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center justify-center disabled:opacity-50"
                  >
                    {deleteLoading && (
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
                    {deleteLoading ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
