import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { FiEye, FiEyeOff } from "react-icons/fi";

export const Login = () => {
  const navigate = useNavigate();
  const { storeTokenInLS } = useAuth();
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await axios.post(
        "https://bloging-platform.onrender.com/api/auth/login",
        form
      );
      storeTokenInLS(res.data.token);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center blur-sm"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1519389950473-47ba0277781c')",
        }}
      ></div>

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/40"></div>

      {/* Main Content */}
      <div className="relative flex flex-1 px-6 py-10">
        <div className="w-full max-w-[1400px] mx-auto flex justify-between items-center flex-col md:flex-row">
          {/* Left Side - Text Section */}
          <div className="text-white text-left md:max-w-[55%] px-4 mb-10 md:mb-0">
            <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight">
              Welcome Back to{" "}
              <span className="text-blue-300">Blogify</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 leading-relaxed">
              Dive back into your writing world. Connect with your readers, 
              manage your blogs, and stay inspired. Your journey continues here.
            </p>
          </div>

          {/* Right Side - Login Card */}
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 md:p-10">
            <h2 className="text-3xl font-bold text-gray-800 mb-2 text-center">
              Welcome Back
            </h2>
            <p className="text-gray-500 text-center mb-6">
              Login to continue your journey
            </p>

            {error && (
              <div className="mb-4 text-sm text-red-600 bg-red-100 border border-red-300 p-2 rounded">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={form.username}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg bg-gray-50 text-black focus:ring-2 focus:ring-[#0C4A6E] focus:outline-none"
                required
              />
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  value={form.password}
                  onChange={handleChange}
                  className="w-full p-3 border rounded-lg bg-gray-50 text-black pr-10 focus:ring-2 focus:ring-[#0C4A6E] focus:outline-none"
                  required
                />
                <span
                  className="absolute right-4 top-3.5 cursor-pointer text-gray-500 hover:text-gray-700"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </span>
              </div>

              <button
                type="submit"
                className="w-full bg-[#0C4A6E] text-white p-3 rounded-lg font-semibold hover:bg-[#083247] transition-all duration-300 flex justify-center items-center"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4l3-3-3-3v4a12 12 0 00-12 12h4z"
                      ></path>
                    </svg>
                    Logging in...
                  </span>
                ) : (
                  "Login"
                )}
              </button>
            </form>

            <p className="text-center text-sm text-gray-600 mt-6">
              Don’t have an account?{" "}
              <Link
                to="/register"
                className="text-[#0C4A6E] font-medium hover:underline"
              >
                Sign Up
              </Link>
            </p>
            <p className="text-center text-sm mt-2">
              <Link
                to="/forgot-password"
                className="text-[#0C4A6E] hover:underline"
              >
                Forgot Password?
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative text-center text-xs text-gray-100 py-4 bg-black/60 mt-auto">
        Developed by{" "}
        <a
          href="mailto:kajalkanwar0208@gmail.com"
          className="text-blue-300 font-medium hover:underline"
        >
          Kajal Kanwar
        </a>{" "}
        and{" "}
        <a
          href="mailto:namanrajputnn001@gmail.com"
          className="text-blue-300 font-medium hover:underline"
        >
          Naman Chauhan
        </a>
      </footer>
    </div>
  );
};
