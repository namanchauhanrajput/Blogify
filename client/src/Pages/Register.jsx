import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export const Register = () => {
  const navigate = useNavigate();
  const { storeTokenInLS } = useAuth();

  const [form, setForm] = useState({
    username: "",
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!/^\d{10}$/.test(form.phone)) {
      setError("Phone number must be exactly 10 digits");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(
        "https://bloging-platform.onrender.com/api/auth/register",
        {
          username: form.username,
          name: form.name,
          email: form.email,
          phone: form.phone,
          password: form.password,
        }
      );
      storeTokenInLS(res.data.token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-100 via-white to-yellow-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
      <div className="w-full max-w-sm bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-8">
        {/* Heading */}
        <h2 className="text-2xl font-semibold text-center text-gray-800 dark:text-gray-100 mb-2">
          Create an account
        </h2>
        <p className="text-center text-gray-500 dark:text-gray-400 mb-6 text-sm">
          Sign up to start your journey
        </p>

        {/* Error */}
        {error && (
          <div className="mb-4 text-sm text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900 border border-red-300 dark:border-red-600 p-2 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Username */}
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            className="w-full p-3 border rounded-full bg-gray-50 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-yellow-400 focus:outline-none"
            required
          />

          {/* Full Name */}
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            className="w-full p-3 border rounded-full bg-gray-50 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-yellow-400 focus:outline-none"
            required
          />

          {/* Email */}
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="w-full p-3 border rounded-full bg-gray-50 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-yellow-400 focus:outline-none"
            required
          />

          {/* Phone */}
          <input
            type="text"
            name="phone"
            placeholder="Phone (10 digits)"
            value={form.phone}
            onChange={handleChange}
            className="w-full p-3 border rounded-full bg-gray-50 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-yellow-400 focus:outline-none"
            pattern="\d{10}"
            title="Phone number must be exactly 10 digits"
            required
          />

          {/* Password */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className="w-full p-3 border rounded-full bg-gray-50 dark:bg-gray-700 dark:text-white pr-10 focus:ring-2 focus:ring-yellow-400 focus:outline-none"
              required
            />
            <span
              className="absolute right-4 top-3.5 cursor-pointer text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-100"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
            </span>
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm Password"
              value={form.confirmPassword}
              onChange={handleChange}
              className="w-full p-3 border rounded-full bg-gray-50 dark:bg-gray-700 dark:text-white pr-10 focus:ring-2 focus:ring-yellow-400 focus:outline-none"
              required
            />
            <span
              className="absolute right-4 top-3.5 cursor-pointer text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-100"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? (
                <FaEyeSlash size={18} />
              ) : (
                <FaEye size={18} />
              )}
            </span>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-yellow-400 text-gray-800 dark:text-gray-900 p-3 rounded-full font-semibold hover:bg-yellow-500 transition-all duration-300 flex justify-center items-center"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg
                  className="animate-spin h-5 w-5 text-gray-800 dark:text-gray-900"
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
                Registering...
              </span>
            ) : (
              "Sign Up"
            )}
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-6">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-yellow-600 dark:text-yellow-400 font-medium hover:underline"
          >
            Login
          </Link>
        </p>

        {/* Developed By */}
        <p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-6">
          Developed by{" "}
          <a
            href="mailto:kajalkanwar0208@gmail.com"
            className="text-yellow-600 dark:text-yellow-400 hover:underline"
          >
            Kajal Kanwar
          </a>{" "}
          and{" "}
          <a
            href="mailto:namanrajputnn001@gmail.com"
            className="text-yellow-600 dark:text-yellow-400 hover:underline"
          >
            Naman Chauhan
          </a>
        </p>
      </div>
    </div>
  );
};
