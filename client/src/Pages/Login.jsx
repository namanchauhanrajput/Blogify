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
    <div
      className="flex flex-col min-h-screen bg-cover bg-center"
      style={{
        backgroundImage: `url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e')`,
      }}
    >
      {/* Centered form */}
      <div className="flex flex-grow justify-center items-center px-4">
        <form
          onSubmit={handleSubmit}
          className="w-[90%] max-w-md bg-white p-8 rounded-2xl shadow-xl"
        >
          <h2 className="text-2xl font-bold mb-2 text-center text-gray-900">
            Welcome Back
          </h2>
          <p className="text-gray-600 text-center mb-6">
            Login to continue your journey
          </p>

          {error && (
            <p className="text-red-500 mb-3 text-center font-medium">{error}</p>
          )}

          {/* Username */}
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            className="w-full p-3 mb-4 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none bg-gray-50 text-black"
            required
          />

          {/* Password */}
          <div className="relative w-full mb-4">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none bg-gray-50 text-black pr-10"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
            </button>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-black text-white font-semibold p-3 rounded-lg hover:bg-gray-800 transition disabled:opacity-70"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
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

          {/* Links */}
          <p className="text-center text-sm text-gray-700 mt-5">
            Don’t have an account?{" "}
            <Link to="/register" className="text-[#0C4A6E] font-medium hover:underline">
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
        </form>
      </div>

      {/* Footer always at bottom */}
      <footer className="text-center text-sm text-gray-600 py-4  bg-black/40">
        Developed by{" "}
        <a
          href="mailto:kajalkanwar0208@gmail.com"
          className="text-[#0C4A6E] hover:underline"
        >
          Kajal Kanwar
        </a>{" "}
        and{" "}
        <a
          href="mailto:namanrajputnn001@gmail.com"
          className="text-[#0C4A6E] hover:underline"
        >
          Naman Chauhan
        </a>
      </footer>
    </div>
  );
};
