// src/admin/components/ConfirmDialog.jsx
export default function ConfirmDialog({
  open,
  title,
  description,
  onCancel,
  onConfirm,
  loading = false, // new prop for loader state
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white dark:bg-gray-900 p-5 shadow-xl border border-gray-200 dark:border-gray-700">
        {/* Title */}
        <h3 className="text-lg font-semibold mb-1 text-gray-900 dark:text-gray-100">
          {title}
        </h3>

        {/* Description */}
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          {description}
        </p>

        {/* Actions */}
        <div className="flex justify-end gap-2">
          <button
            onClick={onCancel}
            disabled={loading}
            className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                       hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200 
                       disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex items-center justify-center px-4 py-2 rounded-lg 
                       bg-red-600 text-white hover:bg-red-700 dark:hover:bg-red-500 
                       disabled:opacity-50 disabled:cursor-not-allowed min-w-[100px]"
          >
            {loading ? (
              <span className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 200 200"
                  className="w-8 h-5"
                >
                  <circle
                    fill="#fff"
                    stroke="#fff"
                    strokeWidth="15"
                    r="15"
                    cx="40"
                    cy="65"
                  >
                    <animate
                      attributeName="cy"
                      calcMode="spline"
                      dur="2s"
                      values="65;135;65;"
                      keySplines=".5 0 .5 1;.5 0 .5 1"
                      repeatCount="indefinite"
                      begin="-.4s"
                    />
                  </circle>
                  <circle
                    fill="#fff"
                    stroke="#fff"
                    strokeWidth="15"
                    r="15"
                    cx="100"
                    cy="65"
                  >
                    <animate
                      attributeName="cy"
                      calcMode="spline"
                      dur="2s"
                      values="65;135;65;"
                      keySplines=".5 0 .5 1;.5 0 .5 1"
                      repeatCount="indefinite"
                      begin="-.2s"
                    />
                  </circle>
                  <circle
                    fill="#fff"
                    stroke="#fff"
                    strokeWidth="15"
                    r="15"
                    cx="160"
                    cy="65"
                  >
                    <animate
                      attributeName="cy"
                      calcMode="spline"
                      dur="2s"
                      values="65;135;65;"
                      keySplines=".5 0 .5 1;.5 0 .5 1"
                      repeatCount="indefinite"
                      begin="0s"
                    />
                  </circle>
                </svg>
              </span>
            ) : (
              "Confirm"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
