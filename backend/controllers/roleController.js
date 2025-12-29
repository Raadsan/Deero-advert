import Role from "../models/roleModel.js";

// CREATE
export const createRole = async (req, res) => {
  const role = await Role.create(req.body);
  res.status(201).json(role);
};

// GET ALL
export const getRoles = async (req, res) => {
  const roles = await Role.find().populate("permissions");
  res.json(roles);
};

// GET BY ID
export const getRoleById = async (req, res) => {
  const role = await Role.findById(req.params.id).populate("permissions");
  if (!role) return res.status(404).json({ message: "Not found" });
  res.json(role);
};

// UPDATE
export const updateRole = async (req, res) => {
  const role = await Role.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!role) return res.status(404).json({ message: "Not found" });
  res.json(role);
};

// DELETE
export const deleteRole = async (req, res) => {
  const role = await Role.findByIdAndDelete(req.params.id);
  if (!role) return res.status(404).json({ message: "Not found" });
  res.json({ message: "Deleted successfully" });
};
