import axios from "axios";
import React, { useState } from "react";
import { toast } from "react-toastify";

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [show, setShow] = useState(false);
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleSubmit = async () => {
    try {
      await axios.post(
        "http://localhost:4000/api/auth/send-reset-otp",
        { email },
        { withCredentials: true }
      );
      toast.success("OTP sent successfully ✅");
      setShow(true);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send OTP ❌");
    }
  };

  const handleVerify = async () => {
    try {
      await axios.post(
        "http://localhost:4000/api/auth/reset-password",
        { email, otp, newPassword },
        { withCredentials: true }
      );
      toast.success("Password reset successful 🎉");
    } catch (err) {
      toast.error(err.response?.data?.message || "Password reset failed ❌");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-300 via-purple-300 to-pink-300 animate-gradient-x">
      {/* Glassmorphism Box */}
      <div className="relative w-full max-w-md p-8 bg-white/20 backdrop-blur-2xl border border-white/30 rounded-2xl shadow-2xl animate-fade-in mt-24">
        <h2 className="text-3xl font-semibold text-center text-gray-900 drop-shadow-sm mb-6">
          Reset Password
        </h2>

        {!show ? (
          <>
            {/* Step 1: Enter Email */}
            <div>
              <label className="block text-left text-gray-700 font-medium mb-1">
                Enter Your Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 bg-white/30 border border-white/40 rounded-lg placeholder-gray-500 text-gray-900 focus:ring-2 focus:ring-blue-300 focus:outline-none"
                placeholder="Enter your email"
                required
              />
            </div>

            <button
              type="button"
              onClick={handleSubmit}
              className="w-full py-2 mt-4 font-semibold text-white bg-gradient-to-r from-blue-400 to-purple-400 rounded-lg hover:opacity-90 transition duration-300 shadow-lg cursor-pointer"
            >
              Send OTP
            </button>
          </>
        ) : (
          <>
            {/* Step 2: Email + OTP + New Password */}
            <div>
              <label className="block text-left text-gray-700 font-medium mb-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                readOnly
                className="w-full px-4 py-2 bg-gray-200 border border-white/40 rounded-lg text-gray-700 cursor-not-allowed"
              />
            </div>

            <div className="mt-3">
              <label className="block text-left text-gray-700 font-medium mb-1">
                New Password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-2 bg-white/30 border border-white/40 rounded-lg placeholder-gray-500 text-gray-900 focus:ring-2 focus:ring-blue-300 focus:outline-none"
                placeholder="Enter your new password"
                required
              />
            </div>

            <div className="mt-3">
              <label className="block text-left text-gray-700 font-medium mb-1">
                OTP
              </label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full px-4 py-2 bg-white/30 border border-white/40 rounded-lg placeholder-gray-500 text-gray-900 focus:ring-2 focus:ring-blue-300 focus:outline-none"
                placeholder="Enter OTP"
                required
              />
            </div>

            <button
              type="button"
              onClick={handleVerify}
              className="w-full py-2 mt-4 font-semibold text-white bg-gradient-to-r from-blue-400 to-purple-400 rounded-lg hover:opacity-90 transition duration-300 shadow-lg cursor-pointer"
            >
              Reset Password
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
