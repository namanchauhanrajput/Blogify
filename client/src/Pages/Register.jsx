import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { motion } from "framer-motion";

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
    <div className="h-screen flex flex-col bg-gradient-to-br from-yellow-100 via-orange-50 to-pink-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Center Section */}
      <div className="flex-1 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full max-w-md bg-white/80 dark:bg-gray-800/90 backdrop-blur-lg shadow-2xl rounded-2xl p-8"
        >
          {/* Heading */}
          <h2 className="text-3xl font-extrabold text-center text-gray-900 dark:text-white mb-2">
            Create an account
          </h2>
          <p className="text-center text-gray-600 dark:text-gray-300 mb-6 text-sm">
            Sign up to start your journey 🚀
          </p>

          {/* Error */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 text-sm text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900 border border-red-300 dark:border-red-600 p-2 rounded"
            >
              {error}
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username */}
            <motion.input
              whileFocus={{ scale: 1.02 }}
              type="text"
              name="username"
              placeholder="Username"
              value={form.username}
              onChange={handleChange}
              className="w-full p-3 border rounded-xl bg-gray-50 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-pink-400 focus:outline-none"
              required
            />

            {/* Full Name */}
            <motion.input
              whileFocus={{ scale: 1.02 }}
              type="text"
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              className="w-full p-3 border rounded-xl bg-gray-50 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-pink-400 focus:outline-none"
              required
            />

            {/* Email */}
            <motion.input
              whileFocus={{ scale: 1.02 }}
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              className="w-full p-3 border rounded-xl bg-gray-50 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-pink-400 focus:outline-none"
              required
            />

            {/* Phone */}
            <motion.input
              whileFocus={{ scale: 1.02 }}
              type="text"
              name="phone"
              placeholder="Phone"
              value={form.phone}
              onChange={handleChange}
              className="w-full p-3 border rounded-xl bg-gray-50 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-pink-400 focus:outline-none"
              pattern="\d{10}"
              title="Phone number must be exactly 10 digits"
              required
            />

            {/* Password */}
            <div className="relative">
              <motion.input
                whileFocus={{ scale: 1.02 }}
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                className="w-full p-3 border rounded-xl bg-gray-50 dark:bg-gray-700 dark:text-white pr-10 focus:ring-2 focus:ring-pink-400 focus:outline-none"
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
              <motion.input
                whileFocus={{ scale: 1.02 }}
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm Password"
                value={form.confirmPassword}
                onChange={handleChange}
                className="w-full p-3 border rounded-xl bg-gray-50 dark:bg-gray-700 dark:text-white pr-10 focus:ring-2 focus:ring-pink-400 focus:outline-none"
                required
              />
              <span
                className="absolute right-4 top-3.5 cursor-pointer text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-100"
                onClick={() =>
                  setShowConfirmPassword(!showConfirmPassword)
                }
              >
                {showConfirmPassword ? (
                  <FaEyeSlash size={18} />
                ) : (
                  <FaEye size={18} />
                )}
              </span>
            </div>

            {/* Submit */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              type="submit"
              className="w-full bg-gradient-to-r from-pink-400 to-yellow-400 text-white p-3 rounded-xl font-semibold shadow-lg hover:opacity-90 transition-all duration-300 flex justify-center items-center"
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
                  Registering...
                </span>
              ) : (
                "Sign Up"
              )}
            </motion.button>
          </form>

          {/* Footer */}
          <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-6">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-pink-600 dark:text-pink-400 font-medium hover:underline"
            >
              Login
            </Link>
          </p>
        </motion.div>
      </div>

      {/* Developed By (Fixed Bottom) */}
      <div className="pb-4 text-center text-xs text-gray-600 dark:text-gray-400">
        Developed by{" "}
        <a
          href="mailto:kajalkanwar0208@gmail.com"
          className="text-pink-600 dark:text-pink-400 hover:underline"
        >
          Kajal Kanwar
        </a>{" "}
        and{" "}
        <a
          href="mailto:namanrajputnn001@gmail.com"
          className="text-pink-600 dark:text-pink-400 hover:underline"
        >
          Naman Chauhan
        </a>
      </div>
    </div>
  );
};
