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
    <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-b from-gray-100 to-yellow-50 dark:from-gray-900 dark:to-gray-800">
      <form
        onSubmit={handleSubmit}
        className="w-[380px] bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-lg"
      >
        <h2 className="text-2xl font-bold mb-2 text-center text-gray-900 dark:text-white">
          Welcome Back
        </h2>
        <p className="text-gray-600 dark:text-gray-300 text-center mb-6">
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
          className="w-full p-3 mb-4 border rounded-full focus:ring-2 focus:ring-blue-400 outline-none 
          bg-gray-50 dark:bg-gray-800 dark:text-white dark:border-gray-700"
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
            className="w-full p-3 border rounded-full focus:ring-2 focus:ring-blue-400 outline-none
            bg-gray-50 dark:bg-gray-800 dark:text-white dark:border-gray-700"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
          </button>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-yellow-400 text-black font-semibold p-3 rounded-full hover:bg-yellow-500 transition disabled:opacity-70 dark:bg-yellow-500 dark:hover:bg-yellow-400 dark:text-black"
          disabled={loading}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg
                className="animate-spin h-5 w-5 text-black dark:text-white"
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
        <p className="text-center text-sm text-gray-700 dark:text-gray-300 mt-5">
          Don’t have an account?{" "}
          <Link to="/register" className="text-blue-600 dark:text-blue-400 hover:underline">
            Sign Up
          </Link>
        </p>
        <p className="text-center text-sm text-blue-600 dark:text-blue-400 hover:underline mt-2">
          <Link to="/forgot-password">Forgot Password?</Link>
        </p>
      </form>

      {/* Footer */}
      <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-4">
        Developed by{" "}
        <a href="mailto:kajalkanwar0208@gmail.com" className="text-blue-600 hover:underline">
          Kajal Kanwar
        </a>{" "}
        and{" "}
        <a href="mailto:namanrajputnn001@gmail.com" className="text-blue-600 hover:underline">
          Naman Chauhan
        </a>
      </p>
    </div>
  );
};
