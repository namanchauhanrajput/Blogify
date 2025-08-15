import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { isLoggedIn, logoutUser, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate("/login");
  };

  const navLinkClasses =
    "flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-colors duration-200 hover:bg-gray-200 text-sm font-medium";
  const primaryBtnClasses =
    "bg-blue-600 text-white hover:bg-blue-700 " + navLinkClasses;
  const secondaryBtnClasses =
    "bg-black text-white hover:bg-gray-900 " + navLinkClasses;
  const outlineBtnClasses =
    "bg-gray-200 text-black hover:bg-gray-300 " + navLinkClasses;

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex fixed top-0 left-0 h-screen w-60 bg-white border-r border-gray-200 flex-col">
        {/* Logo */}
        <div className="p-4 border-b border-gray-200">
          <Link to="/" className="text-xl font-bold text-black">
            Blogify
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-2 p-4">
          <Link to="/" className={navLinkClasses}>
            Home
          </Link>
          {isLoggedIn && (
            <Link to="/create-blog" className={primaryBtnClasses}>
              New Post
            </Link>
          )}
          {!isLoggedIn ? (
            <>
              <Link to="/login" className={navLinkClasses}>
                Login
              </Link>
              <Link to="/register" className={secondaryBtnClasses}>
                Register
              </Link>
            </>
          ) : (
            <button onClick={handleLogout} className={outlineBtnClasses}>
              Logout {user?.username ? `(${user.username})` : ""}
            </button>
          )}
        </nav>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 flex justify-around items-center h-14 z-50">
        <Link to="/" className="flex flex-col items-center text-xs">
          Home
        </Link>

        {isLoggedIn && (
          <Link to="/create-blog" className="flex flex-col items-center text-xs">
            New Post
          </Link>
        )}

        {!isLoggedIn ? (
          <>
            <Link to="/login" className="flex flex-col items-center text-xs">
              Login
            </Link>
            <Link to="/register" className="flex flex-col items-center text-xs">
              Register
            </Link>
          </>
        ) : (
          <button
            onClick={handleLogout}
            className="flex flex-col items-center text-xs"
          >
            Logout
          </button>
        )}
      </nav>
    </>
  );
}
