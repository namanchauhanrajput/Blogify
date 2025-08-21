// src/Pages/EditBlog.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { endpoints, authHeaders } from "../api";
import { useAuth } from "../context/AuthContext";

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

  const fetchBlog = async () => {
    const res = await fetch(endpoints.getBlog(id), {
      headers: authHeaders(token)
    });
    if (!res.ok) throw new Error("Failed to fetch blog");
    const data = await res.json();
    const b = data.blog || data;
    setForm({
      title: b.title || "",
      content: b.content || "",
      category: b.category || "",
      tags: b.tags ? b.tags.join(", ") : ""
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
      fd.append("content", form.content);
      fd.append("category", form.category || "");
      fd.append("tags", form.tags);
      if (image) fd.append("image", image);

      const res = await fetch(endpoints.updateBlog(id), {
        method: "PUT",
        headers: { ...authHeaders(token) },
        body: fd
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
    <div className="max-w-4xl mx-auto px-4 py-8 bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-100">
        Edit Blog
      </h1>

      <form
        onSubmit={submit}
        className="space-y-6 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg transition-colors"
      >
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
            className="w-full border rounded-lg px-4 py-2 focus:ring focus:ring-blue-200 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
          />
        </div>

        {/* Content */}
        <div>
          <label className="block mb-2 font-medium text-gray-700 dark:text-gray-200">
            Content
          </label>
          <textarea
            name="content"
            placeholder="Write your content..."
            rows={10}
            value={form.content}
            onChange={onChange}
            required
            className="w-full border rounded-lg px-4 py-2 focus:ring focus:ring-blue-200 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
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
            className="w-full border rounded-lg px-4 py-2 focus:ring focus:ring-blue-200 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
          >
            <option value="">Select category</option>
            <option value="Technology">Technology</option>
            <option value="Business">Business</option>
            <option value="Lifestyle">Lifestyle</option>
            <option value="Education">Education</option>
            <option value="Travel">Travel</option>
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
            className="w-full border rounded-lg px-4 py-2 focus:ring focus:ring-blue-200 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
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
              className="mt-3 w-full h-64 object-cover rounded-xl border dark:border-gray-600"
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
  );
};
