import { useEffect, useRef, useState } from "react";
import BlogCard from "../components/BlogCard";
import { FaListUl } from "react-icons/fa";

export const Home = () => {
  const [blogs, setBlogs] = useState([]);
  const [categories, setCategories] = useState(["All"]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  const containerRef = useRef(null);

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
    <div
      className="
        flex-1 
        min-h-screen 
        bg-gray-50 dark:bg-gray-900
        px-4 sm:px-6 lg:px-8 py-6 lg:ml-60
        text-gray-900 dark:text-gray-100
      "
    >
      {/* Category Filter */}
      <div
        className="sticky top-0 z-50 bg-gray-50 dark:bg-gray-900 pb-4"
        ref={containerRef}
      >
        <button
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className="flex items-center gap-2 px-4 py-2 rounded-lg 
            bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 
            shadow-sm hover:shadow-md transition w-full sm:w-auto"
        >
          <FaListUl />
          {selectedCategory}
        </button>

        {/* Dropdown */}
        {open && (
          <div
            className={`
              absolute z-50 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700
              rounded-lg shadow-lg
              sm:top-12 sm:left-0 sm:ml-0 sm:flex sm:flex-row sm:whitespace-nowrap animate-slide-down
              mt-2 flex flex-col w-full sm:w-auto
            `}
          >
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  setOpen(false);
                }}
                className={`px-4 py-2 text-sm text-left sm:text-center 
                  hover:bg-gray-100 dark:hover:bg-gray-700 transition
                  ${
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

      {/* Blog List */}
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
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredBlogs.map((b) => (
            <BlogCard key={b._id} blog={b} />
          ))}
        </div>
      )}
    </div>
  );
};
