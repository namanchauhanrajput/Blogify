import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import { Menu, X } from "lucide-react"; // Install lucide-react for icons: npm i lucide-react

export default function Navbar() {
  const { isLoggedIn, logoutUser, user } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logoutUser();
    navigate("/login");
  };

  const navLinkClasses =
    "px-3 py-2 rounded-lg transition-colors duration-200 text-sm md:text-base";
  const primaryBtnClasses =
    "bg-blue-600 text-white hover:bg-blue-700 " + navLinkClasses;
  const secondaryBtnClasses =
    "bg-black text-white hover:bg-gray-800 " + navLinkClasses;
  const outlineBtnClasses =
    "bg-gray-200 hover:bg-gray-300 " + navLinkClasses;

  return (
    <header className="bg-white border-b sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className="text-xl font-bold text-gray-900 hover:text-blue-600"
        >
          Blogify
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-3">
          <Link to="/" className={navLinkClasses + " hover:bg-gray-100"}>
            Home
          </Link>
          {isLoggedIn && (
            <Link to="/create" className={primaryBtnClasses}>
              New Post
            </Link>
          )}
          {!isLoggedIn ? (
            <>
              <Link to="/login" className={navLinkClasses + " hover:bg-gray-100"}>
                Login
              </Link>
              <Link to="/register" className={secondaryBtnClasses}>
                Register
              </Link>
            </>
          ) : (
            <button
              onClick={handleLogout}
              className={outlineBtnClasses}
            >
              Logout {user?.username ? `(${user.username})` : ""}
            </button>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 rounded-lg hover:bg-gray-100"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden border-t bg-white">
          <div className="flex flex-col gap-2 p-4">
            <Link
              to="/"
              className={navLinkClasses + " hover:bg-gray-100"}
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            {isLoggedIn && (
              <Link
                to="/create"
                className={primaryBtnClasses}
                onClick={() => setIsMenuOpen(false)}
              >
                New Post
              </Link>
            )}
            {!isLoggedIn ? (
              <>
                <Link
                  to="/login"
                  className={navLinkClasses + " hover:bg-gray-100"}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className={secondaryBtnClasses}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Register
                </Link>
              </>
            ) : (
              <button
                onClick={() => {
                  handleLogout();
                  setIsMenuOpen(false);
                }}
                className={outlineBtnClasses}
              >
                Logout {user?.username ? `(${user.username})` : ""}
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
