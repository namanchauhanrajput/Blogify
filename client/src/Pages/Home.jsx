import { useEffect, useRef, useState } from "react";
import BlogCard from "../components/BlogCard";
import { FaListUl } from "react-icons/fa";
import { Moon, Sun, Bell } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";

export const Home = () => {
  const [blogs, setBlogs] = useState([]);
  const [categories, setCategories] = useState(["All"]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const containerRef = useRef(null);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  // Close menus when clicking outside
  useEffect(() => {
    const onClickOutside = (e) => {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(e.target)) setOpen(false);
    };
    if (open) document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [open]);

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
      {/* Home Screen Top Navbar */}
      <div
        className="fixed top-0 z-40 w-full bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center px-4 py-3"
        ref={containerRef}
      >
        {/* Category Filter Button */}
        <button
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 shadow-sm hover:shadow-md transition"
        >
          <FaListUl /> {selectedCategory}
        </button>

        {/* Right Side Actions (only visible on mobile & tablet) */}
        <div className="flex items-center gap-2 lg:hidden">
          {/* Night Mode Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* Notifications Icon */}
          <NavLink
            to="/notifications"
            className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            <Bell size={18} />
          </NavLink>
        </div>

        {/* Dropdown */}
        {open && (
          <div className="absolute top-full mt-2 left-4 z-50 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg flex flex-col sm:flex-row sm:space-x-2 sm:space-y-0 space-y-1 p-2 animate-slide-down">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  setOpen(false);
                }}
                className={`px-4 py-2 text-sm text-left sm:text-center hover:bg-gray-100 dark:hover:bg-gray-700 transition ${
                  selectedCategory === cat
                    ? "bg-gray-100 dark:bg-gray-700 font-medium"
                    : ""
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ✅ Hero Section - Smaller + Animated + Blogify Colors */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="pt-20 pb-10 bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 text-white text-center shadow-md"
      >
        <h1 className="text-3xl sm:text-4xl font-bold mb-3">
          Discover Amazing Stories
        </h1>
        <p className="text-base sm:text-lg max-w-xl mx-auto">
          Your space to create, share, and inspire others. Share your thoughts,
          learn from others, and explore topics that matter to you.
        </p>
      </motion.section>

      {/* Blog List */}
      <div className="px-2 sm:px-6 lg:px-8 pb-20 w-full">
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
