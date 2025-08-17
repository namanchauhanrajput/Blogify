import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

export const Login = () => {
  const navigate = useNavigate();
  const { storeTokenInLS } = useAuth();
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await axios.post("https://bloging-platform.onrender.com/api/auth/login", form);
      storeTokenInLS(res.data.token); // ✅ Correctly store token
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-96 mx-auto mt-20 p-6 border rounded">
      <h2 className="text-xl font-bold mb-4">Login</h2>
      {error && <p className="text-red-500">{error}</p>}
      <input type="text" name="username" placeholder="Username" value={form.username} onChange={handleChange} className="w-full p-2 mb-3 border rounded" required />
      <input type="password" name="password" placeholder="Password" value={form.password} onChange={handleChange} className="w-full p-2 mb-3 border rounded" required />
      <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">Login</button>
    </form>
  );
};
