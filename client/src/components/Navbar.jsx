import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { isLoggedIn, logoutUser, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate("/login");
  };

  return (
    <header className="bg-white border-b">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold">Blogify</Link>
        <nav className="flex items-center gap-3">
          <Link
            to="/"
            className="px-3 py-1.5 rounded-lg hover:bg-gray-100"
          >
            Home
          </Link>
          {isLoggedIn && (
            <Link
              to="/create"
              className="px-3 py-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
            >
              New Post
            </Link>
          )}
          {!isLoggedIn ? (
            <>
              <Link to="/login" className="px-3 py-1.5 rounded-lg hover:bg-gray-100">
                Login
              </Link>
              <Link
                to="/register"
                className="px-3 py-1.5 rounded-lg bg-black text-white hover:bg-gray-800"
              >
                Register
              </Link>
            </>
          ) : (
            <button
              onClick={handleLogout}
              className="px-3 py-1.5 rounded-lg bg-gray-200 hover:bg-gray-300"
            >
              Logout {user?.username ? `(${user.username})` : ""}
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}
