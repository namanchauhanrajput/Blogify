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
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6 dark:bg-gray-900 dark:text-gray-100">
      {/* Profile Info */}
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 text-center">
        <img
          src={profile?.profilePhoto}
          alt={profile?.username}
          className="w-24 h-24 mx-auto rounded-full object-cover border-2 border-gray-300 dark:border-gray-600"
        />
        <h2 className="text-2xl font-bold mt-3">@{profile?.username}</h2>
        <p className="text-gray-600 dark:text-gray-300">{profile?.name}</p>
        <p className="text-gray-600 dark:text-gray-400">{profile?.bio}</p>

        {/* ✅ Total Blogs Count */}
        <p className="mt-3 text-lg font-medium text-gray-800 dark:text-gray-200">
          Total Posts:{" "}
          <span className="font-bold text-blue-600 dark:text-blue-400">
            {blogs.length}
          </span>
        </p>

        {/* ✅ Links tab केवल तभी दिखे जब atleast 1 valid link हो */}
        {validLinks.length > 0 && (
          <div className="flex justify-center gap-4 mt-4 flex-wrap text-blue-600 dark:text-blue-400">
            {validLinks.map(([key, link]) => (
              <a
                key={key}
                href={link}
                target="_blank"
                rel="noreferrer"
                className="hover:underline"
              >
                {linkLabels[key] || key}
              </a>
            ))}
          </div>
        )}
      </div>

      {/* Blogs */}
      <div>
        <h3 className="text-xl font-semibold mb-4">
          Blogs by {profile?.username}{" "}
          <span className="text-gray-500 dark:text-gray-400 text-base">
            ({blogs.length})
          </span>
        </h3>
        {blogs.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2">
            {blogs.map((blog) => (
              <BlogCard key={blog._id} blog={blog} />
            ))}
          </div>
        ) : (
          <p className="text-gray-600 dark:text-gray-400">No blogs yet.</p>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
