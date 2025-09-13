// src/pages/CreateBlog.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";

// ✅ Utility function to clean Quill HTML
const cleanHtml = (dirty) => {
  if (!dirty) return "";
  const parser = new DOMParser();
  const doc = parser.parseFromString(dirty, "text/html");
  doc.querySelectorAll(".ql-ui").forEach((el) => el.remove());
  doc.querySelectorAll("*").forEach((el) => {
    [...el.attributes].forEach((attr) => {
      if (attr.name.startsWith("data-")) el.removeAttribute(attr.name);
    });
  });
  return doc.body.innerHTML;
};

export const CreateBlog = () => {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    content: "",
    category: "",
  });
  const [image, setImage] = useState(null);
  const [imgSrc, setImgSrc] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(false);

  const categories = [
    "Technology",
    "Photography",
    "Lifestyle",
    "Quotes",
    "Food",
    "Fitness",
    "Sports",
    "Entertainment",
    "Travel",
    "Others",
  ];

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onload = () => setImgSrc(reader.result.toString());
      reader.readAsDataURL(file);
    }
  };

  // ✅ Quill toolbar config
  const quillModules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link"],
      ["clean"],
    ],
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.title || !form.content || !form.category || !image) {
      setError("Please fill all required fields and upload an image.");
      return;
    }

    try {
      setSubmitting(true);
      const cleanContent = cleanHtml(form.content);
      const fd = new FormData();
      fd.append("title", form.title);
      fd.append("content", cleanContent);
      fd.append("category", form.category);
      fd.append("image", image);

      const res = await fetch(
        "https://bloging-platform.onrender.com/api/blog/create",
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: fd,
        }
      );

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Failed to create blog");
      }
      navigate(`/`);
    } catch (e) {
      setError(e.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div className="md:pt-16"></div>
      <div className="min-h-screen flex items-center justify-center px-4 py-10 bg-gray-50 dark:bg-black transition-colors">
        <div className="w-full max-w-2xl bg-white dark:bg-black rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 p-8 transition-colors">
          {/* Title */}
          <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-8 tracking-wide">
            New Post
          </h1>

          {/* Error */}
          {error && (
            <p className="text-red-500 dark:text-red-400 mb-4 text-center text-sm">
              {error}
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Upload */}
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-6 text-center hover:border-blue-500 transition">
              <label className="cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                {!imgSrc ? (
                  <div className="flex flex-col items-center justify-center text-gray-500 dark:text-gray-300">
                    <svg
                      className="w-12 h-12 mb-2 text-blue-500"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 15a4 4 0 014-4h.586a1 1 0 00.707-.293l2.414-2.414a2 2 0 012.828 0L16.586 11H17a4 4 0 014 4v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5z"
                      />
                    </svg>
                    <span className="text-sm">Upload your photo</span>
                    <span className="text-xs text-gray-400 dark:text-gray-500">
                      Drag & drop or click to browse
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <img
                      src={imgSrc}
                      alt="Preview"
                      className="rounded-lg max-h-64 object-cover"
                    />
                    <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                      {image?.name}
                    </p>
                  </div>
                )}
              </label>
            </div>

            {/* ✅ Rich Text Editor */}
            <div>
              <ReactQuill
                theme="snow"
                value={form.content}
                onChange={(value) => setForm({ ...form, content: value })}
                modules={quillModules}
                placeholder="What's on your mind? "
                className="quill-editor bg-gray-100 dark:bg-black text-gray-900 dark:text-white rounded-lg border border-gray-300 dark:border-gray-700 min-h-[150px]"
              />
            </div>

            {/* Title */}
            <div>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Enter blog title"
                className="w-full p-4 rounded-lg bg-gray-100 dark:bg-black text-gray-900 dark:text-white border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm transition-colors"
                required
              />
            </div>

            {/* ✅ Animated Category Dropdown (UPWARDS) */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setOpenDropdown((p) => !p)}
                className="w-full p-4 rounded-lg bg-gray-100 dark:bg-black text-gray-900 dark:text-white border border-gray-300 dark:border-gray-700 flex justify-between items-center text-sm"
              >
                {form.category || "Select a category"}
                {openDropdown ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </button>

              <AnimatePresence>
                {openDropdown && (
                  <motion.ul
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.25 }}
                    className="absolute bottom-full mb-2 w-full bg-white dark:bg-black border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg max-h-60 overflow-y-auto"
                  >
                    {categories.map((cat, idx) => (
                      <motion.li
                        key={cat}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.03 }}
                      >
                        <button
                          type="button"
                          onClick={() => {
                            setForm({ ...form, category: cat });
                            setOpenDropdown(false);
                          }}
                          className={`w-full text-left px-4 py-2 text-sm hover:bg-blue-100 dark:hover:bg-gray-800 ${
                            form.category === cat
                              ? "bg-blue-500 text-white"
                              : "text-gray-700 dark:text-gray-200"
                          }`}
                        >
                          {cat}
                        </button>
                      </motion.li>
                    ))}
                  </motion.ul>
                )}
              </AnimatePresence>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 rounded-lg bg-gradient-to-r from-blue-600 to-blue-400 text-white font-semibold hover:opacity-90 transition disabled:opacity-50 text-sm shadow-lg"
            >
              {submitting ? "Submitting..." : "Share Post"}
            </button>
          </form>
        </div>
      </div>

      {/* ✅ Dark mode placeholder fix */}
      <style>{`
        .quill-editor .ql-editor.ql-blank::before {
          color: #9ca3af !important;
          font-style: normal;
        }
      `}</style>
    </>
  );
};
