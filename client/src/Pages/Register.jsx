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
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

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
    <div className="relative h-screen flex flex-col">
      {/* ✅ Blurred Background */}
      <div
        className="absolute inset-0 bg-cover bg-center blur-sm"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1519389950473-47ba0277781c')",
        }}
      ></div>

      {/* ✅ Dark Overlay */}
      <div className="absolute inset-0 bg-black/40"></div>

      {/* ✅ Main Content */}
      <div className="relative flex flex-1 items-center justify-center px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center w-full max-w-6xl">
          {/* Left Side - Text */}
          <div className="text-white text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
              Share Your Stories with the{" "}
              <span className="text-blue-300">World</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-200 leading-relaxed">
              Join thousands of writers and creators on Blogify. Create beautiful
              blog posts, connect with readers, and build your audience with our
              powerful blogging platform.
            </p>
          </div>

          {/* Right Side - Registration Card */}
          <div className="w-full bg-white rounded-3xl shadow-2xl p-8 md:p-10">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              Create an account
            </h2>
            <p className="text-gray-500 mb-6">Sign up to start your journey</p>

            {/* Error */}
            {error && (
              <div className="mb-4 text-sm text-red-600 bg-red-100 border border-red-300 p-2 rounded">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Username */}
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={form.username}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg bg-gray-50 text-black focus:ring-2 focus:ring-[#0C4A6E] focus:outline-none"
                required
              />

              {/* Full Name */}
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={form.name}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg bg-gray-50 text-black focus:ring-2 focus:ring-[#0C4A6E] focus:outline-none"
                required
              />

              {/* Email */}
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg bg-gray-50 text-black focus:ring-2 focus:ring-[#0C4A6E] focus:outline-none"
                required
              />

              {/* Phone */}
              <input
                type="text"
                name="phone"
                placeholder="Phone"
                value={form.phone}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg bg-gray-50 text-black focus:ring-2 focus:ring-[#0C4A6E] focus:outline-none"
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
                  className="w-full p-3 border rounded-lg bg-gray-50 text-black pr-10 focus:ring-2 focus:ring-[#0C4A6E] focus:outline-none"
                  required
                />
                <span
                  className="absolute right-4 top-3.5 cursor-pointer text-gray-500 hover:text-gray-700"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                </span>
              </div>

              {/* Submit */}
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
                    Registering...
                  </span>
                ) : (
                  "Sign Up"
                )}
              </button>
            </form>

            {/* Footer */}
            <p className="text-center text-sm text-gray-600 mt-6">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-[#0C4A6E] font-medium hover:underline"
              >
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Developed By Section */}
      <div className="relative text-center text-xs text-gray-100 py-4 bg-black/60">
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
      </div>
    </div>
  );
};
