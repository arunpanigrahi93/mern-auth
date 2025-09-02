import React, { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addUser } from "../redux/userSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
const Login = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("arunpanigrahi95@gmail.com");
  const [password, setPassword] = useState("Arun@1234");
  const [isSignUp, setIsSignUp] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Sign In API
  const signinUser = async () => {
    try {
      // login (sets cookie/token in backend)
      await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/auth/login`,
        { email, password },
        { withCredentials: true }
      );

      // now fetch full profile
      const userRes = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/user/profile`,
        { withCredentials: true }
      );

      dispatch(addUser(userRes.data)); // dispatch full user
      toast.success("Login successful 🎉");
      navigate("/"); // only go home after user is in store
    } catch (err) {
      toast.error("Login failed ❌");
      console.error("Login failed:", err.message);
    }
  };
  // sign up user
  const signupUser = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/auth/register`,
        { name, email, password },
        { withCredentials: true }
      );
      toast.success("Registration successful 🎉 Please login now.");
      setIsSignUp(false); // switch to login form
      navigate("/login"); // redirect to login
    } catch (err) {
      toast.error("Signup failed ❌");
      console.error("Signup failed:", err.message);
    }
  };

  const handleSwitch = () => {
    setIsSignUp(!isSignUp);
    setName("");
    setEmail("");
    setPassword("");
  };

  // 🔹 Decide based on mode
  const handleSubmit = async (e) => {
    e.preventDefault(); // prevent page reload
    if (isSignUp) {
      await signupUser();
    } else {
      await signinUser();
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-300 via-purple-300 to-pink-300 animate-gradient-x">
      {/* Glassmorphism Box */}
      <div className="relative w-full max-w-md p-8 bg-white/20 backdrop-blur-2xl border border-white/30 rounded-2xl shadow-2xl animate-fade-in mt-24">
        <h2 className="text-3xl font-semibold text-center text-gray-900 drop-shadow-sm mb-6">
          {isSignUp ? "Create Account" : "Login"}
        </h2>

        {/* 🔹 Form */}
        <form className="space-y-5" onSubmit={handleSubmit}>
          {isSignUp && (
            <div>
              <label className="block text-left text-gray-700 font-medium mb-1">
                User Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 bg-white/30 border border-white/40 rounded-lg placeholder-gray-500 text-gray-900 focus:ring-2 focus:ring-blue-300 focus:outline-none"
                placeholder="Enter your name"
                required
              />
            </div>
          )}

          <div>
            <label className="block text-left text-gray-700 font-medium mb-1">
              Email
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

          <div>
            <label className="block text-left text-gray-700 font-medium mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 bg-white/30 border border-white/40 rounded-lg placeholder-gray-500 text-gray-900 focus:ring-2 focus:ring-blue-300 focus:outline-none"
              placeholder="Enter your password"
              required
            />
          </div>

          {!isSignUp && (
            <div className="text-right">
              <button
                type="button"
                className="text-sm text-blue-600 hover:underline cursor-pointer"
                onClick={() => navigate("/reset-password")}
              >
                Forgot Password?
              </button>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-2 mt-2 font-semibold text-white bg-gradient-to-r from-blue-400 to-purple-400 rounded-lg hover:opacity-90 transition duration-300 shadow-lg cursor-pointer"
          >
            {isSignUp ? "Sign Up" : "Sign In"}
          </button>
        </form>

        {/* Toggle */}
        <p className="mt-6 text-center text-gray-800">
          {isSignUp ? "Already have an account?" : "Don’t have an account?"}{" "}
          <span
            className="text-blue-600 font-semibold cursor-pointer hover:underline"
            onClick={handleSwitch}
          >
            {isSignUp ? "Sign In" : "Register"}
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
