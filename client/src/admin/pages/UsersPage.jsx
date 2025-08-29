import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { adminAxios, endpoints } from "../lib/adminApi";
import { Pencil, Trash2, RefreshCcw, Search } from "lucide-react";
import EditUserModal from "../components/EditUserModal";
import ConfirmDialog from "../components/ConfirmDialog";

export default function UsersPage() {
  const { token } = useAuth();
  const api = useMemo(() => adminAxios(token), [token]);

  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [query, setQuery] = useState("");

  const [editOpen, setEditOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [confirm, setConfirm] = useState({ open: false, id: null });

  async function fetchUsers() {
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
  }

  useEffect(() => { fetchUsers(); }, []); // fetch on mount

  const filtered = users.filter(u => {
    const q = query.toLowerCase();
    return (
      u.name?.toLowerCase().includes(q) ||
      u.username?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q)
    );
  });

  async function handleUpdate(payload) {
    try {
      const { data } = await api.put(endpoints.userById(selected._id), payload);
      setUsers(prev => prev.map(u => u._id === data._id ? data : u));
      setEditOpen(false);
      setSelected(null);
    } catch (e) {
      console.error(e);
      alert("Error updating user");
    }
  }

  async function handleDelete(id) {
    try {
      await api.delete(endpoints.userById(id));
      setUsers(prev => prev.filter(u => u._id !== id));
      setConfirm({ open: false, id: null });
    } catch (e) {
      console.error(e);
      alert("Error deleting user");
    }
  }

  return (
    <section className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-lg font-bold">Users</h1>
        <button onClick={fetchUsers} className="p-2 rounded-lg border hover:bg-gray-50">
          <RefreshCcw className="w-4 h-4"/>
        </button>
      </div>

      <div className="flex items-center gap-2 mb-4">
        <Search className="w-4 h-4 text-gray-500"/>
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search users..."
          className="border rounded-lg px-3 py-2 text-sm w-64"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b">
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
              <tr><td colSpan={6} className="text-center py-6">Loading...</td></tr>
            )}
            {!loading && filtered.length === 0 && (
              <tr><td colSpan={6} className="text-center py-6">No users found</td></tr>
            )}
            {!loading && filtered.map(u => (
              <tr key={u._id} className="border-t">
                <Td>{u.name || "-"}</Td>
                <Td>{u.username || "-"}</Td>
                <Td>{u.email}</Td>
                <Td>{u.phone || "-"}</Td>
                <Td>
                  <span className={`px-2 py-1 rounded-full text-xs ${u.isAdmin ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-700"}`}>
                    {u.isAdmin ? "Yes" : "No"}
                  </span>
                </Td>
                <Td>
                  <div className="flex items-center gap-2">
                    <IconBtn onClick={()=>{ setSelected(u); setEditOpen(true); }} title="Edit"><Pencil className="w-4 h-4"/></IconBtn>
                    <IconBtn onClick={()=>setConfirm({ open: true, id: u._id })} title="Delete" danger>
                      <Trash2 className="w-4 h-4"/>
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
        onClose={()=>{ setEditOpen(false); setSelected(null); }}
        onSubmit={handleUpdate}
        initial={selected}
      />

      <ConfirmDialog
        open={confirm.open}
        title="Delete user?"
        description="This action cannot be undone."
        onCancel={()=>setConfirm({ open:false, id:null })}
        onConfirm={()=>handleDelete(confirm.id)}
      />
    </section>
  );
}

function Th({ children }) {
  return <th className="text-left text-xs font-semibold uppercase tracking-wide text-gray-600 px-3 py-2">{children}</th>;
}
function Td({ children }) {
  return <td className="px-3 py-3 text-sm">{children}</td>;
}
function IconBtn({ children, onClick, title, danger }) {
  return (
    <button
      onClick={onClick}
      title={title}
      className={`p-2 rounded-lg border ${danger ? "border-red-200 text-red-600 hover:bg-red-50" : "hover:bg-gray-50"}`}
    >
      {children}
    </button>
  );
}
