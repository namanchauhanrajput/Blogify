import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import {
  Home,
  PlusSquare,
  User,
  LogIn,
  UserPlus,
  LogOut,
  Moon,
  Sun,
} from "lucide-react";

export default function Navbar() {
  const { isLoggedIn, logoutUser } = useAuth();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate("/login");
  };

  const toggleTheme = () => {
    if (theme === "dark") setTheme("light");
    else setTheme("dark");
  };

  const baseLinkClasses =
    "flex items-center gap-2 px-4 py-2 rounded-lg transition-colors duration-200 text-sm";
  const activeClasses = "font-bold text-black dark:text-white bg-gray-100 dark:bg-gray-800";
  const inactiveClasses = "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800";

  return (
    <>
      {/* Desktop Sidebar (lg and above) */}
      <aside className="hidden lg:flex fixed top-0 left-0 h-screen w-60 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex-col">
        {/* Logo + Theme Toggle */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center">
          <NavLink to="/" className="text-xl font-bold text-black dark:text-white">
            Blogify
          </NavLink>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>
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
              className={`${baseLinkClasses} text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800`}
            >
              <LogOut size={18} /> Logout
            </button>
          )}
        </nav>
      </aside>

      {/* Mobile & Tablet Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 w-full bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 flex justify-around items-center h-16 z-50">
        <button onClick={toggleTheme}>
          {theme === "dark" ? <Sun size={20} className="text-yellow-400" /> : <Moon size={20} className="text-gray-600" />}
        </button>

        <NavLink
          to="/"
          className={({ isActive }) =>
            `flex flex-col items-center text-xs transition-colors duration-200 ${
              isActive
                ? "font-bold text-black dark:text-white"
                : "text-gray-600 dark:text-gray-300"
            }`
          }
        >
          <Home size={18} /> Home
        </NavLink>

        {isLoggedIn && (
          <NavLink
            to="/create-blog"
            className={({ isActive }) =>
              `flex flex-col items-center text-xs transition-colors duration-200 ${
                isActive
                  ? "font-bold text-black dark:text-white"
                  : "text-gray-600 dark:text-gray-300"
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
              `flex flex-col items-center text-xs transition-colors duration-200 ${
                isActive
                  ? "font-bold text-black dark:text-white"
                  : "text-gray-600 dark:text-gray-300"
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
                `flex flex-col items-center text-xs transition-colors duration-200 ${
                  isActive
                    ? "font-bold text-black dark:text-white"
                    : "text-gray-600 dark:text-gray-300"
                }`
              }
            >
              <LogIn size={18} /> Login
            </NavLink>
            <NavLink
              to="/register"
              className={({ isActive }) =>
                `flex flex-col items-center text-xs transition-colors duration-200 ${
                  isActive
                    ? "font-bold text-black dark:text-white"
                    : "text-gray-600 dark:text-gray-300"
                }`
              }
            >
              <UserPlus size={18} /> Register
            </NavLink>
          </>
        ) : (
          <button
            onClick={handleLogout}
            className="flex flex-col items-center text-xs text-gray-600 dark:text-gray-300"
          >
            <LogOut size={18} /> Logout
          </button>
        )}
      </nav>
    </>
  );
}
