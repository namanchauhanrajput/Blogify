import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useAuth } from "../store/auth";
import { toast } from "react-toastify";
import { FaChevronDown } from "react-icons/fa";

export const Navbar = () => {
  const { isLoggedIn, logoutUser, user } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAdminDropdownOpen, setIsAdminDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => setIsMenuOpen(prev => !prev);
  const closeMenu = () => setIsMenuOpen(false);

  const handleLogout = () => {
    logoutUser();
    toast.success("Logout successful");
    closeMenu();
    setIsAdminDropdownOpen(false);
    navigate("/"); // redirect to home
  };

  return (
    <header className="bg-gradient-to-r from-purple-100 to-blue-100 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <span className="text-3xl font-bold text-purple-700 tracking-wide cursor-default select-none">
          Naman
        </span>

        <button
          onClick={toggleMenu}
          className="md:hidden text-purple-700 text-2xl focus:outline-none"
        >
          {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        {/* Desktop Nav */}
        <ul className="hidden md:flex items-center space-x-6 text-lg">
          <li><NavLink to="/" className="text-gray-700 hover:text-purple-700">Home</NavLink></li>
          <li><NavLink to="/about" className="text-gray-700 hover:text-purple-700">About</NavLink></li>
          <li><NavLink to="/contact" className="text-gray-700 hover:text-purple-700">Contact</NavLink></li>

          {user?.isAdmin && (
            <li className="relative group">
              <button
                onClick={() => setIsAdminDropdownOpen(prev => !prev)}
                className="flex items-center gap-1 text-gray-700 hover:text-purple-700"
              >
                Admin <FaChevronDown className="text-xs" />
              </button>
              {isAdminDropdownOpen && (
                <ul className="absolute top-8 left-0 bg-white border rounded shadow-md text-sm text-gray-800 z-10">
                  <li>
                    <NavLink to="/admin/users" className="block px-4 py-2 hover:bg-purple-100" onClick={() => setIsAdminDropdownOpen(false)}>Users</NavLink>
                  </li>
                  <li>
                    <NavLink to="/admin/contacts" className="block px-4 py-2 hover:bg-purple-100" onClick={() => setIsAdminDropdownOpen(false)}>Contacts</NavLink>
                  </li>
                </ul>
              )}
            </li>
          )}

          {isLoggedIn ? (
            <li>
              <button onClick={handleLogout} className="text-gray-700 hover:text-purple-700">Logout</button>
            </li>
          ) : (
            <>
              <li><NavLink to="/login" className="text-gray-700 hover:text-purple-700">Login</NavLink></li>
              <li><NavLink to="/register" className="text-gray-700 hover:text-purple-700">Register</NavLink></li>
            </>
          )}
        </ul>
      </div>

      {/* Mobile Nav */}
      <div className={`md:hidden bg-purple-50 transition-all duration-300 ease-in-out overflow-hidden
        ${isMenuOpen ? "max-h-96 opacity-100 scale-100 pointer-events-auto" : "max-h-0 opacity-0 scale-95 pointer-events-none"}`}>
        <ul className="px-6 space-y-4 py-4 text-base font-medium text-gray-700">
          <li><NavLink to="/" className="block" onClick={closeMenu}>Home</NavLink></li>
          <li><NavLink to="/about" className="block" onClick={closeMenu}>About</NavLink></li>
          <li><NavLink to="/contact" className="block" onClick={closeMenu}>Contact</NavLink></li>

          {user?.isAdmin && (
            <>
              <li><NavLink to="/admin/users" className="block" onClick={closeMenu}>Users</NavLink></li>
              <li><NavLink to="/admin/contacts" className="block" onClick={closeMenu}>Contacts</NavLink></li>
            </>
          )}

          {isLoggedIn ? (
            <li><button onClick={handleLogout} className="block text-left">Logout</button></li>
          ) : (
            <>
              <li><NavLink to="/login" className="block" onClick={closeMenu}>Login</NavLink></li>
              <li><NavLink to="/register" className="block" onClick={closeMenu}>Register</NavLink></li>
            </>
          )}
        </ul>
      </div>
    </header>
  );
};
