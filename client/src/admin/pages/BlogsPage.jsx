// src/admin/pages/BlogsPage.jsx
import { useEffect, useMemo, useState, useCallback } from "react";
import { useAuth } from "../../context/AuthContext";
import { adminAxios, endpoints } from "../lib/adminApi";
import { Pencil, Trash2, RefreshCcw, Search } from "lucide-react";
import EditBlogModal from "../components/EditBlogModal";
import ConfirmDialog from "../components/ConfirmDialog";

export default function BlogsPage() {
  const { token } = useAuth();
  const api = useMemo(() => adminAxios(token), [token]);

  const [loading, setLoading] = useState(false);
  const [blogs, setBlogs] = useState([]);
  const [query, setQuery] = useState("");
  const [editOpen, setEditOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [confirm, setConfirm] = useState({
    open: false,
    id: null,
    loading: false,
  });

  const fetchBlogs = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get(endpoints.blogs);
      setBlogs(data || []);
    } catch (e) {
      console.error(e);
      alert("Error fetching blogs");
    } finally {
      setLoading(false);
    }
  }, [api]);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  const filtered = blogs.filter((b) => {
    const q = query.toLowerCase();
    return (
      b.title?.toLowerCase().includes(q) ||
      b.author?.username?.toLowerCase().includes(q) ||
      b.author?.email?.toLowerCase().includes(q)
    );
  });

  // Update blog
  async function handleUpdate(payload) {
    setUpdateLoading(true);
    try {
      const { data } = await api.put(endpoints.blogById(selected._id), payload);
      setBlogs((prev) => prev.map((b) => (b._id === data._id ? data : b)));
      setEditOpen(false);
      setSelected(null);
    } catch (e) {
      console.error(e);
      alert("Error updating blog");
    } finally {
      setUpdateLoading(false);
    }
  }

  // Delete blog with loader
  async function handleDelete(id) {
    try {
      setConfirm((prev) => ({ ...prev, loading: true }));
      await api.delete(endpoints.blogById(id));
      setBlogs((prev) => prev.filter((b) => b._id !== id));
      setConfirm({ open: false, id: null, loading: false });
    } catch (e) {
      console.error(e);
      alert("Error deleting blog");
      setConfirm((prev) => ({ ...prev, loading: false }));
    }
  }

  return (
    <section className="p-4 bg-white dark:bg-black min-h-screen transition-colors">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-lg font-bold text-gray-800 dark:text-gray-100">
          Blogs
        </h1>
        <button
          onClick={fetchBlogs}
          className="p-2 rounded-lg border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
        >
          <RefreshCcw className="w-4 h-4 text-gray-600 dark:text-gray-300" />
        </button>
      </div>

      {/* Search */}
      <div className="flex items-center gap-2 mb-4">
        <Search className="w-4 h-4 text-gray-500 dark:text-gray-400" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search blogs..."
          className="border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-sm w-64 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-800">
        <table className="w-full border-collapse">
          <thead className="bg-gray-100 dark:bg-gray-900">
            <tr className="border-b border-gray-200 dark:border-gray-800">
              <Th>Title</Th>
              <Th>Author</Th>
              <Th>Email</Th>
              <Th>Actions</Th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td
                  colSpan={4}
                  className="text-center py-6 text-gray-600 dark:text-gray-400"
                >
                  Loading...
                </td>
              </tr>
            )}
            {!loading && filtered.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  className="text-center py-6 text-gray-600 dark:text-gray-400"
                >
                  No blogs found
                </td>
              </tr>
            )}
            {!loading &&
              filtered.map((b) => (
                <tr
                  key={b._id}
                  className="border-t border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900/60"
                >
                  <Td>{b.title}</Td>
                  <Td>{b.author?.username || "-"}</Td>
                  <Td>{b.author?.email || "-"}</Td>
                  <Td>
                    <div className="flex items-center gap-2">
                      <IconBtn
                        onClick={() => {
                          setSelected(b);
                          setEditOpen(true);
                        }}
                        title="Edit"
                      >
                        <Pencil className="w-4 h-4" />
                      </IconBtn>
                      <IconBtn
                        onClick={() =>
                          setConfirm({ open: true, id: b._id, loading: false })
                        }
                        title="Delete"
                        danger
                      >
                        <Trash2 className="w-4 h-4" />
                      </IconBtn>
                    </div>
                  </Td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* Modals */}
      <EditBlogModal
        open={editOpen}
        onClose={() => {
          setEditOpen(false);
          setSelected(null);
        }}
        onSubmit={handleUpdate}
        initial={selected}
        loading={updateLoading}
      />

      <ConfirmDialog
        open={confirm.open}
        title="Delete blog?"
        description="This action cannot be undone."
        loading={confirm.loading}
        onCancel={() =>
          setConfirm({ open: false, id: null, loading: false })
        }
        onConfirm={() => handleDelete(confirm.id)}
      />
    </section>
  );
}

/* ---------- Helpers ---------- */
function Th({ children }) {
  return (
    <th className="text-left text-xs font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-300 px-3 py-2">
      {children}
    </th>
  );
}

function Td({ children }) {
  return (
    <td className="px-3 py-3 text-sm text-gray-800 dark:text-gray-200">
      {children}
    </td>
  );
}

function IconBtn({ children, onClick, title, danger }) {
  return (
    <button
      onClick={onClick}
      title={title}
      className={`p-2 rounded-lg border transition-colors ${
        danger
          ? "border-red-200 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950"
          : "border-gray-300 text-gray-700 dark:border-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800"
      }`}
    >
      {children}
    </button>
  );
}
