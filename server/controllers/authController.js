import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";
import transporter from "../config/nodemailer.js";

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

    //send email conformation
    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: "Welcome to ArunWebStack",
      text: `welcome to ArunWebStack website. your account has been created with email id: ${email}`,
    };

    await transporter.sendMail(mailOptions);

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

export const users = async (req, res) => {
  try {
    const users = await userModel.find({});

    if (users.length <= 0) {
      res.json({ success: false, message: "no users found" });
    } else {
      res.json({
        success: true,
        message: "fetching users successfully",
        users,
      });
    }
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

// send verification OTP to the User's Email

/**
 * sendVerifyOtp
 * Controller function to send an account verification OTP to the user via email.
 */
export const sendVerifyOtp = async (req, res) => {
  try {
    // Extract userId from the request body
    const { userId } = req.body;

    // Find the user in the database by userId
    const user = await userModel.findById(userId);

    // If the account is already verified, stop and return a response
    if (user.isAccountVerified) {
      return res.json({ success: false, message: "Account already verified" });
    }

    // Generate a 6-digit OTP as a string
    const otp = String(Math.floor(100000 + Math.random() * 900000));

    // Save the OTP and set an expiration time (24 hours from now)
    user.verifyOtp = otp;
    user.verifyOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000;

    // Persist the updated user object in the database
    await user.save();

    // Prepare the email details
    const mailOptions = {
      from: process.env.SENDER_EMAIL, // Sender email address (from env variable)
      to: user.email, // Receiver's email (user)
      subject: "Account verification OTP", // Email subject
      text: `Your OTP is ${otp}. Verify your account using this OTP.`, // Email body
    };

    // Send the OTP email using configured transporter (e.g., Nodemailer)
    await transporter.sendMail(mailOptions);

    // Send success response back to client
    res.json({ success: true, message: "Verification OTP Sent on email" });
  } catch (err) {
    // Handle errors gracefully and return error message
    res.json({ success: false, message: err.message });
  }
};

/**
 * Controller: verifyEmail
 * Purpose: Verifies the OTP entered by the user, marks the account as verified if valid.
 */
export const verifyEmail = async (req, res) => {
  // Extract userId and otp from request body
  const { userId, otp } = req.body;

  // Check if both userId and otp are provided, else return error
  if (!userId || !otp) {
    return res.json({ success: false, message: "Missing details" });
  }

  try {
    // Find the user in the database using the provided userId
    const user = await userModel.findById(userId);

    // If user is not found in the database, return error
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    // Validate OTP: if it's empty or does not match the stored one
    if (user.verifyOtp === "" || user.verifyOtp !== otp) {
      return res.json({ success: false, message: "Invalid OTP" });
    }

    // Check if the OTP has expired by comparing expiry time with current time
    if (user.verifyOtpExpireAt < Date.now()) {
      return res.json({ success: false, message: "OTP expired" });
    }

    // If OTP is valid and not expired:
    // 1. Mark the account as verified
    // 2. Reset OTP fields to prevent reuse
    user.isAccountVerified = true;
    user.verifyOtp = "";
    user.verifyOtpExpireAt = 0;

    // Save the updated user data to the database
    await user.save();

    // Return success response after successful verification
    res.json({ success: true, message: "Email verified successfully" });
  } catch (err) {
    // Catch any unexpected errors and return error response
    res.json({ success: false, message: err.message });
  }
};
