import { prisma } from "../lib/prisma.js";

// CREATE Menu
export const createMenu = async (req, res) => {
  try {
    const { title, icon, url, isCollapsible, subMenus } = req.body;

    if (!title) return res.status(400).json({ success: false, message: "Menu title is required" });

    const menu = await prisma.menu.create({
      data: {
        title,
        icon,
        url,
        isCollapsible: isCollapsible || false,
        subMenus: {
          create: subMenus || []
        }
      },
      include: { subMenus: true }
    });

    res.status(201).json({ success: true, menu });
  } catch (err) {
    if (err.code === "P2002") return res.status(400).json({ success: false, message: "Menu title must be unique" });
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET ALL Menus
export const getMenus = async (req, res) => {
  try {
    const menus = await prisma.menu.findMany({
      orderBy: { title: 'asc' },
      include: { subMenus: true }
    });
    res.json({ success: true, menus });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET Menu BY ID
export const getMenuById = async (req, res) => {
  try {
    const menu = await prisma.menu.findUnique({
      where: { id: parseInt(req.params.id) },
      include: { subMenus: true }
    });
    if (!menu) return res.status(404).json({ success: false, message: "Menu not found" });
    res.json({ success: true, menu });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// UPDATE Menu
export const updateMenu = async (req, res) => {
  try {
    const { title, icon, url, isCollapsible } = req.body;
    const menu = await prisma.menu.update({
      where: { id: parseInt(req.params.id) },
      data: { title, icon, url, isCollapsible },
      include: { subMenus: true }
    });
    res.json({ success: true, menu });
  } catch (err) {
    if (err.code === "P2002") return res.status(400).json({ success: false, message: "Menu title must be unique" });
    if (err.code === "P2025") return res.status(404).json({ success: false, message: "Menu not found" });
    res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE Menu
export const deleteMenu = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await prisma.subMenu.deleteMany({ where: { menuId: id } });
    await prisma.menu.delete({ where: { id } });
    res.json({ success: true, message: "Menu deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ADD SubMenu to Menu
export const addSubMenu = async (req, res) => {
  try {
    const { title, url } = req.body;
    const menuId = parseInt(req.params.id);

    if (!title || !url) return res.status(400).json({ success: false, message: "SubMenu title and url are required" });

    const subMenu = await prisma.subMenu.create({
      data: { title, url, menuId }
    });

    res.json({ success: true, subMenu });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// UPDATE SubMenu
export const updateSubMenu = async (req, res) => {
  try {
    const { subMenuId } = req.params;
    const { title, url } = req.body;

    const subMenu = await prisma.subMenu.update({
      where: { id: parseInt(subMenuId) },
      data: { title, url }
    });

    res.json({ success: true, subMenu });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE SubMenu
export const deleteSubMenu = async (req, res) => {
  try {
    const { subMenuId } = req.params;
    await prisma.subMenu.delete({ where: { id: parseInt(subMenuId) } });
    res.json({ success: true, message: "SubMenu deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET USER MENUS
export const getUserMenus = async (req, res) => {
  try {
    const roleId = parseInt(req.params.roleId);
    if (!roleId) return res.status(400).json({ success: false, message: "Role ID is required" });

    const rolePermissions = await prisma.rolePermission.findMany({
      where: { roleId },
      include: {
         menusAccess: {
            include: {
               menu: {
                  include: { subMenus: true }
               }
            }
         }
      }
    });

    if (!rolePermissions.length) return res.json({ success: true, menus: [] });

    // In Prisma schema, rolePermission -> menusAccess[] -> menu
    const userMenus = rolePermissions.flatMap(rp => 
        rp.menusAccess.map(ma => ma.menu)
    ).filter(Boolean);

    res.json({ success: true, menus: userMenus });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
