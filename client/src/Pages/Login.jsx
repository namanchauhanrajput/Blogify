import { useState } from "react";
import { useNavigate, Link } from "react-router-dom"; 
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { FiEye, FiEyeOff } from "react-icons/fi"; // 👁 Feather icons

export const Login = () => {
  const navigate = useNavigate();
  const { storeTokenInLS } = useAuth();
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); 
  const [showPassword, setShowPassword] = useState(false); // ✅ toggle state

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true); 
    try {
      const res = await axios.post("https://bloging-platform.onrender.com/api/auth/login", form);
      storeTokenInLS(res.data.token);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false); 
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-96 mx-auto mt-20 p-6 border rounded shadow bg-white">
      <h2 className="text-xl font-bold mb-4 text-center">Login</h2>
      {error && <p className="text-red-500 mb-3 text-center">{error}</p>}

      {/* Username Input */}
      <input
        type="text"
        name="username"
        placeholder="Username"
        value={form.username}
        onChange={handleChange}
        className="w-full p-2 mb-3 border rounded focus:ring focus:ring-blue-300"
        required
      />

      {/* Password Input with Eye Toggle */}
      <div className="relative w-full mb-3">
        <input
          type={showPassword ? "text" : "password"}
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="w-full p-2 border rounded focus:ring focus:ring-blue-300"
          required
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
        >
          {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
        </button>
      </div>

      {/* Submit Button with Loader */}
      <button
        type="submit"
        className="w-full bg-blue-600 text-white p-2 rounded mb-4 flex justify-center items-center hover:bg-blue-700 disabled:opacity-70"
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

      {/* Links */}
      <div className="flex justify-between items-center text-sm mt-3">
        <p className="text-gray-700">
          Don't have an account?{" "}
          <Link to="/register" className="text-blue-600 hover:underline">
            Signup
          </Link>
        </p>
        <Link to="/forgot-password" className="text-blue-600 hover:underline">
          Forgot Password?
        </Link>
      </div>
    </form>
  );
};
