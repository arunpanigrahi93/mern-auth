import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

const EmailVerify = () => {
  const inputRefs = useRef([]);
  const navigate = useNavigate();

  // Auto move to next box
  const handleInput = (e, index) => {
    if (e.target.value.length === 1 && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  // Backspace -> go to previous box
  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !e.target.value && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleClick = async () => {
    const otp = inputRefs.current.map((input) => input?.value || "").join("");

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/auth/verify-account`,
        { otp },
        { withCredentials: true }
      );

      if (response.data.success) {
        toast.success("✅ Account verified successfully!");
        navigate("/");
      } else {
        toast.error("❌ Invalid or expired OTP!");
      }
    } catch (err) {
      console.error(err.message);
      toast.error("⚠️ Something went wrong, please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-300 via-purple-300 to-pink-300 animate-gradient-x">
      {/* Glassmorphism Box */}
      <div className="relative w-full max-w-md p-8 bg-white/20 backdrop-blur-2xl border border-white/30 rounded-2xl shadow-2xl animate-fade-in mt-24">
        <h2 className="text-3xl font-semibold text-center text-gray-900 drop-shadow-sm mb-6">
          Verify OTP
        </h2>

        <div className="flex justify-between gap-2 mb-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              maxLength="1"
              inputMode="numeric"
              onInput={(e) => handleInput(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className="w-12 h-12 text-center text-lg font-bold border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/70 backdrop-blur-sm"
            />
          ))}
        </div>

        <button
          className="w-full py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
          onClick={handleClick}
        >
          Verify
        </button>
      </div>
    </div>
  );
};

export default EmailVerify;
