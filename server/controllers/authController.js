import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import userModel from "../models/userModel.js";

//register the user

export const register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.json({ success: false, message: "Please fill all fileds" });
  }

  try {
    const existingUser = await userModel.findOne({ email });

    if (existingUser) {
      return res.json({
        success: false,
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new userModel({
      name,
      email,
      password: hashedPassword,
    });

    await user.save();
    res.json({ success: true, message: "User registered successfully" });

    //token creation
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    //attach token in to cookie and send back response
    res.cookie("token", token, {
      httpOnly: true,
      //here it checks if production it will true or else false
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? none : "strict",
      maxAge: 7 * 24 * 60 * 60 * 100,
    });
  } catch (err) {
    res.send({ success: false, message: err.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.json({ success: false, message: "Fill the required fields" });
  }

  try {
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.json({ success: false, message: "Invalid email id" });
    }

    const passwordDecode = await bcrypt.compare(password, user.password);
    if (!passwordDecode) {
      return res.json({ success: false, message: "Invalid password" });
    }

    const token = jwt.sign({ id: userModel._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      samesite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({ success: true, message: "user successfully login" });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};
