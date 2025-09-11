// src/Pages/EditBlog.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { endpoints, authHeaders } from "../api";
import { useAuth } from "../context/AuthContext";

// ✅ Import React Quill
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

export const EditBlog = () => {
  const { id } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    content: "",
    category: "",
    tags: ""
  });
  const [image, setImage] = useState(null);
  const [existingImage, setExistingImage] = useState("");
  const [preview, setPreview] = useState("");
  const [saving, setSaving] = useState(false);

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

  const fetchBlog = async () => {
    const res = await fetch(endpoints.getBlog(id), {
      headers: authHeaders(token),
    });
    if (!res.ok) throw new Error("Failed to fetch blog");
    const data = await res.json();
    const b = data.blog || data;
    setForm({
      title: b.title || "",
      content: b.content || "",
      category: b.category || "",
      tags: b.tags ? b.tags.join(", ") : "",
    });
    setExistingImage(b.image || "");
  };

  useEffect(() => {
    fetchBlog();
    // eslint-disable-next-line
  }, [id]);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onImage = (e) => {
    const f = e.target.files?.[0];
    setImage(f || null);
    setPreview(f ? URL.createObjectURL(f) : "");
  };

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("title", form.title);
      fd.append("content", form.content); // ✅ Quill HTML content
      fd.append("category", form.category || "");
      fd.append("tags", form.tags);
      if (image) fd.append("image", image);

      const res = await fetch(endpoints.updateBlog(id), {
        method: "PUT",
        headers: { ...authHeaders(token) },
        body: fd,
      });

      if (!res.ok) throw new Error("Update failed");

      navigate("/blog");
    } catch (e) {
      alert(e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
    <div className="pt-16 sm:pt15"></div>
      <div className="min-h-screen bg-gray-50 dark:bg-black py-12 px-4 transition-colors">
        <div className="max-w-3xl mx-auto bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-2xl shadow-lg p-8 space-y-8">
          {/* Page Title */}
          <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-white">
            Edit Blog
          </h1>

          {/* Form */}
          <form onSubmit={submit} className="space-y-6">
            {/* Title */}
            <div>
              <label className="block mb-2 font-medium text-gray-700 dark:text-gray-200">
                Blog Title
              </label>
              <input
                name="title"
                placeholder="Enter blog title"
                value={form.title}
                onChange={onChange}
                required
                className="w-full border rounded-lg px-4 py-3 bg-gray-100 dark:bg-black text-gray-900 dark:text-white border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 outline-none transition-colors"
              />
            </div>

            {/* ✅ Rich Text Editor */}
            <div>
              <label className="block mb-2 font-medium text-gray-700 dark:text-gray-200">
                Content
              </label>
              <ReactQuill
                theme="snow"
                value={form.content}
                onChange={(value) => setForm({ ...form, content: value })}
                modules={quillModules}
                placeholder="Update your content..."
                className="bg-gray-100 dark:bg-black text-gray-900 dark:text-white rounded-lg border border-gray-300 dark:border-gray-700 min-h-[180px]"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block mb-2 font-medium text-gray-700 dark:text-gray-200">
                Category
              </label>
              <select
                name="category"
                value={form.category}
                onChange={onChange}
                className="w-full border rounded-lg px-4 py-3 bg-gray-100 dark:bg-black text-gray-900 dark:text-white border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 outline-none transition-colors"
              >
                <option value="">Select category</option>
                <option value="Technology">Technology</option>
                <option value="Photography">Photography</option>
                <option value="Lifestyle">Lifestyle</option>
                <option value="Quotes">Quotes</option>
                <option value="Food">Food</option>
                <option value="Fitness">Fitness</option>
                <option value="Sports">Sports</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Travel">Travel</option>
                <option value="Others">Others</option>
              </select>
            </div>

            {/* Tags */}
            <div>
              <label className="block mb-2 font-medium text-gray-700 dark:text-gray-200">
                Tags (comma separated)
              </label>
              <input
                type="text"
                name="tags"
                placeholder="e.g., React, JavaScript"
                value={form.tags}
                onChange={onChange}
                className="w-full border rounded-lg px-4 py-3 bg-gray-100 dark:bg-black text-gray-900 dark:text-white border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 outline-none transition-colors"
              />
            </div>

            {/* Image */}
            <div>
              <label className="block mb-2 font-medium text-gray-700 dark:text-gray-200">
                Cover Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={onImage}
                className="dark:text-gray-100"
              />
              {(preview || existingImage) && (
                <img
                  src={preview || existingImage}
                  alt="preview"
                  className="mt-3 w-full h-64 object-cover rounded-xl border border-gray-300 dark:border-gray-700"
                />
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={saving}
              className="w-full py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition flex justify-center items-center disabled:opacity-50"
            >
              {saving && (
                <svg
                  className="animate-spin h-5 w-5 text-white mr-2"
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
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4l3-3-3-3v4a12 12 0 00-12 12h4z"
                  ></path>
                </svg>
              )}
              {saving ? "Saving..." : "💾 Save Changes"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};
