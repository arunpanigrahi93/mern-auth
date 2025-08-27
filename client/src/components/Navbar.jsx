import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { removeUser } from "../redux/userSlice"; // ensure you have this action
import axios from "axios";

const Navbar = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((store) => store.user);

  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      const user = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/auth/logout`,
        {},
        { withCredentials: true }
      );
      dispatch(removeUser(user));
      toast.success("Logged out successfully 👋");
      navigate("/login");
    } catch (err) {
      console.log(err.message);
    }
  };

  const handleVerify = () => {
    toast.info("Verification email sent 📧");
    // 🔹 Call API here to trigger email verification
  };

  return (
    <nav className="bg-white shadow-md fixed top-0 left-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/" className="text-gray-700 hover:text-blue-600">
          <h1 className="text-xl font-bold text-blue-600">MyApp</h1>
        </Link>

        {user ? (
          <div className="relative">
            {/* Avatar clickable */}
            <div
              className="w-8 h-8 flex justify-center items-center rounded-full bg-black text-white cursor-pointer"
              onClick={() => setMenuOpen((prev) => !prev)}
            >
              {user?.name?.[0]?.toUpperCase() || "U"}
            </div>

            {/* Dropdown */}
            {menuOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-lg p-2">
                {!user.isAccountVerified && (
                  <button
                    onClick={handleVerify}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                  >
                    Verify Email
                  </button>
                )}
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="space-x-6">
            {location.pathname !== "/login" && (
              <Link to="/login" className="text-gray-700 hover:text-blue-600">
                Login
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
