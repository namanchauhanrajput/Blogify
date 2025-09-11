// src/admin/components/AdminLayout.jsx
import { NavLink, Outlet } from "react-router-dom";
import { Users, FileText, ShieldCheck } from "lucide-react";

export default function AdminLayout() {
  return (
    <div className="h-screen grid grid-cols-12 bg-gray-50 dark:bg-gray-900 dark:text-gray-100">
      {/* Sidebar */}
      <aside
        className="col-span-12 md:col-span-3 lg:col-span-2 
        bg-white dark:bg-black border-r dark:border-gray-700 
        sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto"
      >
        {/* Header */}
        <div className="p-4 flex items-center gap-2 border-b dark:border-gray-700">
          <ShieldCheck className="w-5 h-5" />
          <h1 className="font-semibold">Admin Panel</h1>
        </div>

        {/* Navigation */}
        <nav className="p-2">
          <NavLink
            to="/admin/users"
            className={({ isActive }) =>
              `flex items-center gap-2 px-3 py-2 rounded-lg mb-1 transition-colors ${
                isActive
                  ? "bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900"
                  : "hover:bg-gray-100 dark:hover:bg-gray-700"
              }`
            }
          >
            <Users className="w-4 h-4" /> Users
          </NavLink>

          <NavLink
            to="/admin/blogs"
            className={({ isActive }) =>
              `flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                isActive
                  ? "bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900"
                  : "hover:bg-gray-100 dark:hover:bg-gray-700"
              }`
            }
          >
            <FileText className="w-4 h-4" /> Blogs
          </NavLink>
        </nav>
      </aside>

      {/* Main Content */}
      <main
        className="col-span-12 md:col-span-9 lg:col-span-10 
        p-4 bg-white dark:bg-black/80 border-l dark:border-gray-700 
        h-[calc(100vh-4rem)] overflow-y-auto mt-16"
      >
        <Outlet />
      </main>
    </div>
  );
}
