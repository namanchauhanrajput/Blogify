import { useEffect, useState } from "react";

export default function EditBlogModal({ open, onClose, onSubmit, initial, loading = false }) {
  const [form, setForm] = useState({ title: "", content: "" });

  useEffect(() => {
    if (initial) {
      setForm({
        title: initial.title || "",
        content: initial.content || "",
      });
    }
  }, [initial]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-2xl rounded-2xl bg-white dark:bg-gray-900 p-5 shadow-xl border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">Edit Blog</h3>

        <div className="grid gap-3">
          <div>
            <label className="text-sm text-gray-700 dark:text-gray-300">Title</label>
            <input
              className="w-full border rounded-lg px-3 py-2 bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          </div>
          <div>
            <label className="text-sm text-gray-700 dark:text-gray-300">Content</label>
            <textarea
              rows={8}
              className="w-full border rounded-lg px-3 py-2 bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
            />
          </div>
        </div>

        <div className="mt-5 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={() => onSubmit(form)}
            className="px-4 py-2 rounded-lg bg-gray-900 text-white hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200 flex items-center gap-2"
            disabled={loading}
          >
            {loading && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 200 200"
                className="w-5 h-5"
              >
                <circle fill="#FF156D" stroke="#FF156D" strokeWidth="15" r="15" cx="40" cy="100">
                  <animate
                    attributeName="opacity"
                    calcMode="spline"
                    dur="2"
                    values="1;0;1;"
                    keySplines=".5 0 .5 1;.5 0 .5 1"
                    repeatCount="indefinite"
                    begin="-.4"
                  />
                </circle>
                <circle fill="#FF156D" stroke="#FF156D" strokeWidth="15" r="15" cx="100" cy="100">
                  <animate
                    attributeName="opacity"
                    calcMode="spline"
                    dur="2"
                    values="1;0;1;"
                    keySplines=".5 0 .5 1;.5 0 .5 1"
                    repeatCount="indefinite"
                    begin="-.2"
                  />
                </circle>
                <circle fill="#FF156D" stroke="#FF156D" strokeWidth="15" r="15" cx="160" cy="100">
                  <animate
                    attributeName="opacity"
                    calcMode="spline"
                    dur="2"
                    values="1;0;1;"
                    keySplines=".5 0 .5 1;.5 0 .5 1"
                    repeatCount="indefinite"
                    begin="0"
                  />
                </circle>
              </svg>
            )}
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
