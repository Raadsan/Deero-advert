import Permission from "../models/permissionModel.js";
import Role from "../models/roleModel.js";

// CREATE Permission
export const createPermission = async (req, res) => {
  try {
    const { name, key, roleId } = req.body;

    // Hubi in fields la bixiyay
    if (!name || !key || !roleId) {
      return res.status(400).json({ success: false, message: "Name, key and roleId are required" });
    }

    // Hubi in role uu jiro
    const role = await Role.findById(roleId);
    if (!role) return res.status(404).json({ success: false, message: "Role not found" });

    // Create Permission
    const permission = await Permission.create({ name, key, roleId });

    // Update Role permissions array
    // (Optional if you want Role to keep track of permissions)
    // role.permissions.push(permission._id);
    // await role.save();

    res.status(201).json({ success: true, permission });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ success: false, message: "Permission key must be unique" });
    }
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET ALL Permissions
export const getPermissions = async (req, res) => {
  try {
    const permissions = await Permission.find().populate("roleId", "name"); // populate role name
    res.json({ success: true, permissions });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET Permission BY ID
export const getPermissionById = async (req, res) => {
  try {
    const permission = await Permission.findById(req.params.id).populate("roleId", "name");
    if (!permission) return res.status(404).json({ success: false, message: "Permission not found" });
    res.json({ success: true, permission });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// UPDATE Permission
export const updatePermission = async (req, res) => {
  try {
    const { name, key, roleId } = req.body;

    // Optional: verify roleId if provided
    if (roleId) {
      const role = await Role.findById(roleId);
      if (!role) return res.status(404).json({ success: false, message: "Role not found" });
    }

    const permission = await Permission.findByIdAndUpdate(
      req.params.id,
      { name, key, roleId },
      { new: true, runValidators: true }
    );

    if (!permission) return res.status(404).json({ success: false, message: "Permission not found" });

    res.json({ success: true, permission });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ success: false, message: "Permission key must be unique" });
    }
    res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE Permission
export const deletePermission = async (req, res) => {
  try {
    const permission = await Permission.findByIdAndDelete(req.params.id);
    if (!permission) return res.status(404).json({ success: false, message: "Permission not found" });
    res.json({ success: true, message: "Permission deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
