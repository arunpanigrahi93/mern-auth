import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";

/**
 * Register Controller
 * Creates a new user, hashes password, generates token, and stores it in cookie.
 */
export const register = async (req, res) => {
  const { name, email, password } = req.body;

  // Validation check
  if (!name || !email || !password) {
    return res.json({ success: false, message: "Please fill all fields" });
  }

  try {
    // Check if user already exists
    const existingUser = await userModel.findOne({ email });

    if (existingUser) {
      return res.json({
        success: false,
        message: "User already exists",
      });
    }

    // Encrypt password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = new userModel({
      name,
      email,
      password: hashedPassword,
    });

    await user.save();

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d", // Token validity
    });

    // Store token inside a cookie
    res.cookie("token", token, {
      httpOnly: true, // Prevents client-side JS access (security)
      secure: process.env.NODE_ENV === "production", // Secure in production (HTTPS)
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict", // Needed for cross-site cookies
      maxAge: 7 * 24 * 60 * 60 * 1000, // Cookie expiry (7 days)
    });

    // Final response
    res.json({ success: true, message: "User registered successfully" });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

/**
 * Login Controller
 * Authenticates user, verifies password, generates JWT, and sets cookie.
 */
export const login = async (req, res) => {
  const { email, password } = req.body;

  // Validation check
  if (!email || !password) {
    return res.json({ success: false, message: "Fill the required fields" });
  }

  try {
    // Find user by email
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.json({ success: false, message: "Invalid email id" });
    }

    // Compare entered password with hashed password
    const passwordDecode = await bcrypt.compare(password, user.password);
    if (!passwordDecode) {
      return res.json({ success: false, message: "Invalid password" });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // Set cookie with token
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // Successful login response
    res.json({ success: true, message: "User successfully logged in" });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

/**
 * Logout Controller
 * Clears the JWT cookie and logs user out.
 */
export const logout = async (req, res) => {
  try {
    // Clear token cookie
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    });

    // Response after logout
    res.json({ success: true, message: "Logout successfully" });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};
