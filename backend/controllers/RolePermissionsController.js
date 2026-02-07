import RolePermissions from "../models/RolePermissionsModel.js";
import Role from "../models/roleModel.js";
import Menu from "../models/menuModel.js";

// CREATE or UPDATE Role Permissions
export const createOrUpdatePermission = async (req, res) => {
  try {
    const { role, menusAccess } = req.body;

    if (!role) {
      return res.status(400).json({ success: false, message: "Role ID is required" });
    }

    // Verify role exists
    const roleDoc = await Role.findById(role);
    if (!roleDoc) {
      return res.status(404).json({ success: false, message: "Role not found" });
    }

    // Validate menu IDs if provided
    if (menusAccess && menusAccess.length > 0) {
      for (const menuAccess of menusAccess) {
        const menu = await Menu.findById(menuAccess.menuId);
        if (!menu) {
          return res.status(404).json({
            success: false,
            message: `Menu with ID ${menuAccess.menuId} not found`
          });
        }
      }
    }

    // Check if permissions already exist for this role
    let rolePermission = await RolePermissions.findOne({ role: role });

    if (rolePermission) {
      // Update existing permissions
      rolePermission.menusAccess = menusAccess || [];
      await rolePermission.save();

      const updated = await RolePermissions.findById(rolePermission._id)
        .populate("role", "name description")
        .populate("menusAccess.menuId", "title icon url isCollapsible subMenus");

      return res.json({
        success: true,
        message: "Permissions updated successfully",
        permissions: updated
      });
    } else {
      // Create new permissions
      rolePermission = await RolePermissions.create({
        role: role,
        menusAccess: menusAccess || []
      });

      const created = await RolePermissions.findById(rolePermission._id)
        .populate("role", "name description")
        .populate("menusAccess.menuId", "title icon url isCollapsible subMenus");

      return res.status(201).json({
        success: true,
        message: "Permissions created successfully",
        permissions: created
      });
    }
  } catch (err) {
    console.error("Error in createOrUpdatePermission:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET ALL Role Permissions
export const getAllPermissions = async (req, res) => {
  try {
    const permissions = await RolePermissions.find()
      .populate("role", "name description")
      .populate("menusAccess.menuId", "title icon url isCollapsible subMenus");

    res.json({ success: true, permissions });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET Permissions by Role ID
export const getPermissionsByRole = async (req, res) => {
  try {
    const { roleId } = req.params;

    const permissions = await RolePermissions.findOne({ role: roleId })
      .populate("role", "name description")
      .populate("menusAccess.menuId", "title icon url isCollapsible subMenus");

    if (!permissions) {
      return res.status(404).json({
        success: false,
        message: "Permissions not found for this role"
      });
    }

    res.json({ success: true, permissions });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET Permission BY ID
export const getPermissionById = async (req, res) => {
  try {
    const permission = await RolePermissions.findById(req.params.id)
      .populate("role", "name description")
      .populate("menusAccess.menuId", "title icon url isCollapsible subMenus");

    if (!permission) {
      return res.status(404).json({ success: false, message: "Permission not found" });
    }

    res.json({ success: true, permission });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ADD Menu Access to Role
export const addMenuAccess = async (req, res) => {
  try {
    const { roleId } = req.params;
    const { menuId, subMenus } = req.body;

    if (!menuId) {
      return res.status(400).json({ success: false, message: "Menu ID is required" });
    }

    // Verify menu exists
    const menu = await Menu.findById(menuId);
    if (!menu) {
      return res.status(404).json({ success: false, message: "Menu not found" });
    }

    let rolePermission = await RolePermissions.findOne({ role: roleId });

    if (!rolePermission) {
      // Create new permissions if they don't exist
      rolePermission = await RolePermissions.create({
        role: roleId,
        menusAccess: [{ menuId, subMenus: subMenus || [] }]
      });
    } else {
      // Check if menu already exists
      const existingIndex = rolePermission.menusAccess.findIndex(
        ma => ma.menuId.toString() === menuId
      );

      if (existingIndex >= 0) {
        // Update existing menu access
        rolePermission.menusAccess[existingIndex].subMenus = subMenus || [];
      } else {
        // Add new menu access
        rolePermission.menusAccess.push({ menuId, subMenus: subMenus || [] });
      }

      await rolePermission.save();
    }

    const updated = await RolePermissions.findById(rolePermission._id)
      .populate("role", "name description")
      .populate("menusAccess.menuId", "title icon url isCollapsible subMenus");

    res.json({
      success: true,
      message: "Menu access added successfully",
      permissions: updated
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// REMOVE Menu Access from Role
export const removeMenuAccess = async (req, res) => {
  try {
    const { roleId, menuId } = req.params;

    const rolePermission = await RolePermissions.findOne({ role: roleId });

    if (!rolePermission) {
      return res.status(404).json({
        success: false,
        message: "Permissions not found for this role"
      });
    }

    // Remove menu access
    rolePermission.menusAccess = rolePermission.menusAccess.filter(
      ma => ma.menuId.toString() !== menuId
    );

    await rolePermission.save();

    const updated = await RolePermissions.findById(rolePermission._id)
      .populate("role", "name description")
      .populate("menusAccess.menuId", "title icon url isCollapsible subMenus");

    res.json({
      success: true,
      message: "Menu access removed successfully",
      permissions: updated
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE Role Permissions
export const deletePermission = async (req, res) => {
  try {
    const permission = await RolePermissions.findByIdAndDelete(req.params.id);

    if (!permission) {
      return res.status(404).json({ success: false, message: "Permission not found" });
    }

    res.json({ success: true, message: "Permission deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
