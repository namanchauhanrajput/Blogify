import { useEffect, useState } from "react";
import BlogCard from "../components/BlogCard";
// import { endpoints } from "../api";

export const Home = () => {
  const [blogs, setBlogs] = useState([]);
  const [categories, setCategories] = useState(["All"]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);

  // Fetch categories from backend
  const fetchCategories = async () => {
    try {
      const res = await fetch("https://bloging-platform.onrender.com/api/blog/categories/list");
      const data = await res.json();
      if (Array.isArray(data)) {
        setCategories(["All", ...data.filter(c => c)]); // remove empty categories
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
    <div className="max-w-6xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-4">Latest Blogs</h1>

      {/* Category Filter */}
      <div className="mb-6">
        <label className="mr-2 font-medium text-gray-700">Filter by Category:</label>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <p className="text-gray-600">Loading...</p>
      ) : filteredBlogs.length === 0 ? (
        <p className="text-gray-600">
          {selectedCategory === "All"
            ? "No blogs yet. Be the first to create!"
            : `No blogs in "${selectedCategory}" category.`}
        </p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBlogs.map((b) => (
            <BlogCard key={b._id} blog={b} />
          ))}
        </div>
      )}
    </div>
  );
};
