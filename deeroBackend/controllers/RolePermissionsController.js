import { prisma } from "../lib/prisma.js";

// Helper to map Prisma relations to frontend expected names
const mapPermissionResponse = (p) => {
    if (!p) return p;
    if (Array.isArray(p)) return p.map(mapPermissionResponse);

    const newObj = { ...p };
    if (newObj.menusAccess) {
        newObj.menusAccess = newObj.menusAccess.map(ma => {
            const mappedMa = {
                ...ma,
                menuId: ma.menu, // Alias the 'menu' relation to 'menuId' object
                subMenus: (ma.subMenus || []).map(sm => ({
                    ...sm,
                    subMenuId: sm.subMenuId // Ensure integer ID is passed
                }))
            };
            return mappedMa;
        });
    }
    return newObj;
};

// CREATE or UPDATE Role Permissions
export const createOrUpdatePermission = async (req, res) => {
  try {
    const { role: roleId, menusAccess } = req.body;

    if (!roleId) return res.status(400).json({ success: false, message: "Role ID is required" });

    const roleInt = parseInt(roleId);

    // 1. Verify role exists
    const roleDoc = await prisma.role.findUnique({ where: { id: roleInt } });
    if (!roleDoc) return res.status(404).json({ success: false, message: "Role not found" });

    // 2. Clear existing permissions for this role to "sync"
    const existingPerm = await prisma.rolePermission.findUnique({ where: { roleId: roleInt } });
    if (existingPerm) {
        await prisma.permissionSubMenu.deleteMany({
            where: { permissionMenuAccess: { permissionId: existingPerm.id } }
        });
        await prisma.permissionMenuAccess.deleteMany({
            where: { permissionId: existingPerm.id }
        });
        await prisma.rolePermission.delete({ where: { roleId: roleInt } });
    }

    // 3. Create new permission record with nested Menu Access and SubMenus
    const newPermission = await prisma.rolePermission.create({
      data: {
        roleId: roleInt,
        menusAccess: {
          create: (menusAccess || []).map(ma => {
            const mId = parseInt(typeof ma.menuId === 'object' ? (ma.menuId.id || ma.menuId._id) : ma.menuId);
            return {
                menuId: mId,
                subMenus: {
                    create: (ma.subMenus || []).map(sm => {
                        const sId = parseInt(typeof sm.subMenuId === 'object' ? (sm.subMenuId.id || sm.subMenuId._id) : sm.subMenuId);
                        return { subMenuId: sId };
                    })
                }
            };
          })
        }
      },
      include: {
        menusAccess: {
          include: { 
            menu: { include: { subMenus: true } },
            subMenus: true 
          }
        }
      }
    });

    return res.json({
      success: true,
      message: "Permissions updated successfully",
      permission: mapPermissionResponse(newPermission)
    });
  } catch (err) {
    console.error("Permission sync error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET ALL Role Permissions
export const getAllPermissions = async (req, res) => {
  try {
    const permissions = await prisma.rolePermission.findMany({
      include: { 
        role: true, 
        menusAccess: { 
            include: { 
                menu: { include: { subMenus: true } },
                subMenus: true
            } 
        } 
      },
      orderBy: { id: 'desc' }
    });
    res.json({ success: true, permissions: mapPermissionResponse(permissions) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET Permissions by Role ID
export const getPermissionsByRole = async (req, res) => {
  try {
    const { roleId } = req.params;
    const permission = await prisma.rolePermission.findUnique({
      where: { roleId: parseInt(roleId) },
      include: { 
        role: true, 
        menusAccess: { 
            include: { 
                menu: { include: { subMenus: true } },
                subMenus: true
            } 
        } 
      }
    });
    res.json({ success: true, permission: mapPermissionResponse(permission) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ADD Menu Access to Role
export const addMenuAccess = async (req, res) => {
  try {
    const { roleId } = req.params;
    const { menuId, subMenus } = req.body;

    const roleInt = parseInt(roleId);
    const menuInt = parseInt(menuId);

    let permission = await prisma.rolePermission.findUnique({ where: { roleId: roleInt } });
    
    if (!permission) {
        permission = await prisma.rolePermission.create({
            data: { roleId: roleInt }
        });
    }

    const menuAccess = await prisma.permissionMenuAccess.create({
        data: {
            permissionId: permission.id,
            menuId: menuInt,
            subMenus: {
                create: (subMenus || []).map(smId => ({
                    subMenuId: parseInt(smId)
                }))
            }
        },
        include: { 
            menu: { include: { subMenus: true } },
            subMenus: true
        }
    });

    res.json({ success: true, message: "Menu access added successfully", menuAccess: mapPermissionResponse(menuAccess) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// REMOVE Menu Access from Role
export const removeMenuAccess = async (req, res) => {
  try {
    const { roleId, menuId } = req.params;
    const roleInt = parseInt(roleId);
    const menuInt = parseInt(menuId);

    const permission = await prisma.rolePermission.findUnique({ where: { roleId: roleInt } });
    if (!permission) return res.status(404).json({ success: false, message: "Permission not found" });

    // Delete submenus first (cascading cleanup)
    const menuAccess = await prisma.permissionMenuAccess.findFirst({
        where: { permissionId: permission.id, menuId: menuInt }
    });

    if (menuAccess) {
        await prisma.permissionSubMenu.deleteMany({
            where: { permissionMenuAccessId: menuAccess.id }
        });
        await prisma.permissionMenuAccess.delete({
            where: { id: menuAccess.id }
        });
    }

    res.json({ success: true, message: "Menu access removed successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
