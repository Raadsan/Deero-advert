import Menu from "../models/menuModel.js";

// CREATE
export const createMenu = async (req, res) => {
  const menu = await Menu.create(req.body);
  res.status(201).json(menu);
};

// GET ALL
export const getMenus = async (req, res) => {
  const menus = await Menu.find().populate("permission").sort({ order: 1 });
  res.json(menus);
};

// GET BY ID
export const getMenuById = async (req, res) => {
  const menu = await Menu.findById(req.params.id).populate("permission");
  if (!menu) return res.status(404).json({ message: "Not found" });
  res.json(menu);
};

// UPDATE
export const updateMenu = async (req, res) => {
  const menu = await Menu.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!menu) return res.status(404).json({ message: "Not found" });
  res.json(menu);
};

// DELETE
export const deleteMenu = async (req, res) => {
  const menu = await Menu.findByIdAndDelete(req.params.id);
  if (!menu) return res.status(404).json({ message: "Not found" });
  res.json({ message: "Deleted successfully" });
};

// GET USER MENUS
export const getUserMenus = async (req, res) => {
  await req.user.populate({ path: "role", populate: { path: "permissions" } });
  const permissionIds = req.user.role.permissions.map(p => p._id);
  const menus = await Menu.find({ permission: { $in: permissionIds }, isActive: true }).sort({ order: 1 });
  res.json(menus);
};
