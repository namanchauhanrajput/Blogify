import { useEffect, useState } from "react";
import BlogCard from "../components/BlogCard";

export const Home = () => {
  const [blogs, setBlogs] = useState([]);
  const [categories, setCategories] = useState(["All"]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const res = await fetch(
        "https://bloging-platform.onrender.com/api/blog/categories/list"
      );
      const data = await res.json();
      if (Array.isArray(data)) {
        setCategories(["All", ...data.filter((c) => c)]);
      }
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  // Fetch blogs
  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        "https://bloging-platform.onrender.com/api/blog"
      );
      const data = await res.json();
      setBlogs(data || []);
    } catch (err) {
      console.error("Error fetching blogs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchBlogs();
  }, []);

  const filteredBlogs =
    selectedCategory === "All"
      ? blogs
      : blogs.filter((b) => b.category === selectedCategory);

  return (
    <div
      className="
        flex-1 
        min-h-screen 
        bg-gray-50 
        px-4 
        sm:px-6 
        lg:px-8 
        py-6 
        lg:ml-60
      "
    >
      {/* Category Filter */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center gap-3">
        <label className="font-medium text-gray-700">
          Filter by Categories:
        </label>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="
            px-4 py-2 
            border border-gray-300 
            rounded-lg 
            focus:outline-none 
            focus:ring-2 
            focus:ring-blue-500 
            shadow-sm 
            w-full sm:w-auto
          "
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Blog List */}
      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-screen">
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
          <p className="text-gray-600 text-center">
            Loading blogs...
          </p>
        </div>

      ) : filteredBlogs.length === 0 ? (
        <p className="text-gray-600 text-center md:text-left">
          {selectedCategory === "All"
            ? "No blogs yet. Be the first to create!"
            : `No blogs in "${selectedCategory}" category.`}
        </p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredBlogs.map((b) => (
            <BlogCard key={b._id} blog={b} />
          ))}
        </div>
      )}
    </div>
  );
};
