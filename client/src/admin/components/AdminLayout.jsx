import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { Users, FileText, ShieldCheck, Menu, X } from "lucide-react";

export default function AdminLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { to: "/admin/users", label: "Users", icon: <Users className="w-4 h-4" /> },
    { to: "/admin/blogs", label: "Blogs", icon: <FileText className="w-4 h-4" /> },
  ];

  return (
    <>
      <div className="flex h-screen bg-gray-50 dark:bg-black/80 dark:text-gray-100">
        {/* Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 z-40 w-64 transform bg-white dark:bg-black border-r dark:border-gray-800
        transition-transform duration-300 ease-in-out
        ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0 md:static md:inset-0`}
        >
          {/* Header */}
          <div className="flex items-center gap-2 px-4 py-20 border-b dark:border-gray-700">
            <ShieldCheck className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            <h1 className="text-lg font-semibold">Admin Panel</h1>
          </div>

          {/* Nav links */}
          <nav className="p-4 space-y-2">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-colors
                  ${
                    isActive
                      ? "bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-white font-semibold"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`
                }
              >
                {item.icon}
                {item.label}
              </NavLink>
            ))}
          </nav>
        </aside>

        {/* Overlay for mobile */}
        {mobileOpen && (
          <div
            className="fixed inset-0 z-30 bg-black/50 md:hidden"
            onClick={() => setMobileOpen(false)}
          ></div>
        )}

        {/* Main content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Topbar title (always) */}
          <header className="px-4 py-3 bg-white dark:bg-black border-b dark:border-gray-800">
            <h2 className="text-base font-semibold">Admin Panel</h2>
          </header>

          {/* Hamburger row (only mobile, niche dikhana hai) */}
          <div className="flex items-center justify-end px-4 my-4  bg-gray-50 dark:bg-black md:hidden">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-800"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Page Content */}
          <main className="flex-1 overflow-y-auto p-4 pb-12 bg-gray-50 dark:bg-black/90">
            <Outlet />
          </main>
        </div>
      </div>
    </>
  );
}
