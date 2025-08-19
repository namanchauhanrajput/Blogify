import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

export const Register = () => {
  const navigate = useNavigate();
  const { storeTokenInLS } = useAuth();
  const [form, setForm] = useState({ username: "", name: "", email: "", phone: "", password: "", confirmPassword: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    try {
      const res = await axios.post("https://bloging-platform.onrender.com/api/auth/register", {
        username: form.username,
        name: form.name,
        email: form.email,
        phone: form.phone,
        password: form.password,
      });
      storeTokenInLS(res.data.token); // ✅ Correctly store token
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-96 mx-auto mt-20 p-6 border rounded">
      <h2 className="text-xl font-bold mb-4">Register</h2>
      {error && <p className="text-red-500">{error}</p>}
      <input type="text" name="username" placeholder="Username" value={form.username} onChange={handleChange} className="w-full p-2 mb-3 border rounded" required />
      <input type="text" name="name" placeholder="Full Name" value={form.name} onChange={handleChange} className="w-full p-2 mb-3 border rounded" required />
      <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} className="w-full p-2 mb-3 border rounded" required />
      <input type="text" name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} className="w-full p-2 mb-3 border rounded" required />
      <input type="password" name="password" placeholder="Password" value={form.password} onChange={handleChange} className="w-full p-2 mb-3 border rounded" required />
      <input type="password" name="confirmPassword" placeholder="Confirm Password" value={form.confirmPassword} onChange={handleChange} className="w-full p-2 mb-3 border rounded" required />
      <button type="submit" className="w-full bg-green-600 text-white p-2 rounded">Register</button>

      {/* Links for login password */}
      <div className="flex justify-center items-center text-sm mt-3">
        <p className="text-gray-700">
          Don't have an account?{" "}
          <Link to="/login" className="text-blue-600 hover:underline">
            Login
          </Link>
        </p>
      </div>

    </form>
  );
};
