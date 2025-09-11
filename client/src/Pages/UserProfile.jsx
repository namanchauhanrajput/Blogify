// src/Pages/UserProfile.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import BlogCard from "../components/BlogCard";

const API_URL = "https://bloging-platform.onrender.com/api";

const UserProfile = () => {
  const { userId } = useParams();
  const [profile, setProfile] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await axios.get(`${API_URL}/blog/user/${userId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        setProfile(res.data.userProfile);
        setBlogs(res.data.blogs || []);
      } catch (err) {
        console.error("Error fetching user profile:", err);

        if (err.response?.data?.message) {
          setError(err.response.data.message);
        } else {
          setError("Something went wrong. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchProfileData();
  }, [userId]);

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen dark:bg-gray-900">
        <svg
          className="animate-spin h-12 w-12 text-blue-600 mb-3"
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
    );

  if (error)
    return (
      <div className="text-center py-10 text-red-500 dark:text-red-400 dark:bg-gray-900 min-h-screen">
        {error}
      </div>
    );

  // ✅ सिर्फ non-empty links रखो
  const socialLinks = profile?.socialLinks || {};
  const validLinks = Object.entries(socialLinks).filter(
    ([, link]) => link && link.trim() !== ""
  );

  // ✅ Key को readable नाम से map करो
  const linkLabels = {
    twitter: "Twitter",
    linkedin: "LinkedIn",
    instagram: "Instagram",
    github: "GitHub",
    website: "Website",
  };

  return (
    <div className="w-full px-4 sm:px-6 md:px-10 py-6 dark:bg-gray-900 dark:text-white min-h-screen transition-all mt-16">
      {/* Profile Card */}
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-2xl p-6 mb-6 flex flex-col lg:flex-row items-center lg:items-start gap-6">
        {/* Profile Photo */}
        <img
          src={profile?.profilePhoto}
          alt={profile?.username}
          className="w-28 h-28 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-gray-200 dark:border-gray-700"
        />

        {/* Info */}
        <div className="flex-1 text-center lg:text-left">
          <h2 className="text-2xl font-bold">{profile?.name}</h2>
          <div className="flex flex-wrap justify-center lg:justify-start items-center gap-3 mt-2">
            <p className="text-gray-600 dark:text-gray-400">
              @{profile?.username}
            </p>
            <span className="bg-blue-100 text-blue-700 dark:bg-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm font-medium">
              {blogs.length} Blogs
            </span>
          </div>
          <p className="mt-3 text-gray-700 dark:text-gray-300">
            {profile?.bio}
          </p>

          {/* Social Links */}
          {validLinks.length > 0 && (
            <div className="flex flex-wrap gap-3 mt-4 justify-center lg:justify-start">
              {validLinks.map(([key, link]) => (
                <a
                  key={key}
                  href={link}
                  target="_blank"
                  rel="noreferrer"
                  className={`hover:underline ${
                    key === "twitter"
                      ? "text-blue-500"
                      : key === "linkedin"
                      ? "text-blue-700"
                      : key === "instagram"
                      ? "text-pink-500"
                      : key === "github"
                      ? "text-gray-400"
                      : "text-green-500"
                  }`}
                >
                  {linkLabels[key] || key}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Blogs */}
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-xl p-6">
        <h3 className="text-xl font-semibold mb-4">
          Blogs by {profile?.username}{" "}
          <span className="text-gray-500 dark:text-gray-400 text-base">
            ({blogs.length})
          </span>
        </h3>
        {blogs.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {blogs.map((blog) => (
              <div key={blog._id} className="w-full">
                <BlogCard blog={blog} />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 dark:text-gray-400">No blogs yet.</p>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
