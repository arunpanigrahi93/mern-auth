import React, { useState } from "react";

const Login = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-300 via-purple-300 to-pink-300 animate-gradient-x">
      {/* Glassmorphism Box */}
      <div className="relative w-full max-w-md p-8 bg-white/20 backdrop-blur-2xl border border-white/30 rounded-2xl shadow-2xl animate-fade-in mt-24">
        <h2 className="text-3xl font-semibold text-center text-gray-900 drop-shadow-sm mb-6">
          {isSignUp ? "Create Account" : "Login"}
        </h2>

        <form className="space-y-5">
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
            />
          </div>

          {!isSignUp && (
            <div className="text-right">
              <button
                type="button"
                className="text-sm text-blue-600 hover:underline cursor-pointer"
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

        <p className="mt-6 text-center text-gray-800">
          {isSignUp ? "Already have an account?" : "Don’t have an account?"}{" "}
          <span
            className="text-blue-600 font-semibold cursor-pointer hover:underline"
            onClick={() => setIsSignUp(!isSignUp)}
          >
            {isSignUp ? "Sign In" : "Register"}
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
