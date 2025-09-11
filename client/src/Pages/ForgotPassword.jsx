import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export const ForgotPassword = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // STEP 1 - SEND OTP
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const res = await fetch(
        "https://bloging-platform.onrender.com/api/auth/forget-password",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, username }),
        }
      );

      const data = await res.json();
      if (res.ok) {
        setMessage(data.message);
        setStep(2);
      } else {
        setError(data.message || "Error sending OTP");
      }
    } catch {
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  // STEP 2 - RESET PASSWORD
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const res = await fetch(
        "https://bloging-platform.onrender.com/api/auth/reset-password",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, otp, newPassword, confirmPassword }),
        }
      );

      const data = await res.json();
      if (res.ok) {
        setMessage(data.message);
        setStep(1);
        setEmail("");
        setUsername("");
        setOtp("");
        setNewPassword("");
        setConfirmPassword("");
        navigate("/login");
      } else {
        setError(data.message || "Error resetting password");
      }
    } catch {
      setError("Something went wrong.");
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
      <div className="relative flex flex-1 px-6 py-10">
        <div className="w-full max-w-[1400px] mx-auto flex justify-between items-center flex-col md:flex-row">
          {/* Left Side - Text Section */}
          <div className="text-white text-left md:max-w-[55%] px-4 mb-10 md:mb-0">
            <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight">
              Trouble Logging In?
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 leading-relaxed">
              Don't worry — we’ve got your back. Enter your details, and we'll help you reset your password and get back on track.
            </p>
          </div>

          {/* Right Side - Form Card */}
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 md:p-10">
            <h2 className="text-3xl font-bold text-gray-800 mb-2 text-center">
              {step === 1 ? "Forgot Password" : "Reset Password"}
            </h2>
            <p className="text-gray-500 text-center mb-6">
              {step === 1
                ? "Enter your details to receive an OTP"
                : "Enter OTP and your new password"}
            </p>

            {message && (
              <p className="bg-green-100 text-green-600 p-2 rounded mb-4 text-sm text-center">
                {message}
              </p>
            )}
            {error && (
              <p className="bg-red-100 text-red-600 p-2 rounded mb-4 text-sm text-center">
                {error}
              </p>
            )}

            {step === 1 ? (
              <form onSubmit={handleSendOtp} className="space-y-4">
                <input
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="w-full p-3 border rounded-lg bg-gray-50 text-black focus:ring-2 focus:ring-[#0C4A6E] focus:outline-none"
                />

                <input
                  type="email"
                  placeholder="Registered Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full p-3 border rounded-lg bg-gray-50 text-black focus:ring-2 focus:ring-[#0C4A6E] focus:outline-none"
                />

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-black text-white p-3 rounded-lg font-semibold hover:bg-gray-900 transition-all duration-300 flex justify-center items-center"
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
                      Sending OTP...
                    </span>
                  ) : (
                    "Send OTP"
                  )}
                </button>
              </form>
            ) : (
              <form onSubmit={handleResetPassword} className="space-y-4">
                <input
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="w-full p-3 border rounded-lg bg-gray-50 text-black focus:ring-2 focus:ring-[#0C4A6E] focus:outline-none"
                />

                <input
                  type="text"
                  placeholder="OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                  className="w-full p-3 border rounded-lg bg-gray-50 text-black focus:ring-2 focus:ring-[#0C4A6E] focus:outline-none"
                />

                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    placeholder="New Password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    className="w-full p-3 border rounded-lg pr-10 bg-gray-50 text-black focus:ring-2 focus:ring-[#0C4A6E] focus:outline-none"
                  />
                  <span
                    className="absolute right-4 top-3.5 cursor-pointer text-gray-500"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>

                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm New Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="w-full p-3 border rounded-lg pr-10 bg-gray-50 text-black focus:ring-2 focus:ring-[#0C4A6E] focus:outline-none"
                  />
                  <span
                    className="absolute right-4 top-3.5 cursor-pointer text-gray-500"
                    onClick={() =>
                      setShowConfirmPassword(!showConfirmPassword)
                    }
                  >
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-black text-white p-3 rounded-lg font-semibold hover:bg-gray-900 transition-all duration-300 flex justify-center items-center"
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
                      Resetting...
                    </span>
                  ) : (
                    "Reset Password"
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative text-center text-xs text-gray-100 py-4 bg-black/60 mt-auto">
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
      </footer>
    </div>
  );
};
