import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import BlogCard from "../components/BlogCard";
import { useNavigate } from "react-router-dom";

export default function MyProfile() {
  const { token, user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [blogs, setBlogs] = useState([]);
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
  const [isEditing, setIsEditing] = useState(false);

  const navigate = useNavigate();

  // ✅ Fetch profile + blogs
  useEffect(() => {
    if (!user?._id) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `https://bloging-platform.onrender.com/api/blog/user/${user._id}`
        );
        setProfile(res.data.userProfile);
        setBlogs(res.data.blogs);
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
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setProfilePhoto(file);
    setPreview(URL.createObjectURL(file));
  };

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
        `https://bloging-platform.onrender.com/api/blog/user/update/profile`,
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
      alert("✅ Profile updated successfully!");
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBlog = (id) => {
    setBlogs((prev) => prev.filter((b) => b._id !== id));
    navigate("/my-profile");
  };

  if (!profile) {
    return (
      <div className="flex justify-center items-center min-h-screen dark:bg-gray-900">
        <div className="flex flex-col items-center">
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
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            Loading profile...
          </p>
        </div>
      </div>
    );
  }

  return (
    // ✅ FIX: margin-left 240px for desktop because of sidebar
    <div className="lg:ml-60 px-4 sm:px-6 md:px-10 lg:px-20 xl:px-40 py-6 dark:bg-gray-900 dark:text-white min-h-screen transition-all">
      {/* Profile Header */}
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-2xl p-6 mb-6 flex flex-col lg:flex-row items-center lg:items-start gap-6">
        {/* Profile Photo */}
        <img
          src={preview || profile.profilePhoto}
          alt="Profile"
          className="w-28 h-28 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-gray-200 dark:border-gray-700"
        />

        {/* Info */}
        <div className="flex-1 text-center lg:text-left">
          <h2 className="text-2xl font-bold">{profile.name}</h2>
          <div className="flex flex-wrap justify-center lg:justify-start items-center gap-3 mt-2">
            <p className="text-gray-600 dark:text-gray-400">
              @{profile.username}
            </p>
            <span className="bg-blue-100 text-blue-700 dark:bg-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm font-medium">
              {blogs.length} Blogs
            </span>
          </div>
          <p className="mt-3 text-gray-700 dark:text-gray-300">{profile.bio}</p>

          {/* Social Links */}
          <div className="flex flex-wrap gap-3 mt-4 justify-center lg:justify-start">
            {profile.socialLinks?.twitter && (
              <a
                href={profile.socialLinks.twitter}
                target="_blank"
                rel="noreferrer"
                className="hover:underline text-blue-500"
              >
                Twitter
              </a>
            )}
            {profile.socialLinks?.linkedin && (
              <a
                href={profile.socialLinks.linkedin}
                target="_blank"
                rel="noreferrer"
                className="hover:underline text-blue-700"
              >
                LinkedIn
              </a>
            )}
            {profile.socialLinks?.instagram && (
              <a
                href={profile.socialLinks.instagram}
                target="_blank"
                rel="noreferrer"
                className="hover:underline text-pink-500"
              >
                Instagram
              </a>
            )}
            {profile.socialLinks?.github && (
              <a
                href={profile.socialLinks.github}
                target="_blank"
                rel="noreferrer"
                className="hover:underline text-gray-400"
              >
                GitHub
              </a>
            )}
            {profile.socialLinks?.website && (
              <a
                href={profile.socialLinks.website}
                target="_blank"
                rel="noreferrer"
                className="hover:underline text-green-500"
              >
                Website
              </a>
            )}
          </div>
        </div>

        {/* Edit Button */}
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          {isEditing ? "Cancel" : "Edit Profile"}
        </button>
      </div>

      {/* Update Form */}
      {isEditing && (
        <form
          onSubmit={handleUpdate}
          className="bg-white dark:bg-gray-800 shadow-md rounded-xl p-6 mb-6"
        >
          <h3 className="text-xl font-semibold mb-4">Update Profile</h3>

          <div className="grid md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Full Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="p-2 border rounded-lg w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
            <input
              type="text"
              placeholder="Username"
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
              className="p-2 border rounded-lg w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>

          <textarea
            placeholder="Bio"
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            className="p-2 border rounded-lg w-full mt-4 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
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
                  className="p-2 border rounded-lg w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white"
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
            className="mt-6 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center"
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

      {/* User Blogs */}
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-xl p-6 ">
        <h3 className="text-xl font-semibold mb-4">My Blogs</h3>
        {blogs.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">No blogs yet.</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {blogs.map((blog) => (
              <BlogCard key={blog._id} blog={blog} onDelete={handleDeleteBlog} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
