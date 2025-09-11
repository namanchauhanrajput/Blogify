// src/components/Navbar.jsx
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { Home, PlusSquare, User, LogIn, UserPlus, LogOut, Moon, Sun, Shield, Bell, Search as SearchIcon } from "lucide-react";

import { useEffect, useState } from "react";

export default function Navbar() {
  const { isLoggedIn, logoutUser, user } = useAuth();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);

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
    "font-bold text-black dark:text-white bg-gray-100 dark:bg-gray-800";
  const inactiveClasses =
    "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800";

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* ✅ Top Navbar (Desktop) */}
      <nav
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${isScrolled
          ? "backdrop-blur-md bg-white/70 dark:bg-gray-900/70 shadow "
          : "bg-white dark:bg-gray-900"
          } border-b border-gray-200 dark:border-gray-800`}
      >
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
          {/* Logo */}
          <NavLink
            to="/"
            className="text-xl font-bold text-black dark:text-white"
          >
            Blogify
          </NavLink>

          {/* Links */}
          <div className="hidden md:flex items-center gap-4">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `${baseLinkClasses} ${isActive ? activeClasses : inactiveClasses
                }`
              }
            >
              <Home size={18} /> Home
            </NavLink>

            {isLoggedIn && (
              <NavLink
                to="/create-blog"
                className={({ isActive }) =>
                  `${baseLinkClasses} ${isActive ? activeClasses : inactiveClasses
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
                  `${baseLinkClasses} ${isActive ? activeClasses : inactiveClasses
                  }`
                }
              >
                <User size={18} /> Profile
              </NavLink>
            )}

            {/* ✅ Admin */}
            {isLoggedIn && user?.isAdmin && (
              <NavLink
                to="/admin"
                className={({ isActive }) =>
                  `${baseLinkClasses} ${isActive ? activeClasses : inactiveClasses
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
                    `${baseLinkClasses} ${isActive ? activeClasses : inactiveClasses
                    }`
                  }
                >
                  <LogIn size={18} /> Login
                </NavLink>
                <NavLink
                  to="/register"
                  className={({ isActive }) =>
                    `${baseLinkClasses} ${isActive ? activeClasses : inactiveClasses
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
          </div>

          {isLoggedIn && (
            <NavLink
              to="/search-users"
              className={({ isActive }) =>
                `${baseLinkClasses} ${isActive ? activeClasses : inactiveClasses
                }`
              }
            >
              <SearchIcon size={18} /> Search
            </NavLink>
          )}


          {/* Theme + Notifications (Desktop right side) */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            {isLoggedIn && (
              <NavLink
                to="/notifications"
                className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                <Bell size={18} />
              </NavLink>
            )}
          </div>
        </div>
      </nav>

      {/* ✅ Mobile Bottom Navbar */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 flex justify-around items-center h-16 z-50">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `flex flex-col items-center text-xs transition-colors duration-200 ${isActive
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
              `flex flex-col items-center text-xs transition-colors duration-200 ${isActive
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
              `flex flex-col items-center text-xs transition-colors duration-200 ${isActive
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
              `flex flex-col items-center text-xs transition-colors duration-200 ${isActive
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
                `flex flex-col items-center text-xs transition-colors duration-200 ${isActive
                  ? "font-bold text-black dark:text-white"
                  : "text-gray-600 dark:text-gray-300"
                }`
              }
            >
              <LogIn size={18} /> Login
            </NavLink>

            {isLoggedIn && (
              <NavLink
                to="/search-users"
                className={({ isActive }) =>
                  `flex flex-col items-center text-xs transition-colors duration-200 ${isActive
                    ? "font-bold text-black dark:text-white"
                    : "text-gray-600 dark:text-gray-300"
                  }`
                }
              >
                <SearchIcon size={18} /> Search
              </NavLink>
            )}

            <NavLink
              to="/register"
              className={({ isActive }) =>
                `flex flex-col items-center text-xs transition-colors duration-200 ${isActive
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
