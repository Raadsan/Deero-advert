import User from "../models/UserModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

/**
 * 🔐 SIGNUP
 */
export const signup = async (req, res) => {
  try {
    const { fullname, email, password, phone, role } = req.body;

    if (!fullname || !email || !password || !phone) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) return res.status(400).json({ message: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      fullname,
      email: email.toLowerCase(),
      password: hashedPassword,
      phone,
      role, // must be valid ObjectId
    });

    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "7d" }
    );

    res.status(201).json({
      message: "Account created successfully",
      token,
      user: { id: user._id, fullname: user.fullname, email: user.email, phone, role: user.role }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * 🔐 LOGIN
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "Email and password are required" });

    const user = await User.findOne({ email: email.toLowerCase() }).populate("role");
    if (!user) return res.status(401).json({ message: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid email or password" });

    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "7d" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: { id: user._id, fullname: user.fullname, email: user.email, phone: user.phone, role: user.role }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * 🔑 FORGOT PASSWORD
 */
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(200).json({ message: "If email exists, reset link sent" });

    const resetToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || "secret", { expiresIn: "1h" });

    // TODO: send email with resetToken
    res.status(200).json({
      message: "Password reset link has been sent",
      resetToken: process.env.NODE_ENV === "development" ? resetToken : undefined,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * 🛡 PROTECTED USER CRUD
 */

// GET ALL USERS
export const getUsers = async (req, res) => {
  const users = await User.find().populate("role");
  res.json(users);
};

// GET USER BY ID
export const getUserById = async (req, res) => {
  const user = await User.findById(req.params.id).populate("role");
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json(user);
};

// UPDATE USER
export const updateUser = async (req, res) => {
  const data = { ...req.body };
  if (data.password) data.password = await bcrypt.hash(data.password, 10);
  const user = await User.findByIdAndUpdate(req.params.id, data, { new: true });
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json(user);
};

// DELETE USER
export const deleteUser = async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json({ message: "User deleted successfully" });
};
