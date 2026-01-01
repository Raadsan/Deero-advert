import Menu from "../models/menuModel.js";
import RolePermissions from "../models/RolePermissionsModel.js";

// CREATE Menu
export const createMenu = async (req, res) => {
  try {
    const { title, icon, url, isCollapsible, subMenus } = req.body;

    if (!title) {
      return res.status(400).json({ success: false, message: "Menu title is required" });
    }

    const menu = await Menu.create({
      title,
      icon,
      url,
      isCollapsible: isCollapsible || false,
      subMenus: subMenus || []
    });

    res.status(201).json({ success: true, menu });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ success: false, message: "Menu title must be unique" });
    }
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET ALL Menus
export const getMenus = async (req, res) => {
  try {
    const menus = await Menu.find().sort({ title: 1 });
    res.json({ success: true, menus });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET Menu BY ID
export const getMenuById = async (req, res) => {
  try {
    const menu = await Menu.findById(req.params.id);

    if (!menu) {
      return res.status(404).json({ success: false, message: "Menu not found" });
    }

    res.json({ success: true, menu });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// UPDATE Menu
export const updateMenu = async (req, res) => {
  try {
    const { title, icon, url, isCollapsible, subMenus } = req.body;

    const menu = await Menu.findByIdAndUpdate(
      req.params.id,
      { title, icon, url, isCollapsible, subMenus },
      { new: true, runValidators: true }
    );

    if (!menu) {
      return res.status(404).json({ success: false, message: "Menu not found" });
    }

    res.json({ success: true, menu });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ success: false, message: "Menu title must be unique" });
    }
    res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE Menu
export const deleteMenu = async (req, res) => {
  try {
    const menu = await Menu.findByIdAndDelete(req.params.id);

    if (!menu) {
      return res.status(404).json({ success: false, message: "Menu not found" });
    }

    res.json({ success: true, message: "Menu deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ADD SubMenu to Menu
export const addSubMenu = async (req, res) => {
  try {
    const { title, url } = req.body;
    const menuId = req.params.id;

    if (!title || !url) {
      return res.status(400).json({
        success: false,
        message: "SubMenu title and url are required"
      });
    }

    const menu = await Menu.findById(menuId);

    if (!menu) {
      return res.status(404).json({ success: false, message: "Menu not found" });
    }

    menu.subMenus.push({ title, url });
    await menu.save();

    res.json({ success: true, menu });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// UPDATE SubMenu
export const updateSubMenu = async (req, res) => {
  try {
    const { menuId, subMenuId } = req.params;
    const { title, url } = req.body;

    const menu = await Menu.findById(menuId);

    if (!menu) {
      return res.status(404).json({ success: false, message: "Menu not found" });
    }

    const subMenu = menu.subMenus.id(subMenuId);

    if (!subMenu) {
      return res.status(404).json({ success: false, message: "SubMenu not found" });
    }

    if (title) subMenu.title = title;
    if (url) subMenu.url = url;

    await menu.save();

    res.json({ success: true, menu });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE SubMenu
export const deleteSubMenu = async (req, res) => {
  try {
    const { menuId, subMenuId } = req.params;

    const menu = await Menu.findById(menuId);

    if (!menu) {
      return res.status(404).json({ success: false, message: "Menu not found" });
    }

    // Use Mongoose subdocument removal
    const subMenu = menu.subMenus.id(subMenuId);

    if (!subMenu) {
      return res.status(404).json({ success: false, message: "SubMenu not found" });
    }

    subMenu.deleteOne();
    await menu.save();

    res.json({ success: true, message: "SubMenu deleted successfully", menu });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET USER MENUS (based on role permissions)
export const getUserMenus = async (req, res) => {
  try {
    const { roleId } = req.params;

    if (!roleId) {
      return res.status(400).json({ success: false, message: "Role ID is required" });
    }

    // Get role permissions
    const rolePermissions = await RolePermissions.findOne({ role: roleId })
      .populate("menusAccess.menuId");

    if (!rolePermissions || !rolePermissions.menusAccess.length) {
      return res.json({ success: true, menus: [] });
    }

    // Build the menu structure with accessible submenus
    const userMenus = rolePermissions.menusAccess.map(ma => {
      const menu = ma.menuId;

      if (!menu) return null;

      // Filter submenus based on permissions
      let accessibleSubMenus = [];
      if (ma.subMenus && ma.subMenus.length > 0) {
        accessibleSubMenus = menu.subMenus.filter(sm =>
          ma.subMenus.some(permSm => permSm.subMenuId.toString() === sm._id.toString())
        );
      } else if (menu.subMenus) {
        // If no specific submenu restrictions, include all
        accessibleSubMenus = menu.subMenus;
      }

      return {
        _id: menu._id,
        title: menu.title,
        icon: menu.icon,
        url: menu.url,
        isCollapsible: menu.isCollapsible,
        subMenus: accessibleSubMenus
      };
    }).filter(menu => menu !== null);

    res.json({ success: true, menus: userMenus });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
