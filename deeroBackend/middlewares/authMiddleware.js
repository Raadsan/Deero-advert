import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma.js";

const ADMIN_ROLE_NAMES = new Set(["admin", "superadmin", "super admin", "owner"]);

const normalizePermissionValue = (value) =>
  String(value || "")
    .toLowerCase()
    .replace(/[\s/_-]+/g, "");

const userHasAdminBypass = (user) =>
  ADMIN_ROLE_NAMES.has(String(user?.role?.name || "").toLowerCase().trim());

const getRoleMenuAccess = async (roleId) => {
  const permission = await prisma.rolePermission.findUnique({
    where: { roleId },
    include: {
      menusAccess: {
        include: {
          menu: true,
        },
      },
    },
  });

  return permission?.menusAccess || [];
};

const hasMenuPermission = (menusAccess, aliases) => {
  const normalizedAliases = aliases.map(normalizePermissionValue).filter(Boolean);

  return menusAccess.some(({ menu }) => {
    const candidates = [menu?.title, menu?.url]
      .map(normalizePermissionValue)
      .filter(Boolean);

    return normalizedAliases.some((alias) =>
      candidates.some(
        (candidate) =>
          candidate === alias ||
          candidate.includes(alias) ||
          alias.includes(candidate)
      )
    );
  });
};

export const protect = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret");
    const user = await prisma.user.findUnique({
      where: { id: parseInt(decoded.userId) },
      include: { role: true }
    });

    if (!user) return res.status(401).json({ message: "User no longer exists" });

    req.user = user;
    next();
  } catch (error) {
    const name = error?.name;
    if (name === "JsonWebTokenError" || name === "TokenExpiredError") {
      // Token hore / JWT_SECRET kala duwan — caadi; ha buuxin logs-ka Railway
      console.warn(`Auth: ${name} (${error.message})`);
    } else {
      console.error("Auth error:", error);
    }
    res.status(401).json({ message: "Unauthorized" });
  }
};

export const authorizeMenuAccess = (...menuAliases) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      if (userHasAdminBypass(req.user)) {
        return next();
      }

      if (!req.user.roleId || menuAliases.length === 0) {
        return res.status(403).json({ message: "Forbidden" });
      }

      const menusAccess = await getRoleMenuAccess(req.user.roleId);
      if (!hasMenuPermission(menusAccess, menuAliases)) {
        return res.status(403).json({
          message: "You do not have permission to perform this action.",
        });
      }

      next();
    } catch (error) {
      console.error("Authorization error:", error);
      res.status(500).json({ message: "Failed to verify permissions" });
    }
  };
};

export const allowSelfOrMenuAccess = (...menuAliases) => {
  const authorize = authorizeMenuAccess(...menuAliases);

  return async (req, res, next) => {
    const targetId = req.params.id || req.params.userId || req.query.userId;
    if (req.user && targetId && String(req.user.id) === String(targetId)) {
      return next();
    }

    return authorize(req, res, next);
  };
};
