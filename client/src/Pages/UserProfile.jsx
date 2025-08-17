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
  const [error, setError] = useState(""); // ✅ Error state add

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        setError(""); // ✅ Reset error on reload

        const res = await axios.get(`${API_URL}/blog/user/${userId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // ✅ Agar auth required hai
          },
        });

        setProfile(res.data.userProfile);
        setBlogs(res.data.blogs || []);
      } catch (err) {
        console.error("Error fetching user profile:", err);

        // ✅ Error message backend se aayega toh usko set kar do
        if (err.response && err.response.data && err.response.data.message) {
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

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error) return <div className="text-center py-10 text-red-500">{error}</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      {/* Profile Info */}
      <div className="bg-white shadow-md rounded-lg p-6 text-center">
        <img
          src={profile?.profilePhoto}
          alt={profile?.username}
          className="w-24 h-24 mx-auto rounded-full object-cover border-2"
        />
        <h2 className="text-2xl font-bold mt-3">@{profile?.username}</h2>
        <p className="text-gray-600">{profile?.name}</p>
        <p className="text-gray-600">{profile?.bio}</p>
      </div>

      {/* Blogs */}
      <div>
        <h3 className="text-xl font-semibold mb-4">
          Blogs by {profile?.username}
        </h3>
        {blogs.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2">
            {blogs.map((blog) => (
              <BlogCard key={blog._id} blog={blog} />
            ))}
          </div>
        ) : (
          <p className="text-gray-600">No blogs yet.</p>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
