import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

export const CreateBlog = () => {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    content: "",
    category: "",
  });
  const [image, setImage] = useState(null);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Crop state
  const [crop, setCrop] = useState();
  const [completedCrop, setCompletedCrop] = useState(null);
  const [imgSrc, setImgSrc] = useState("");
  const imgRef = useRef(null);
  const previewCanvasRef = useRef(null);

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
      reader.addEventListener("load", () => setImgSrc(reader.result.toString()));
      reader.readAsDataURL(file);
    }
  };

  // Draw cropped output
  const onCropComplete = (c) => {
    setCompletedCrop(c);
    if (imgRef.current && c.width && c.height) {
      const canvas = previewCanvasRef.current;
      const image = imgRef.current;
      const scaleX = image.naturalWidth / image.width;
      const scaleY = image.naturalHeight / image.height;
      const ctx = canvas.getContext("2d");
      const pixelRatio = window.devicePixelRatio;
      canvas.width = c.width * pixelRatio;
      canvas.height = c.height * pixelRatio;

      ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      ctx.imageSmoothingQuality = "high";

      ctx.drawImage(
        image,
        c.x * scaleX,
        c.y * scaleY,
        c.width * scaleX,
        c.height * scaleY,
        0,
        0,
        c.width,
        c.height
      );
    }
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

      // If cropped → export cropped canvas as blob
      let finalImage = image;
      if (completedCrop && previewCanvasRef.current) {
        await new Promise((resolve) => {
          previewCanvasRef.current.toBlob((blob) => {
            if (blob) {
              finalImage = new File([blob], image.name, { type: "image/jpeg" });
            }
            resolve();
          }, "image/jpeg");
        });
      }

      const fd = new FormData();
      fd.append("title", form.title);
      fd.append("content", form.content);
      fd.append("category", form.category);
      fd.append("image", finalImage);

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
    <div className="min-h-screen flex items-center justify-center px-4 py-10 
      bg-gray-50 dark:bg-gradient-to-br dark:from-black dark:to-gray-900 transition-colors">
      <div className="w-full max-w-2xl bg-white dark:bg-gray-950 rounded-2xl shadow-2xl 
        border border-gray-200 dark:border-gray-800 p-8 transition-colors">
        {/* Title */}
        <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-gray-100 mb-8 tracking-wide">
          Create New Post
        </h1>

        {/* Error */}
        {error && (
          <p className="text-red-500 dark:text-red-400 mb-4 text-center text-sm">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Upload */}
          <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 
            rounded-xl p-6 text-center hover:border-blue-500 transition">
            <label className="cursor-pointer">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
              {!imgSrc ? (
                <div className="flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
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
                  <ReactCrop
                    crop={crop}
                    onChange={(_, percentCrop) => setCrop(percentCrop)}
                    onComplete={onCropComplete}
                    className="rounded-lg"
                  >
                    <img ref={imgRef} src={imgSrc} alt="Preview" />
                  </ReactCrop>

                  <canvas ref={previewCanvasRef} className="hidden" />

                  <p className="mt-2 text-xs text-gray-500">{image?.name}</p>
                </div>
              )}
            </label>
          </div>

          {/* Caption */}
          <div>
            <textarea
              name="content"
              value={form.content}
              onChange={handleChange}
              rows={4}
              placeholder="What's on your mind?"
              className="w-full p-4 rounded-lg bg-gray-100 dark:bg-gray-900 
              text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-700 
              focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none text-sm transition-colors"
              required
            ></textarea>
          </div>

          {/* Title */}
          <div>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Enter blog title"
              className="w-full p-4 rounded-lg bg-gray-100 dark:bg-gray-900 
              text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-700 
              focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm transition-colors"
              required
            />
          </div>

          {/* Category */}
          <div>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full p-4 rounded-lg bg-gray-100 dark:bg-gray-900 
              text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-700 
              focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm transition-colors"
              required
            >
              <option value="" disabled>
                Select a category
              </option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 rounded-lg bg-gradient-to-r from-blue-600 to-blue-400 
            text-white font-semibold hover:opacity-90 transition disabled:opacity-50 
            text-sm shadow-lg"
          >
            {submitting ? "Submitting..." : "Share Post"}
          </button>
        </form>
      </div>
    </div>
  );
};
