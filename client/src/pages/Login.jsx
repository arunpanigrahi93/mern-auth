import React, { useState } from "react";

const Login = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);

  return (
    <div className="relative flex items-center justify-center min-h-screen overflow-hidden bg-gradient-to-r from-blue-300 via-purple-300 to-pink-300 animate-gradient-x">
      {/* Soft floating blobs for glassy background */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
        <div className="absolute w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-40 left-40 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute top-80 left-20 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      {/* Glassmorphism Box */}
      <div className="relative w-full max-w-md p-8 bg-white/20 backdrop-blur-2xl border border-white/30 rounded-2xl shadow-2xl animate-fade-in">
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
