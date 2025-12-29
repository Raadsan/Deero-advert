import Permission from "../models/permissionModel.js";

// CREATE
export const createPermission = async (req, res) => {
  const permission = await Permission.create(req.body);
  res.status(201).json(permission);
};

// GET ALL
export const getPermissions = async (req, res) => {
  const permissions = await Permission.find();
  res.json(permissions);
};

// GET BY ID
export const getPermissionById = async (req, res) => {
  const permission = await Permission.findById(req.params.id);
  if (!permission) return res.status(404).json({ message: "Not found" });
  res.json(permission);
};

// UPDATE
export const updatePermission = async (req, res) => {
  const permission = await Permission.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!permission) return res.status(404).json({ message: "Not found" });
  res.json(permission);
};

// DELETE
export const deletePermission = async (req, res) => {
  const permission = await Permission.findByIdAndDelete(req.params.id);
  if (!permission) return res.status(404).json({ message: "Not found" });
  res.json({ message: "Deleted successfully" });
};
