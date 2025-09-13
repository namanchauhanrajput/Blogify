// src/components/Navbar.jsx
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import {
  Home,
  PlusSquare, // ✅ Instagram-style Post icon
  User,
  LogIn,
  UserPlus,
  LogOut,
  Moon,
  Sun,
  Shield,
  Bell,
  Search as SearchIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion"; // ✅ Animation

export default function Navbar() {
  const { isLoggedIn, logoutUser, user } = useAuth();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogout = () => {
    logoutUser();
    navigate("/login");
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const baseLinkClasses =
    "flex items-center gap-2 px-4 py-2 rounded-lg transition-colors duration-200 text-sm";
  const activeClasses =
    "font-bold text-black dark:text-white bg-gray-100 dark:bg-black/70";
  const inactiveClasses =
    "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-black/90";

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* ✅ Top Navbar */}
      <nav
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
          isScrolled
            ? "backdrop-blur-md bg-white/60 dark:bg-black/70 shadow"
            : "bg-white dark:bg-black"
        } border-b border-gray-200 dark:border-black`}
      >
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
          {/* ✅ Logo */}
          <NavLink to="/" className="flex items-center">
            <img
              src="https://res.cloudinary.com/ddnpve00s/image/upload/v1757609283/r_e0zkrj.png"
              alt="Blogify Logo"
              className="h-14 w-auto object-contain dark:brightness-0 dark:invert"
            />
          </NavLink>

          {/* ✅ Desktop Links (Center Align) */}
          <div className="hidden lg:flex items-center gap-4 absolute left-1/2 transform -translate-x-1/2">
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
                to="/search-users"
                className={({ isActive }) =>
                  `${baseLinkClasses} ${
                    isActive ? activeClasses : inactiveClasses
                  }`
                }
              >
                <SearchIcon size={18} /> Search
              </NavLink>
            )}

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

            {isLoggedIn && user?.isAdmin && (
              <NavLink
                to="/admin"
                className={({ isActive }) =>
                  `${baseLinkClasses} ${
                    isActive ? activeClasses : inactiveClasses
                  }`
                }
              >
                <Shield size={18} /> Admin Panel
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
                onClick={() => setShowLogoutConfirm(true)}
                className={`${baseLinkClasses} text-gray-700 dark:text-gray-300 hover:bg-gray-100/70 dark:hover:bg-gray-950/40`}
              >
                <LogOut size={18} /> Logout
              </button>
            )}
          </div>

          {/* ✅ Right Controls */}
          <div className="flex items-center gap-2 ml-auto">
            {isLoggedIn && (
              <NavLink
                to="/create-blog"
                className="block lg:hidden p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-black/90"
              >
                <PlusSquare size={18} />
              </NavLink>
            )}

            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-black/90"
            >
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {isLoggedIn && (
              <NavLink
                to="/notifications"
                className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-black/90"
              >
                <Bell size={18} />
              </NavLink>
            )}
          </div>
        </div>
      </nav>

      {/* ✅ Mobile Bottom Navbar */}
      <nav className="lg:hidden fixed bottom-0 left-0 w-full bg-white dark:bg-black border-t border-gray-200 dark:border-black flex justify-around items-center h-16 z-50">
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
            to="/search-users"
            className={({ isActive }) =>
              `flex flex-col items-center text-xs transition-colors duration-200 ${
                isActive
                  ? "font-bold text-black dark:text-white"
                  : "text-gray-600 dark:text-gray-300"
              }`
            }
          >
            <SearchIcon size={18} /> Search
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

        {isLoggedIn && user?.isAdmin && (
          <NavLink
            to="/admin"
            className={({ isActive }) =>
              `flex flex-col items-center text-xs transition-colors duration-200 ${
                isActive
                  ? "font-bold text-black dark:text-white"
                  : "text-gray-600 dark:text-gray-300"
              }`
            }
          >
            <Shield size={18} /> Admin
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
            onClick={() => setShowLogoutConfirm(true)}
            className="flex flex-col items-center text-xs text-gray-600 dark:text-gray-300"
          >
            <LogOut size={18} /> Logout
          </button>
        )}
      </nav>

      {/* ✅ Logout Confirmation Modal */}
      <AnimatePresence>
        {showLogoutConfirm && (
          <motion.div
            key="overlay"
            className="fixed inset-0 flex items-center justify-center bg-black/30 z-[9999]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              key="modal"
              className="backdrop-blur-md bg-white/50 dark:bg-black/60 p-6 rounded-xl shadow-lg max-w-sm w-full text-center"
              initial={{ scale: 0.8, opacity: 0, y: -50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 50 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                Are you sure you want to logout?
              </h2>
              <div className="mt-4 flex justify-center gap-4">
                <button
                  onClick={handleLogout}
                  className="px-7 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Yes
                </button>
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className="px-4 py-2 bg-gray-300 dark:bg-gray-700 text-black dark:text-white rounded-lg hover:bg-gray-400 dark:hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
