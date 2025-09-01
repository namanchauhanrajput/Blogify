import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export const ForgotPassword = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1 = Forgot, 2 = Reset
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Password visibility
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
    <div
      className="flex flex-col justify-center items-center min-h-screen bg-cover bg-center px-4"
      style={{
        backgroundImage: `url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e')`,
      }}
    >
      <div className="w-[90%] max-w-md bg-white dark:bg-gray-900 shadow-xl rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-6">
          {step === 1 ? "Forgot Password" : "Reset Password"}
        </h2>

        {message && (
          <p className="bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300 p-2 rounded mb-4 text-sm text-center">
            {message}
          </p>
        )}
        {error && (
          <p className="bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300 p-2 rounded mb-4 text-sm text-center">
            {error}
          </p>
        )}

        {step === 1 ? (
          <form onSubmit={handleSendOtp} className="space-y-5">
            <input
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none
              bg-gray-50 dark:bg-gray-800 dark:text-white dark:border-gray-700"
            />

            <input
              type="email"
              placeholder="Enter your registered email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none
              bg-gray-50 dark:bg-gray-800 dark:text-white dark:border-gray-700"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black hover:bg-gray-800 text-white font-semibold py-3 px-4 rounded-lg transition flex justify-center items-center"
            >
              {loading && (
                <svg
                  className="animate-spin h-5 w-5 text-white mr-2"
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
              )}
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword} className="space-y-5">
            <input
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none
              bg-gray-50 dark:bg-gray-800 dark:text-white dark:border-gray-700"
            />

            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none
              bg-gray-50 dark:bg-gray-800 dark:text-white dark:border-gray-700"
            />

            <div className="relative">
              <input
                type={showNewPassword ? "text" : "password"}
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className="w-full p-3 border rounded-lg pr-10 focus:ring-2 focus:ring-blue-400 outline-none
                bg-gray-50 dark:bg-gray-800 dark:text-white dark:border-gray-700"
              />
              <span
                className="absolute right-3 top-3.5 cursor-pointer text-gray-500 dark:text-gray-300"
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                {showNewPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full p-3 border rounded-lg pr-10 focus:ring-2 focus:ring-blue-400 outline-none
                bg-gray-50 dark:bg-gray-800 dark:text-white dark:border-gray-700"
              />
              <span
                className="absolute right-3 top-3.5 cursor-pointer text-gray-500 dark:text-gray-300"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black hover:bg-gray-800 text-white font-semibold py-3 px-4 rounded-lg transition flex justify-center items-center"
            >
              {loading && (
                <svg
                  className="animate-spin h-5 w-5 text-white mr-2"
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
              )}
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        )}
      </div>

      {/* Footer */}
      <p className="text-center text-sm text-gray-600 dark:text-gray-300 mt-4">
        Developed by{" "}
        <a href="mailto:kajalkanwar0208@gmail.com" className="text-blue-600 hover:underline">
          Kajal Kanwar
        </a>{" "}
        and{" "}
        <a href="mailto:namanrajputnn001@gmail.com" className="text-blue-600 hover:underline">
          Naman Chauhan
        </a>
      </p>
    </div>
  );
};
