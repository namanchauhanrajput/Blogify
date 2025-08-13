// src/Pages/Home.jsx
import { useEffect, useState } from "react";
import { endpoints } from "../api";
import BlogCard from "../components/BlogCard";

export const Home = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBlogs = async () => {
    try {
      const res = await fetch(endpoints.blogs);
      const data = await res.json();
      setBlogs(data || []);
    } catch (e) {
      console.error("Fetch blogs error", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-4">Latest Blogs</h1>

      {loading ? (
        <p className="text-gray-600">Loading...</p>
      ) : blogs.length === 0 ? (
        <p className="text-gray-600">No blogs yet. Be the first to create!</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map((b) => (
            <BlogCard key={b._id} blog={b} />
          ))}
        </div>
      )}
    </div>
  );
};
