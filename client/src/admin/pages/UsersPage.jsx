import { useEffect, useMemo, useState, useCallback } from "react";
import { useAuth } from "../../context/AuthContext";
import { adminAxios, endpoints } from "../lib/adminApi";
import { Pencil, Trash2, RefreshCcw, Search } from "lucide-react";
import EditUserModal from "../components/EditUserModal";
import ConfirmDialog from "../components/ConfirmDialog";

export default function UsersPage() {
  const { token } = useAuth();
  const api = useMemo(() => adminAxios(token), [token]);

  const [loading, setLoading] = useState(false);
  const [modalLoading, setModalLoading] = useState(false); // loader state for Save button
  const [users, setUsers] = useState([]);
  const [query, setQuery] = useState("");
  const [editOpen, setEditOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [confirm, setConfirm] = useState({ open: false, id: null, loading: false });

  // Fetch users
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get(endpoints.users);
      setUsers(data || []);
    } catch (e) {
      console.error(e);
      alert("Error fetching users");
    } finally {
      setLoading(false);
    }
  }, [api]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const filtered = users.filter((u) => {
    const q = query.toLowerCase();
    return (
      u.name?.toLowerCase().includes(q) ||
      u.username?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q)
    );
  });

  // Update user
  async function handleUpdate(payload) {
    try {
      setModalLoading(true);
      const { data } = await api.put(endpoints.userById(selected._id), payload);
      setUsers((prev) => prev.map((u) => (u._id === data._id ? data : u)));
      setEditOpen(false);
      setSelected(null);
    } catch (e) {
      console.error(e);
      alert("Error updating user");
    } finally {
      setModalLoading(false);
    }
  }

  // Delete user with loader
  async function handleDelete(id) {
    try {
      setConfirm((prev) => ({ ...prev, loading: true }));
      await api.delete(endpoints.userById(id));
      setUsers((prev) => prev.filter((u) => u._id !== id));
      setConfirm({ open: false, id: null, loading: false });
    } catch (e) {
      console.error(e);
      alert("Error deleting user");
      setConfirm((prev) => ({ ...prev, loading: false }));
    }
  }

  return (
    <section className="p-4 dark:bg-black dark:text-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-lg font-bold">Users</h1>
        <button
          onClick={fetchUsers}
          className="p-2 rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-900 dark:border-gray-700"
        >
          <RefreshCcw className="w-4 h-4" />
        </button>
      </div>

      <div className="flex items-center gap-2 mb-4">
        <Search className="w-4 h-4 text-gray-500 dark:text-gray-400" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search users..."
          className="border rounded-lg px-3 py-2 text-sm w-64 bg-white dark:bg-gray-950 dark:border-gray-700 dark:text-gray-100"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b dark:border-gray-900">
              <Th>Name</Th>
              <Th>Username</Th>
              <Th>Email</Th>
              <Th>Phone</Th>
              <Th>Admin</Th>
              <Th>Actions</Th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={6} className="text-center py-6">
                  Loading...
                </td>
              </tr>
            )}

            {!loading && filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center py-6">
                  No users found
                </td>
              </tr>
            )}

            {!loading &&
              filtered.map((u) => (
                <tr key={u._id} className="border-t dark:border-gray-700">
                  <Td>{u.name || "-"}</Td>
                  <Td>{u.username || "-"}</Td>
                  <Td>{u.email}</Td>
                  <Td>{u.phone || "-"}</Td>
                  <Td>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        u.isAdmin
                          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300"
                          : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                      }`}
                    >
                      {u.isAdmin ? "Yes" : "No"}
                    </span>
                  </Td>
                  <Td>
                    <div className="flex items-center gap-2">
                      <IconBtn
                        onClick={() => {
                          setSelected(u);
                          setEditOpen(true);
                        }}
                        title="Edit"
                      >
                        <Pencil className="w-4 h-4" />
                      </IconBtn>
                      <IconBtn
                        onClick={() =>
                          setConfirm({ open: true, id: u._id, loading: false })
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

      <EditUserModal
        open={editOpen}
        onClose={() => {
          setEditOpen(false);
          setSelected(null);
        }}
        onSubmit={handleUpdate}
        initial={selected}
        loading={modalLoading} // Pass loader state
      />

      <ConfirmDialog
        open={confirm.open}
        title="Delete user?"
        description="This action cannot be undone."
        loading={confirm.loading}
        onCancel={() => setConfirm({ open: false, id: null, loading: false })}
        onConfirm={() => handleDelete(confirm.id)}
      />
    </section>
  );
}

function Th({ children }) {
  return (
    <th className="text-left text-xs font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-400 px-3 py-2">
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
          ? "border-red-200 text-red-600 hover:bg-red-50 dark:border-red-700 dark:text-red-400 dark:hover:bg-red-900"
          : "hover:bg-gray-50 dark:hover:bg-gray-800 dark:border-gray-700"
      }`}
    >
      {children}
    </button>
  );
}
