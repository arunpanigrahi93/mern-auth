import React from "react";
import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const location = useLocation();

  return (
    <nav className="bg-white shadow-md fixed top-0 left-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/" className="text-gray-700 hover:text-blue-600">
          <h1 className="text-xl font-bold text-blue-600">MyApp</h1>
        </Link>
        <div className="space-x-6">
          {/* Show Login button only if NOT already on /login */}
          {location.pathname !== "/login" && (
            <Link to="/login" className="text-gray-700 hover:text-blue-600">
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
