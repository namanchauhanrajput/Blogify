import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const CreateBlog = () => {
  const { authorizationToken } = useAuth(); // ✅ use your token from context
  const navigate = useNavigate();

  const [form, setForm] = useState({ title: "", content: "", category: "" });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Text change handler
  const onChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Image change handler
  const onImage = (e) => {
    const f = e.target.files?.[0];
    setImage(f || null);
    setPreview(f ? URL.createObjectURL(f) : "");
  };

  // Form submit
  const submit = async (e) => {
    e.preventDefault();
    setError("");

    if (!image) {
      setError("Image is required");
      return;
    }

    try {
      setSubmitting(true);

      const fd = new FormData();
      fd.append("title", form.title);
      fd.append("content", form.content);
      if (form.category) fd.append("category", form.category);
      fd.append("image", image);

      const res = await fetch("https://bloging-platform.onrender.com/api/blog/create", {
        method: "POST",
        headers: {
          Authorization: authorizationToken, // ✅ directly using context token
        },
        body: fd,
        credentials: "include", // ✅ added as you asked
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Failed to create blog");
      }

      const created = await res.json();
      navigate(`/blog/${created._id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-4">Create New Blog</h1>

      {error && <p className="bg-red-100 text-red-700 p-2 rounded mb-3">{error}</p>}

      <form onSubmit={submit} className="space-y-4 bg-white p-5 rounded-2xl shadow">
        <input
          name="title"
          placeholder="Blog title"
          value={form.title}
          onChange={onChange}
          required
          className="w-full border rounded-lg px-4 py-2"
        />
        <textarea
          name="content"
          placeholder="Write your content..."
          rows={8}
          value={form.content}
          onChange={onChange}
          required
          className="w-full border rounded-lg px-4 py-2"
        />

        <div>
          <label className="block mb-2 text-sm text-gray-600">Cover Image*</label>
          <input type="file" accept="image/*" onChange={onImage} />
          {preview && (
            <img
              src={preview}
              alt="preview"
              className="mt-3 w-full h-64 object-cover rounded-xl"
            />
          )}
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
        >
          {submitting ? "Publishing..." : "Publish Blog"}
        </button>
      </form>
    </div>
  );
};
