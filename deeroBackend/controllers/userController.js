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
        role: user.role,
        discounts: await prisma.discount.findMany({
          where: {
            OR: [{ userId: user.id }, { userId: null }],
            status: "active"
          }
        })
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * 🔐 GOOGLE LOGIN / SYNC
 */
export const googleLogin = async (req, res) => {
  try {
    const { email, name, googleId, image, phone } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    let user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      include: { role: true }
    });

    if (!user) {
      // Create a new user if not exists
      let userRole = await prisma.role.findUnique({ where: { name: "user" } });
      if (!userRole) {
        userRole = await prisma.role.create({
          data: { name: "user", description: "Standard user" }
        });
      }

      // Default password for Google users (they won't use it to login traditionally)
      const hashedPassword = await bcrypt.hash(googleId || Math.random().toString(36), 10);

      // Mobile users usually get 15 bonus points
      const initialBonus = 15;

      user = await prisma.user.create({
        data: {
          fullname: name || email.split("@")[0],
          email: email.toLowerCase(),
          password: hashedPassword,
          phone: phone || "",
          roleId: userRole.id,
          registerSource: "mobile", // Assuming Google sign-in is primarily from mobile/app
          bonus: initialBonus,
          bonusHistory: {
            create: {
              amount: initialBonus,
              reason: "Registration Bonus (Google)",
              type: "add"
            }
          }
        },
        include: { role: true }
      });
    }

    // If user exists but has no phone, update it if phone is provided from Google
    if (user && !user.phone && phone) {
      user = await prisma.user.update({
        where: { id: user.id },
        data: { phone: phone },
        include: { role: true }
      });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "7d" }
    );

    res.status(200).json({
      message: "Google login successful",
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
    console.error("Google Login Error:", error);
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
    
    if (!user) {
      // For security, don't reveal if user exists
      return res.status(200).json({ message: "If email exists, reset code sent" });
    }

    // Generate 6-digit code
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = new Date();
    expires.setMinutes(expires.getMinutes() + 10); // 10 minutes

    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetCode: resetCode,
        resetCodeExpires: expires
      }
    });

    const htmlMessage = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e1e1e1; border-radius: 12px; padding: 0; overflow: hidden; background-color: #ffffff;">
        <div style="background-color: #ffffff; padding: 30px 20px; text-align: center;">
          <h2 style="margin: 0; color: #1a1a1a; font-size: 24px; letter-spacing: 0.5px;">Password Reset</h2>
        </div>
        <div style="height: 2px; background: linear-gradient(to right, #ffffff, #651313, #ffffff); margin: 0 40px;"></div>
        <div style="padding: 40px 40px 30px;">
          <p style="text-align: center; color: #4a4a4a; font-size: 16px; line-height: 1.5; margin-bottom: 30px;">You requested a password reset. Use the code below to reset your password:</p>
          
          <div style="background-color: #f0f7f7; padding: 30px; border-radius: 16px; text-align: center; margin: 0 0 30px 0; border: 1px solid #e8f2f2;">
            <span style="font-size: 48px; font-weight: 800; color: #1e3a3a; letter-spacing: 15px; font-family: monospace; display: block; margin-left: 15px;">${resetCode}</span>
          </div>
          
          <div style="text-align: center; margin-bottom: 25px;">
            <p style="color: #666; font-size: 14px; margin: 0;">This code expires in <strong style="color: #1e3a3a;">10 minutes</strong>.</p>
          </div>
          
          <p style="text-align: center; color: #999; font-size: 14px; margin-bottom: 0;">If you did not request this, please ignore this email.</p>
        </div>
        <div style="background-color: #f9f9f9; padding: 25px; text-align: center; border-top: 1px solid #eee;">
          <p style="color: #bbb; font-size: 12px; margin: 0;">Sent from Deero Advert Management System.</p>
        </div>
      </div>
    `;

    try {
      await sendEmail({
        email: user.email,
        subject: "Password Reset Code",
        message: `Your password reset code is: ${resetCode}`,
        html: htmlMessage,
      });

      res.status(200).json({ message: "Password reset code has been sent" });
    } catch (err) {
      console.error("Email send error:", err);
      return res.status(500).json({ message: "Email could not be sent" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * 🔐 VERIFY RESET CODE
 */
export const verifyResetCode = async (req, res) => {
  try {
    const { email, code } = req.body;
    if (!email || !code) return res.status(400).json({ message: "Email and code are required" });

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    });

    if (!user || user.resetCode !== code || new Date() > user.resetCodeExpires) {
      return res.status(400).json({ message: "Invalid or expired code" });
    }

    res.status(200).json({ message: "Code verified successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * 🔐 RESET PASSWORD
 */
export const resetPassword = async (req, res) => {
  try {
    const { email, code, password } = req.body;

    if (!email || !code || !password) {
      return res.status(400).json({ message: "Email, code, and new password are required" });
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    });

    if (!user || user.resetCode !== code || new Date() > user.resetCodeExpires) {
      return res.status(400).json({ message: "Invalid or expired code" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    await prisma.user.update({
      where: { id: user.id },
      data: { 
        password: hashedPassword,
        resetCode: null,
        resetCodeExpires: null
      }
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
      include: {
        role: true,
        _count: {
          select: { discounts: true }
        }
      }
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET CURRENT USER PROFILE (Lightweight version for refreshUser)
export const getMe = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: parseInt(req.user.id) },
      include: { 
        role: true,
        discounts: {
          where: { status: "active" }
        }
      }
    });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET USER BY ID (Full details including transactions)
export const getUserById = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: parseInt(req.params.id) },
      include: {
        role: true,
        discounts: {
          where: { status: "active" }
        },
        transactions: {
          include: {
            service: true,
            hostingPackage: true
          },
          orderBy: { createdAt: 'desc' }
        }
      }
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

    if (data.role) {
      data.roleId = parseInt(data.role);
      delete data.role;
    }

    // Prevent updating primary key or metadata fields
    delete data.id;
    delete data.createdAt;
    delete data.updatedAt;
    if (req.file) {
      data.image = req.file.path; // Cloudinary returns the URL in path
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
