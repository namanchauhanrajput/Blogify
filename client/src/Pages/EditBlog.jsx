// src/Pages/EditBlog.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { endpoints, authHeaders } from "../api";
import { useAuth } from "../context/AuthContext";

export const EditBlog = () => {
  const { id } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ title: "", content: "", category: "" });
  const [image, setImage] = useState(null);
  const [existingImage, setExistingImage] = useState("");
  const [preview, setPreview] = useState("");
  const [saving, setSaving] = useState(false);

  const fetchBlog = async () => {
    const res = await fetch(endpoints.blog(id), { headers: authHeaders(token) });
    const data = await res.json();
    const b = data.blog || data;
    setForm({
      title: b.title || "",
      content: b.content || "",
      category: b.category || "",
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
      if (image) fd.append("image", image);

      const res = await fetch(endpoints.blog(id), {
        method: "PUT",
        headers: { ...authHeaders(token) },
        body: fd,
      });
      if (!res.ok) throw new Error("Update failed");
      const updated = await res.json();
      navigate(`/blog/${updated._id}`);
    } catch (e) {
      alert(e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-4">Edit Blog</h1>

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
        <input
          name="category"
          placeholder="Category (optional)"
          value={form.category}
          onChange={onChange}
          className="w-full border rounded-lg px-4 py-2"
        />

        <div>
          <label className="block mb-2 text-sm text-gray-600">Cover Image (optional)</label>
          <input type="file" accept="image/*" onChange={onImage} />
          {(preview || existingImage) && (
            <img
              src={preview || existingImage}
              alt="preview"
              className="mt-3 w-full h-64 object-cover rounded-xl"
            />
          )}
        </div>

        <button
          type="submit"
          disabled={saving}
          className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
};
