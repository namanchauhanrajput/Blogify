import { useEffect, useState } from "react";
import BlogCard from "../components/BlogCard";
import { motion } from "framer-motion";

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
      const res = await fetch("https://bloging-platform.onrender.com/api/blog");
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
    <div className="flex-1 min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 overflow-x-hidden">
      {/* ✅ Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="pt-20 pb-10 bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 text-white text-center shadow-md"
      >
        <motion.h1
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.05, ease: "easeOut" }}
          className="text-3xl sm:text-4xl font-bold mb-3"
        >
          Discover Amazing Stories
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15, ease: "easeOut" }}
          className="text-base sm:text-lg max-w-xl mx-auto"
        >
          Your space to create, share, and inspire others. Share your thoughts,
          learn from others, and explore topics that matter to you.
        </motion.p>
      </motion.section>

      {/* ✅ Categories Section */}
      <div className="w-full flex justify-center mt-6 sm:mt-8">
        <div className="flex flex-wrap gap-3 justify-center">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                selectedCategory === cat
                  ? "bg-indigo-600 text-white shadow-md"
                  : "bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-700"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* ✅ Blog List */}
      <div className="px-2 sm:px-6 lg:px-8 pb-20 w-full mt-6 sm:mt-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center min-h-screen">
            <svg
              className="animate-spin h-10 w-10 text-blue-600 dark:text-blue-400 mb-2"
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
            <p className="text-gray-600 dark:text-gray-400 text-center">
              Loading blogs...
            </p>
          </div>
        ) : filteredBlogs.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-400 text-center md:text-left">
            {selectedCategory === "All"
              ? "No blogs yet. Be the first to create!"
              : `No blogs in "${selectedCategory}" category.`}
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
            {filteredBlogs.map((b) => (
              <BlogCard key={b._id} blog={b} className="w-full" />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
