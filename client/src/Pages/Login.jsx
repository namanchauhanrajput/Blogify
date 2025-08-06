import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../store/auth";
 import { toast } from 'react-toastify';

export const Login = () => {
  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  const { storeTokenInLS } = useAuth();

  const handleInput = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });

      const res_data = await response.json();
      

      if (response.ok) {
        toast.success("Login Successful");

        // ✅ Store token in localStorage via context
        storeTokenInLS(res_data.token);

        setUser({ email: "", password: "" })
        navigate("/home");
      } else {
        toast.error(res_data.exteraDetails ? res_data.exteraDetails : res_data.message);
        // const errorData = await response.json();
        // alert(errorData.message || "Login failed");
      }
    } catch (error) {
      console.error("login error:", error);
      // alert("Something went wrong. Please try again.");
    }
  };

  return (
    <section className="min-h-screen bg-gradient-to-r from-blue-100 to-purple-100 flex items-center justify-center px-4 py-6">
      <div className="flex flex-col md:flex-row items-center gap-10 max-w-6xl w-full">
        {/* Image Section */}
        <div className="flex-1 flex justify-center">
          <img
            src="/images/login.png"
            alt="Login"
            className="w-72 md:w-96 object-contain drop-shadow-lg"
          />
        </div>

        {/* Form Section */}
        <div className="flex-1 w-full max-w-md bg-white shadow-2xl rounded-2xl px-8 py-10">
          <h2 className="text-3xl font-extrabold text-center text-purple-700 mb-6">
            Welcome Back
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-gray-700 font-medium mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={user.email}
                onChange={handleInput}
                placeholder="Enter your email"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">Password</label>
              <input
                type="password"
                name="password"
                value={user.password}
                onChange={handleInput}
                placeholder="Enter your password"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg shadow-md transition duration-300"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};
