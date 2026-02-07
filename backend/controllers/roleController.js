import Role from "../models/roleModel.js";

// CREATE Role
export const createRole = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ success: false, message: "Role name is required" });
    }

    const role = await Role.create({ name, description });
    res.status(201).json({ success: true, role });
  } catch (err) {
    // Handle duplicate key error
    if (err.code === 11000) {
      return res.status(400).json({ success: false, message: "Role name must be unique" });
    }
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET ALL Roles
export const getRoles = async (req, res) => {
  try {
    const roles = await Role.find();
    res.json({ success: true, roles });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET Role BY ID
export const getRoleById = async (req, res) => {
  try {
    const role = await Role.findById(req.params.id);
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
    const role = await Role.findByIdAndUpdate(
      req.params.id,
      { name, description },
      { new: true, runValidators: true }
    );

    if (!role) {
      return res.status(404).json({ success: false, message: "Role not found" });
    }

    res.json({ success: true, role });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ success: false, message: "Role name must be unique" });
    }
    res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE Role
export const deleteRole = async (req, res) => {
  try {
    const role = await Role.findByIdAndDelete(req.params.id);
    if (!role) return res.status(404).json({ success: false, message: "Role not found" });
    res.json({ success: true, message: "Role deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
