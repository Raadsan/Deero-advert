import User from "../models/UserModel.js";
import bcrypt from "bcryptjs";

/**
 * ➕ CREATE USER
 * POST /api/users
 */
export const createUser = async (req, res) => {
  try {
    const { fullname, email, phone, password, role } = req.body;

    // Check if email exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // If called from admin panel (/api/users), automatically set role to "admin"
    // If called from signup (/api/auth/signup), role is already set to "user"
    const userRole = role || "admin"; // Admin panel creates admin users by default

    const user = await User.create({
      fullname,
      email,
      phone,
      password: hashedPassword,
      role: userRole,
    });

    res.status(201).json({
      message: "User created successfully",
      user: {
        id: user._id,
        fullname: user.fullname,
        email: user.email,
        phone: user.phone,
        password: user.password, // hashed password
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * 📄 GET ALL USERS
 * GET /api/users
 */
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find(); // Include password (hashed)
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * 📄 GET USER BY ID
 * GET /api/users/:id
 */
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id); // Include password (hashed)

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Invalid user ID" });
  }
};

/**
 * ✏️ UPDATE USER
 * PUT /api/users/:id
 */
export const updateUser = async (req, res) => {
  try {
    const { fullname, email, phone, password, role } = req.body;

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // If password is being updated
    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    user.fullname = fullname || user.fullname;
    user.email = email || user.email;
    user.phone = phone || user.phone;
    user.role = role || user.role;

    await user.save();

    res.status(200).json({
      message: "User updated successfully",
      user: {
        id: user._id,
        fullname: user.fullname,
        email: user.email,
        phone: user.phone,
        password: user.password, // hashed password
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * 🗑 DELETE USER
 * DELETE /api/users/:id
 */
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Invalid user ID" });
  }
};
