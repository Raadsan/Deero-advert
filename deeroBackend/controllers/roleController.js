import { prisma } from "../lib/prisma.js";

// CREATE Role
export const createRole = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ success: false, message: "Role name is required" });
    }

    const role = await prisma.role.create({
      data: { name, description }
    });
    res.status(201).json({ success: true, role });
  } catch (err) {
    if (err.code === "P2002") {
      return res.status(400).json({ success: false, message: "Role name must be unique" });
    }
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET ALL Roles
export const getRoles = async (req, res) => {
  try {
    const roles = await prisma.role.findMany();
    res.json({ success: true, roles });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET Role BY ID
export const getRoleById = async (req, res) => {
  try {
    const role = await prisma.role.findUnique({
      where: { id: parseInt(req.params.id) }
    });
    if (!role) return res.status(404).json({ success: false, message: "Role not found" });
    res.json({ success: true, role });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// UPDATE Role
export const updateRole = async (req, res) => {
  try {
    const { name, description } = req.body;
    const role = await prisma.role.update({
      where: { id: parseInt(req.params.id) },
      data: { name, description }
    });

    res.json({ success: true, role });
  } catch (err) {
    if (err.code === "P2002") {
      return res.status(400).json({ success: false, message: "Role name must be unique" });
    }
    if (err.code === "P2025") {
      return res.status(404).json({ success: false, message: "Role not found" });
    }
    res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE Role
export const deleteRole = async (req, res) => {
  try {
    await prisma.role.delete({
      where: { id: parseInt(req.params.id) }
    });
    res.json({ success: true, message: "Role deleted successfully" });
  } catch (err) {
    if (err.code === "P2025") {
      return res.status(404).json({ success: false, message: "Role not found" });
    }
    res.status(500).json({ success: false, message: err.message });
  }
};
