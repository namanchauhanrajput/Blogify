// src/components/Navbar.jsx
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  Home,
  PlusSquare,
  User,
  LogIn,
  UserPlus,
  LogOut,
} from "lucide-react"; // professional icons

export default function Navbar() {
  const { isLoggedIn, logoutUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate("/login");
  };

  const navLinkClasses =
    "flex items-center justify-start gap-2 px-4 py-2 rounded-lg transition-colors duration-200 hover:bg-gray-200 text-sm font-medium";
  const primaryBtnClasses =
    "bg-blue-600 text-white hover:bg-blue-700 " + navLinkClasses;
  const secondaryBtnClasses =
    "bg-black text-white hover:bg-gray-900 " + navLinkClasses;
  const outlineBtnClasses =
    "bg-gray-200 text-black hover:bg-gray-300 " + navLinkClasses;

  return (
    <>
      {/* Desktop Sidebar (lg and above) */}
      <aside className="hidden lg:flex fixed top-0 left-0 h-screen w-60 bg-white border-r border-gray-200 flex-col">
        {/* Logo */}
        <div className="p-4 border-b border-gray-200">
          <Link to="/" className="text-xl font-bold text-black">
            Blogify
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-2 p-4">
          <Link to="/" className={navLinkClasses}>
            <Home size={18} /> Home
          </Link>

          {isLoggedIn && (
            <Link to="/create-blog" className={primaryBtnClasses}>
              <PlusSquare size={18} /> New Post
            </Link>
          )}

          {isLoggedIn && (
            <Link to="/my-profile" className={secondaryBtnClasses}>
              <User size={18} /> Profile
            </Link>
          )}

          {!isLoggedIn ? (
            <>
              <Link to="/login" className={navLinkClasses}>
                <LogIn size={18} /> Login
              </Link>
              <Link to="/register" className={secondaryBtnClasses}>
                <UserPlus size={18} /> Register
              </Link>
            </>
          ) : (
            <button onClick={handleLogout} className={outlineBtnClasses}>
              <LogOut size={18} /> Logout{" "}
            </button>
          )}
        </nav>
      </aside>

      {/* Mobile & Tablet Bottom Navigation (md and below) */}
      <nav className="lg:hidden fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 flex justify-around items-center h-16 z-50">
        <Link to="/" className="flex flex-col items-center text-xs">
          <Home size={18} /> Home
        </Link>

        {isLoggedIn && (
          <Link to="/create-blog" className="flex flex-col items-center text-xs">
            <PlusSquare size={18} /> Post
          </Link>
        )}

        {isLoggedIn && (
          <Link to="/my-profile" className="flex flex-col items-center text-xs">
            <User size={18} /> Profile
          </Link>
        )}

        {!isLoggedIn ? (
          <>
            <Link to="/login" className="flex flex-col items-center text-xs">
              <LogIn size={18} /> Login
            </Link>
            <Link to="/register" className="flex flex-col items-center text-xs">
              <UserPlus size={18} /> Register
            </Link>
          </>
        ) : (
          <button
            onClick={handleLogout}
            className="flex flex-col items-center text-xs"
          >
            <LogOut size={18} /> Logout
          </button>
        )}
      </nav>
    </>
  );
}
