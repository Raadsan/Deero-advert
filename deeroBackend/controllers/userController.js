import { prisma } from "../lib/prisma.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import sendEmail from "../utils/sendEmail.js";

/**
 * 🔐 SIGNUP
 */
export const signup = async (req, res) => {
  try {
    const {
      fullname, email, password, phone, role,
      companyName, streetAddress, streetAddress2, city, state, country,
      registerSource // Added registerSource
    } = req.body;

    if (!fullname || !email || !password || !phone) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    });
    if (existingUser) return res.status(400).json({ message: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    let roleId;

    if (role) {
      // Check if it's a number (ID) or string (Name)
      const parsedRoleId = parseInt(role);
      if (!isNaN(parsedRoleId)) {
        roleId = parsedRoleId;
      } else {
        const roleName = role.toLowerCase().trim();
        let foundRole = await prisma.role.findUnique({
          where: { name: roleName }
        });

        if (foundRole) {
          roleId = foundRole.id;
        } else {
          const newRole = await prisma.role.create({
            data: {
              name: roleName,
              description: `Role created automatically for ${roleName}`
            }
          });
          roleId = newRole.id;
        }
      }
    }

    if (!roleId) {
      let userRole = await prisma.role.findUnique({ where: { name: "user" } });
      if (!userRole) {
        userRole = await prisma.role.create({
          data: { name: "user", description: "Standard user" }
        });
      }
      roleId = userRole.id;
    }

    // Determine registration source and initial bonus
    const source = registerSource === "mobile" ? "mobile" : "website";
    const initialBonus = source === "mobile" ? 15 : 0;

    const user = await prisma.user.create({
      data: {
        fullname,
        email: email.toLowerCase(),
        password: hashedPassword,
        phone,
        companyName,
        streetAddress,
        streetAddress2,
        city,
        state,
        country: country || "Somalia",
        roleId: roleId,
        registerSource: source,
        bonus: initialBonus,
        // If it's mobile registration, create the first bonus history record
        bonusHistory: initialBonus > 0 ? {
          create: {
            amount: initialBonus,
            reason: "Registration Bonus (Mobile)",
            type: "add"
          }
        } : undefined
      },
      include: { role: true }
    });

    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "7d" }
    );

    res.status(201).json({
      message: "Account created successfully",
      token,
      user: {
        id: user.id,
        fullname: user.fullname,
        email: user.email,
        phone: user.phone,
        bonus: user.bonus,
        bonusStatus: user.bonusStatus,
        registerSource: user.registerSource,
        companyName: user.companyName,
        streetAddress: user.streetAddress,
        city: user.city,
        role: user.role
      }
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

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      include: { role: true }
    });
    if (!user) return res.status(401).json({ message: "Incorrect email or password" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Incorrect email or password" });

    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "7d" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        fullname: user.fullname,
        email: user.email,
        phone: user.phone,
        bonus: user.bonus,
        bonusStatus: user.bonusStatus,
        registerSource: user.registerSource,
        role: user.role
      }
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

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    });
    if (!user) return res.status(200).json({ message: "If email exists, reset link sent" });

    const resetToken = jwt.sign({ userId: user.id }, process.env.JWT_SECRET || "secret", { expiresIn: "1h" });

    const resetUrl = `${process.env.FRONTEND_URL || "http://localhost:3000"}/reset-password/${resetToken}`;

    const message = `
      <h1>You have requested a password reset</h1>
      <p>Please go to this link to reset your password:</p>
      <a href=${resetUrl} clicktracking=off>${resetUrl}</a>
    `;

    try {
      await sendEmail({
        email: user.email,
        subject: "Password Reset Request",
        message: `Please go to this link to reset your password: ${resetUrl}`,
        html: message,
      });

      res.status(200).json({ message: "Password reset link has been sent" });
    } catch (err) {
      console.error("Email send error:", err);
      return res.status(500).json({
        message: "Email could not be sent",
        error: err.message
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * 🔐 RESET PASSWORD
 */
export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ message: "Password is required" });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || "secret");
    } catch (err) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    const user = await prisma.user.findUnique({
      where: { id: parseInt(decoded.userId) }
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword }
    });

    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * 🛡 PROTECTED USER CRUD
 */

// GET ALL USERS
export const getUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      include: { role: true }
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET USER BY ID
export const getUserById = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: parseInt(req.params.id) },
      include: { role: true }
    });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE USER
export const updateUser = async (req, res) => {
  try {
    const data = { ...req.body };
    if (data.password) data.password = await bcrypt.hash(data.password, 10);
    
    // Remove relation fields if they are in body but not as proper IDs
    if (data.role) {
       data.roleId = parseInt(data.role);
       delete data.role;
    }

    const user = await prisma.user.update({
      where: { id: parseInt(req.params.id) },
      data: data,
      include: { role: true }
    });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE USER
export const deleteUser = async (req, res) => {
  try {
    await prisma.user.delete({
      where: { id: parseInt(req.params.id) }
    });
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET BONUS HISTORY
export const getBonusHistory = async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const history = await prisma.bonusHistory.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });
    res.json({ success: true, history });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
