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
  const [confirm, setConfirm] = useState({ open: false, id: null });

  // ✅ useCallback to avoid ESLint dependency warning
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

  // ✅ safe useEffect
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

  async function handleUpdate(payload) {
    try {
      const { data } = await api.put(endpoints.blogById(selected._id), payload);
      setBlogs((prev) => prev.map((b) => (b._id === data._id ? data : b)));
      setEditOpen(false);
      setSelected(null);
    } catch (e) {
      console.error(e);
      alert("Error updating blog");
    }
  }

  async function handleDelete(id) {
    try {
      await api.delete(endpoints.blogById(id));
      setBlogs((prev) => prev.filter((b) => b._id !== id));
      setConfirm({ open: false, id: null });
    } catch (e) {
      console.error(e);
      alert("Error deleting blog");
    }
  }

  return (
    <section className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-lg font-bold">Blogs</h1>
        <button
          onClick={fetchBlogs}
          className="p-2 rounded-lg border hover:bg-gray-50"
        >
          <RefreshCcw className="w-4 h-4" />
        </button>
      </div>

      <div className="flex items-center gap-2 mb-4">
        <Search className="w-4 h-4 text-gray-500" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search blogs..."
          className="border rounded-lg px-3 py-2 text-sm w-64"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b">
              <Th>Title</Th>
              <Th>Author</Th>
              <Th>Email</Th>
              <Th>Actions</Th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={4} className="text-center py-6">
                  Loading...
                </td>
              </tr>
            )}
            {!loading && filtered.length === 0 && (
              <tr>
                <td colSpan={4} className="text-center py-6">
                  No blogs found
                </td>
              </tr>
            )}
            {!loading &&
              filtered.map((b) => (
                <tr key={b._id} className="border-t">
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
                          setConfirm({ open: true, id: b._id })
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

      <EditBlogModal
        open={editOpen}
        onClose={() => {
          setEditOpen(false);
          setSelected(null);
        }}
        onSubmit={handleUpdate}
        initial={selected}
      />

      <ConfirmDialog
        open={confirm.open}
        title="Delete blog?"
        description="This action cannot be undone."
        onCancel={() => setConfirm({ open: false, id: null })}
        onConfirm={() => handleDelete(confirm.id)}
      />
    </section>
  );
}

function Th({ children }) {
  return (
    <th className="text-left text-xs font-semibold uppercase tracking-wide text-gray-600 px-3 py-2">
      {children}
    </th>
  );
}
function Td({ children }) {
  return <td className="px-3 py-3 text-sm">{children}</td>;
}
function IconBtn({ children, onClick, title, danger }) {
  return (
    <button
      onClick={onClick}
      title={title}
      className={`p-2 rounded-lg border ${
        danger
          ? "border-red-200 text-red-600 hover:bg-red-50"
          : "hover:bg-gray-50"
      }`}
    >
      {children}
    </button>
  );
}