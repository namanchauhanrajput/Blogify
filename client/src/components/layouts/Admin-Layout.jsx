import { useState } from "react";
import { Navigate, NavLink, Outlet } from "react-router-dom";
import { FaUser } from "react-icons/fa";
import { MdPermContactCalendar, MdHome } from "react-icons/md";
import { Menu, X } from "lucide-react";
import { useAuth } from "../../store/auth";

export const AdminLayout = () => {
    const { user, isLoading } = useAuth();
    console.log("user admin", user);
    
    const [isSidebarOpen, setIsSidebarOpen] = useState(false); // ✅ moved here

    const toggleSidebar = () => setIsSidebarOpen(prev => !prev);

    // ✅ Now this conditional render comes after all hooks

    if(isLoading){
        return <h1>Loading ...</h1>;
    }
    
    if (!user.isAdmin) {
        return <Navigate to="/" />;
    }

    return (
        <div className="flex flex-col h-[81.5vh] overflow-hidden">
            {/* Mobile Header */}
            <div className="md:hidden flex items-center justify-between p-4 bg-white shadow shrink-0">
                <button
                    onClick={toggleSidebar}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-800 text-white rounded shadow"
                >
                    {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
                    {isSidebarOpen ? "Close" : "Menu"}
                </button>
                <h1 className="text-xl font-semibold text-gray-800">Admin Dashboard</h1>
            </div>

            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar */}
                <aside
                    className={`bg-blue-800 text-white w-64 p-5 my-3 space-y-6 z-40
                        transition-transform duration-300 ease-in-out
                        fixed top-0 md:top-auto md:relative h-full md:h-[78.5vh] rounded-tr-lg rounded-br-lg
                        md:block ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
                        md:translate-x-0`}
                >
                    <h2 className="text-2xl font-bold mb-4">Admin Panel</h2>
                    <nav>
                        <ul className="space-y-4">
                            <li>
                                <NavLink
                                    to="/admin/users"
                                    className={({ isActive }) =>
                                        `flex items-center gap-3 px-4 py-2 rounded-md transition ${isActive ? "bg-blue-700" : "hover:bg-blue-700"}`
                                    }
                                >
                                    <FaUser /> <span>Users</span>
                                </NavLink>
                            </li>
                            <li>
                                <NavLink
                                    to="/admin/contacts"
                                    className={({ isActive }) =>
                                        `flex items-center gap-3 px-4 py-2 rounded-md transition ${isActive ? "bg-blue-700" : "hover:bg-blue-700"}`
                                    }
                                >
                                    <MdPermContactCalendar /> <span>Contacts</span>
                                </NavLink>
                            </li>
                            <li>
                                <NavLink
                                    to="/"
                                    className="flex items-center gap-3 px-4 py-2 rounded-md hover:bg-blue-700 transition"
                                >
                                    <MdHome /> <span>Home</span>
                                </NavLink>
                            </li>
                        </ul>
                    </nav>
                </aside>

                {/* Mobile Overlay */}
                {isSidebarOpen && (
                    <div
                        className="fixed inset-0 bg-black bg-opacity-40 z-30 md:hidden"
                        onClick={toggleSidebar}
                    />
                )}

                {/* Content Area */}
                <div className="flex-1 md:ml-12 overflow-y-auto p-3 ">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};
