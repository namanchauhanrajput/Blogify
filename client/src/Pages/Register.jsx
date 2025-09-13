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

    // ✅ Phone validation
    if (!/^\d{10}$/.test(form.phone)) {
      setError("Phone number must be exactly 10 digits");
      return;
    }

    // ✅ Username validation
    const usernameRegex = /^[a-z0-9._]+$/;
    if (!usernameRegex.test(form.username)) {
      setError(
        "Username must be lowercase letters, numbers, and can include only '.' or '_'. No spaces or capital letters allowed."
      );
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
    <div className="relative min-h-screen flex flex-col">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center blur-sm"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e')",
        }}
      ></div>

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/40"></div>

      {/* Main Content */}
      <div className="relative flex flex-1 px-6 py-10 overflow-hidden">
        <div className="w-full max-w-[1400px] mx-auto flex flex-col md:flex-row items-center justify-between gap-10">
          {/* Left Side - Text Section */}
          <div className="text-white text-left md:max-w-[55%] px-4">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight md:leading-tight lg:leading-tight">
              Share Your Stories with the{" "}
              <span className="text-blue-300">World</span>
            </h1>
            <p className="text-base md:text-xl lg:text-2xl text-gray-200 leading-relaxed">
              Join thousands of writers and creators on Blogify. Create
              beautiful blog posts, connect with readers, and build your
              audience with our powerful blogging platform.
            </p>
          </div>

          {/* Right Side - Registration Card */}
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 md:p-8 lg:p-10 mt-10 md:mt-0">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2 text-center">
              Create an account
            </h2>
            <p className="text-gray-500 mb-6 text-center text-sm md:text-base">
              Sign up to start your journey
            </p>

            {/* Error Message */}
            {error && (
              <div className="mb-4 text-sm text-red-600 bg-red-100 border border-red-300 p-2 rounded">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3 md:space-y-4">
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={form.username}
                onChange={handleChange}
                className="w-full p-2.5 md:p-3 border rounded-lg bg-gray-50 text-black focus:ring-2 focus:ring-[#0C4A6E] focus:outline-none text-sm md:text-base"
                required
              />
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={form.name}
                onChange={handleChange}
                className="w-full p-2.5 md:p-3 border rounded-lg bg-gray-50 text-black focus:ring-2 focus:ring-[#0C4A6E] focus:outline-none text-sm md:text-base"
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                className="w-full p-2.5 md:p-3 border rounded-lg bg-gray-50 text-black focus:ring-2 focus:ring-[#0C4A6E] focus:outline-none text-sm md:text-base"
                required
              />
              <input
                type="text"
                name="phone"
                placeholder="Phone"
                value={form.phone}
                onChange={handleChange}
                className="w-full p-2.5 md:p-3 border rounded-lg bg-gray-50 text-black focus:ring-2 focus:ring-[#0C4A6E] focus:outline-none text-sm md:text-base"
                pattern="\d{10}"
                title="Phone number must be exactly 10 digits"
                required
              />
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  value={form.password}
                  onChange={handleChange}
                  className="w-full p-2.5 md:p-3 pr-10 border rounded-lg bg-gray-50 text-black focus:ring-2 focus:ring-[#0C4A6E] focus:outline-none text-sm md:text-base"
                  required
                />
                <span
                  className="absolute right-4 top-3.5 cursor-pointer text-gray-500 hover:text-gray-700"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                </span>
              </div>

              {/* Updated Sign Up Button */}
              <button
                type="submit"
                className="w-full bg-black text-white p-2.5 md:p-3 rounded-lg font-semibold hover:bg-gray-900 transition-all duration-300 flex justify-center items-center text-sm md:text-base"
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

            <p className="text-center text-sm text-gray-600 mt-6">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-black font-medium hover:underline"
              >
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="relative text-center text-xs text-gray-100 py-4 bg-black/60 mt-auto">
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
