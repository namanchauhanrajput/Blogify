import { useEffect, useState } from "react";

export default function EditUserModal({ open, onClose, onSubmit, initial, loading = false }) {
  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    phone: "",
    isAdmin: false,
  });

  useEffect(() => {
    if (initial) {
      setForm({
        name: initial.name || "",
        username: initial.username || "",
        email: initial.email || "",
        phone: initial.phone || "",
        isAdmin: !!initial.isAdmin,
      });
    }
  }, [initial]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white dark:bg-black p-5 shadow-xl border border-gray-200 dark:border-gray-700">
        {/* Title */}
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
          Edit User
        </h3>

        {/* Form */}
        <div className="grid gap-3">
          <div>
            <label className="text-sm text-gray-700 dark:text-gray-300">
              Name
            </label>
            <input
              className="w-full border rounded-lg px-3 py-2 bg-white dark:bg-black dark:border-gray-700 dark:text-gray-100"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="text-sm text-gray-700 dark:text-gray-300">
                Username
              </label>
              <input
                className="w-full border rounded-lg px-3 py-2 bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm text-gray-700 dark:text-gray-300">
                Phone
              </label>
              <input
                className="w-full border rounded-lg px-3 py-2 bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="text-sm text-gray-700 dark:text-gray-300">
              Email
            </label>
            <input
              type="email"
              className="w-full border rounded-lg px-3 py-2 bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>

          <label className="inline-flex items-center gap-2 mt-1 text-gray-700 dark:text-gray-300">
            <input
              type="checkbox"
              checked={form.isAdmin}
              onChange={(e) =>
                setForm({ ...form, isAdmin: e.target.checked })
              }
              className="w-4 h-4 accent-gray-900 dark:accent-gray-200"
            />
            <span>Is Admin</span>
          </label>
        </div>

        {/* Actions */}
        <div className="mt-5 flex justify-end gap-2">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200"
          >
            Cancel
          </button>

          <button
            onClick={() => onSubmit(form)}
            disabled={loading}
            className="px-4 py-2 rounded-lg bg-gray-900 text-white hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200 flex items-center justify-center gap-2"
          >
            {loading ? (
              <span className="w-6 h-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 200 200"
                  className="w-6 h-6"
                >
                  <circle
                    fill="#FF156D"
                    stroke="#FF156D"
                    strokeWidth="15"
                    r="15"
                    cx="40"
                    cy="100"
                  >
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
                  <circle
                    fill="#FF156D"
                    stroke="#FF156D"
                    strokeWidth="15"
                    r="15"
                    cx="100"
                    cy="100"
                  >
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
                  <circle
                    fill="#FF156D"
                    stroke="#FF156D"
                    strokeWidth="15"
                    r="15"
                    cx="160"
                    cy="100"
                  >
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
              </span>
            ) : (
              "Save"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
