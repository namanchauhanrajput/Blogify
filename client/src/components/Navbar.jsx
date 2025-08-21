// src/components/Navbar.jsx
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  Home,
  PlusSquare,
  User,
  LogIn,
  UserPlus,
  LogOut,
} from "lucide-react";

export default function Navbar() {
  const { isLoggedIn, logoutUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate("/login");
  };

  const baseLinkClasses =
    "flex items-center gap-2 px-4 py-2 rounded-lg transition-colors duration-200 hover:bg-gray-100 text-sm";

  const activeClasses = "font-bold text-black";
  const inactiveClasses = "text-gray-700";

  return (
    <>
      {/* Desktop Sidebar (lg and above) */}
      <aside className="hidden lg:flex fixed top-0 left-0 h-screen w-60 bg-white border-r border-gray-200 flex-col">
        {/* Logo */}
        <div className="p-4 border-b border-gray-200">
          <NavLink to="/" className="text-xl font-bold text-black">
            Blogify
          </NavLink>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-2 p-4">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `${baseLinkClasses} ${
                isActive ? activeClasses : inactiveClasses
              }`
            }
          >
            <Home size={18} /> Home
          </NavLink>

          {isLoggedIn && (
            <NavLink
              to="/create-blog"
              className={({ isActive }) =>
                `${baseLinkClasses} ${
                  isActive ? activeClasses : inactiveClasses
                }`
              }
            >
              <PlusSquare size={18} /> New Post
            </NavLink>
          )}

          {isLoggedIn && (
            <NavLink
              to="/my-profile"
              className={({ isActive }) =>
                `${baseLinkClasses} ${
                  isActive ? activeClasses : inactiveClasses
                }`
              }
            >
              <User size={18} /> Profile
            </NavLink>
          )}

          {!isLoggedIn ? (
            <>
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  `${baseLinkClasses} ${
                    isActive ? activeClasses : inactiveClasses
                  }`
                }
              >
                <LogIn size={18} /> Login
              </NavLink>
              <NavLink
                to="/register"
                className={({ isActive }) =>
                  `${baseLinkClasses} ${
                    isActive ? activeClasses : inactiveClasses
                  }`
                }
              >
                <UserPlus size={18} /> Register
              </NavLink>
            </>
          ) : (
            <button
              onClick={handleLogout}
              className={`${baseLinkClasses} text-gray-700`}
            >
              <LogOut size={18} /> Logout
            </button>
          )}
        </nav>
      </aside>

      {/* Mobile & Tablet Bottom Navigation (md and below) */}
      <nav className="lg:hidden fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 flex justify-around items-center h-16 z-50">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `flex flex-col items-center text-xs transition-colors duration-200 hover:text-black ${
              isActive ? "font-bold text-black" : "text-gray-600"
            }`
          }
        >
          <Home size={18} /> Home
        </NavLink>

        {isLoggedIn && (
          <NavLink
            to="/create-blog"
            className={({ isActive }) =>
              `flex flex-col items-center text-xs transition-colors duration-200 hover:text-black ${
                isActive ? "font-bold text-black" : "text-gray-600"
              }`
            }
          >
            <PlusSquare size={18} /> Post
          </NavLink>
        )}

        {isLoggedIn && (
          <NavLink
            to="/my-profile"
            className={({ isActive }) =>
              `flex flex-col items-center text-xs transition-colors duration-200 hover:text-black ${
                isActive ? "font-bold text-black" : "text-gray-600"
              }`
            }
          >
            <User size={18} /> Profile
          </NavLink>
        )}

        {!isLoggedIn ? (
          <>
            <NavLink
              to="/login"
              className={({ isActive }) =>
                `flex flex-col items-center text-xs transition-colors duration-200 hover:text-black ${
                  isActive ? "font-bold text-black" : "text-gray-600"
                }`
              }
            >
              <LogIn size={18} /> Login
            </NavLink>
            <NavLink
              to="/register"
              className={({ isActive }) =>
                `flex flex-col items-center text-xs transition-colors duration-200 hover:text-black ${
                  isActive ? "font-bold text-black" : "text-gray-600"
                }`
              }
            >
              <UserPlus size={18} /> Register
            </NavLink>
          </>
        ) : (
          <button
            onClick={handleLogout}
            className="flex flex-col items-center text-xs text-gray-600 hover:text-black"
          >
            <LogOut size={18} /> Logout
          </button>
        )}
      </nav>
    </>
  );
}
