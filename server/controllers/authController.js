import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";
import transporter from "../config/nodemailer.js";
import { response, text } from "express";

/**
 * Register Controller
 * - Validates input
 * - Hashes password
 * - Creates a new user
 * - Generates JWT token and stores in cookie
 * - Sends welcome email
 */
export const register = async (req, res) => {
  const { name, email, password } = req.body;

  // Ensure all fields are provided
  if (!name || !email || !password) {
    return res.json({ success: false, message: "Please fill all fields" });
  }

  try {
    // Check if a user already exists with the given email
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.json({
        success: false,
        message: "User already exists",
      });
    }

    // Hash password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create and save the new user
    const user = new userModel({
      name,
      email,
      password: hashedPassword,
    });
    await user.save();

    // Create JWT token with userId
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d", // Token valid for 7 days
    });

    // Store JWT in cookie (httpOnly so not accessible from JS)
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Only secure cookies in prod
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Send welcome email to user
    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: "Welcome to ArunWebStack",
      text: `Welcome to ArunWebStack! Your account has been created with email: ${email}`,
    };
    await transporter.sendMail(mailOptions);

    res.json({ success: true, message: "User registered successfully" });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

/**
 * Login Controller
 * - Validates input
 * - Checks user existence and password
 * - Generates JWT token and stores in cookie
 */
export const login = async (req, res) => {
  const { email, password } = req.body;

  // Ensure fields are provided
  if (!email || !password) {
    return res.json({ success: false, message: "Fill the required fields" });
  }

  try {
    // Find user by email
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "Invalid email id" });
    }

    // Compare given password with hashed password in DB
    const passwordDecode = await bcrypt.compare(password, user.password);
    if (!passwordDecode) {
      return res.json({ success: false, message: "Invalid password" });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // Set JWT in cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({ success: true, message: "User successfully logged in" });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

/**
 * Logout Controller
 * - Clears the JWT cookie
 */
export const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    });

    res.json({ success: true, message: "Logout successfully" });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

/**
 * Fetch all users
 */
export const users = async (req, res) => {
  try {
    const users = await userModel.find({});
    if (users.length <= 0) {
      res.json({ success: false, message: "No users found" });
    } else {
      res.json({
        success: true,
        message: "Fetched users successfully",
        users,
      });
    }
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

/**
 * Send Verification OTP
 * - Generates OTP for logged-in user
 * - Stores it with expiry in DB
 * - Sends OTP to user's email
 */
export const sendVerifyOtp = async (req, res) => {
  try {
    // UserId comes from middleware (decoded JWT)
    const { id: userId } = req.user;

    // Find user
    const user = await userModel.findById(userId);

    // If already verified, stop
    if (user.isAccountVerified) {
      return res.json({ success: false, message: "Account already verified" });
    }

    // Generate 6-digit OTP
    const otp = String(Math.floor(100000 + Math.random() * 900000));

    // Save OTP with expiry (24 hrs)
    user.verifyOtp = otp;
    user.verifyOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000;
    await user.save();

    // Send OTP email
    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "Account verification OTP",
      text: `Your OTP is ${otp}. Verify your account using this OTP.`,
    };
    await transporter.sendMail(mailOptions);

    res.json({ success: true, message: "Verification OTP sent on email" });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

/**
 * Verify Email
 * - Validates OTP from client
 * - Matches with stored OTP in DB
 * - Checks expiry
 * - Marks account as verified
 */
export const verifyEmail = async (req, res) => {
  const { otp } = req.body; // client provides only OTP
  const { id: userId } = req.user; // userId from middleware

  // Ensure OTP is provided
  if (!otp) {
    return res.json({ success: false, message: "Missing OTP" });
  }

  try {
    // Find user
    const user = await userModel.findById(userId);
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    // Check OTP validity
    if (user.verifyOtp === "" || user.verifyOtp !== otp) {
      return res.json({ success: false, message: "Invalid OTP" });
    }

    // Check OTP expiry
    if (user.verifyOtpExpireAt < Date.now()) {
      return res.json({ success: false, message: "OTP expired" });
    }

    // Mark account as verified and reset OTP fields
    user.isAccountVerified = true;
    user.verifyOtp = "";
    user.verifyOtpExpireAt = 0;
    await user.save();

    res.json({ success: true, message: "Email verified successfully" });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

//check if user is authenticated

export const isAuthenticated = async (req, res) => {
  try {
    return res.json({ success: true, message: "Authenticated" });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

//send reset otp

export const sendResetOtp = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.json({ success: false, message: "Email is required" });
  }
  try {
    const user = await userModel.findOne({ email });

    // ❌ Wrong check: you repeated `if (!email)` instead of checking `if (!user)`
    if (!user) {
      return res.json({
        success: false,
        message: "User not found with this email",
      });
    }

    const otp = String(Math.floor(100000 + Math.random() * 900000));

    // ❌ Typo: `restOtp` → should be `resetOtp`
    user.resetOtp = otp;
    user.resetOtpExpireAt = Date.now() + 15 * 60 * 1000; // 15 min
    await user.save();

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "Password Reset OTP",
      text: `Your OTP for resetting your password is ${otp}. Use this OTP to proceed with resetting your password.`,
    };
    await transporter.sendMail(mailOptions);

    res.json({ success: true, message: "OTP sent to your email" });
  } catch (err) {
    // ❌ You used `response.json` instead of `res.json`
    res.json({
      success: false,
      message: "Something went wrong",
      error: err.message,
    });
  }
};

//reset password

export const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  // Validation
  if (!email || !otp || !newPassword) {
    return res.json({
      success: false,
      message: "Email, OTP, and new password are required",
    });
  }

  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    // OTP validation
    if (!user.resetOtp || user.resetOtp !== otp) {
      return res.json({ success: false, message: "Invalid OTP" });
    }

    // Expiry check
    if (user.resetOtpExpireAt < Date.now()) {
      return res.json({ success: false, message: "OTP expired" });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetOtp = "";
    user.resetOtpExpireAt = 0;

    await user.save(); // ✅ Don't forget to save changes

    res.json({ success: true, message: "Password updated successfully" });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};
