export const checkPermission = (permissionKey) => {
  return async (req, res, next) => {
    await req.user.populate({
      path: "role",
      populate: { path: "permissions" },
    });

    const hasPermission = req.user.role.permissions.some(
      (p) => p.key === permissionKey
    );

    if (!hasPermission) {
      return res.status(403).json({ message: "Access denied" });
    }

    next();
  };
};
