// src/admin/components/AdminLayout.jsx
import { NavLink, Outlet } from "react-router-dom";
import { Users, FileText, ShieldCheck } from "lucide-react";

export default function AdminLayout() {
  return (
    <div className="min-h-screen grid grid-cols-12 gap-4 bg-gray-50 py-6">
      <aside className="col-span-12 md:col-span-3 lg:col-span-2 bg-white border rounded-xl shadow-sm">
        <div className="p-4 flex items-center gap-2 border-b">
          <ShieldCheck className="w-5 h-5" />
          <h1 className="font-semibold">Admin Panel</h1>
        </div>
        <nav className="p-2">
          <NavLink
            to="/admin/users"
            className={({ isActive }) =>
              `flex items-center gap-2 px-3 py-2 rounded-lg mb-1 ${
                isActive ? "bg-gray-900 text-white" : "hover:bg-gray-100"
              }`
            }
          >
            <Users className="w-4 h-4" /> Users
          </NavLink>
          <NavLink
            to="/admin/blogs"
            className={({ isActive }) =>
              `flex items-center gap-2 px-3 py-2 rounded-lg ${
                isActive ? "bg-gray-900 text-white" : "hover:bg-gray-100"
              }`
            }
          >
            <FileText className="w-4 h-4" /> Blogs
          </NavLink>
        </nav>
      </aside>

      <main className="col-span-12 md:col-span-9 lg:col-span-10 p-4">
        <Outlet />
      </main>
    </div>
  );
}