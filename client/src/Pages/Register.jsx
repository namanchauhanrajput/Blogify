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
    <form
      onSubmit={handleSubmit}
      className="w-96 mx-auto mt-20 p-6 border rounded shadow"
    >
      <h2 className="text-xl font-bold mb-4">Registering</h2>
      {error && <p className="text-red-500 mb-3">{error}</p>}

      <input
        type="text"
        name="username"
        placeholder="Username"
        value={form.username}
        onChange={handleChange}
        className="w-full p-2 mb-3 border rounded"
        required
      />
      <input
        type="text"
        name="name"
        placeholder="Full Name"
        value={form.name}
        onChange={handleChange}
        className="w-full p-2 mb-3 border rounded"
        required
      />
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={form.email}
        onChange={handleChange}
        className="w-full p-2 mb-3 border rounded"
        required
      />
      
      {/* ✅ Phone field with validation (10 digits only) */}
      <input
        type="text"
        name="phone"
        placeholder="Phone (10 digits only)"
        value={form.phone}
        onChange={handleChange}
        className="w-full p-2 mb-3 border rounded"
        pattern="\d{10}"
        title="Phone number must be exactly 10 digits"
        required
      />

      {/* ✅ Password field with eye toggle */}
      <div className="relative mb-3">
        <input
          type={showPassword ? "text" : "password"}
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="w-full p-2 border rounded pr-10"
          required
        />
        <span
          className="absolute right-3 top-3 cursor-pointer text-gray-600"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
        </span>
      </div>

      {/* ✅ Confirm Password field with eye toggle */}
      <div className="relative mb-3">
        <input
          type={showConfirmPassword ? "text" : "password"}
          name="confirmPassword"
          placeholder="Confirm Password"
          value={form.confirmPassword}
          onChange={handleChange}
          className="w-full p-2 border rounded pr-10"
          required
        />
        <span
          className="absolute right-3 top-3 cursor-pointer text-gray-600"
          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
        >
          {showConfirmPassword ? (
            <FaEyeSlash size={18} />
          ) : (
            <FaEye size={18} />
          )}
        </span>
      </div>

      {/* ✅ Button with loader */}
      <button
        type="submit"
        className="w-full bg-green-600 text-white p-2 rounded flex justify-center items-center"
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
          "Register"
        )}
      </button>

      {/* Links for login */}
      <div className="flex justify-center items-center text-sm mt-3">
        <p className="text-gray-700">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </form>
  );
};
