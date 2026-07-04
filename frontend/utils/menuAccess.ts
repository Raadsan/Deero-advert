import { Menu } from "@/types/menu";
import { getUser, isAdmin, normalizeStaffMenuUrl } from "@/utils/auth";

const ALWAYS_ALLOWED_STAFF_PATHS = ["/dashboard"];

const normalizePath = (path: string) => {
    const clean = path.replace(/\\/g, "/").trim();
    const withSlash = clean.startsWith("/") ? clean : `/${clean}`;
    return withSlash.replace(/\/+$/, "") || "/";
};

export const collectAllowedStaffPaths = (menus: Menu[] = []) => {
    const paths = new Set<string>(ALWAYS_ALLOWED_STAFF_PATHS);

    menus.forEach((menu) => {
        if (!menu.isCollapsible && menu.url) {
            paths.add(normalizeStaffMenuUrl(menu.url));
        }

        menu.subMenus?.forEach((submenu) => {
            if (submenu.url) {
                paths.add(normalizeStaffMenuUrl(submenu.url));
            }
        });
    });

    return Array.from(paths).map(normalizePath);
};

export const expandAllowedStaffPaths = (paths: string[]) => {
    const expanded = new Set(paths.map(normalizePath));

    if (paths.some((path) => normalizePath(path).startsWith("/management"))) {
        expanded.add("/management");
    }

    if (paths.some((path) => normalizePath(path).startsWith("/config"))) {
        expanded.add("/config");
    }

    if (paths.some((path) => normalizePath(path).startsWith("/requests") || normalizePath(path).startsWith("/request"))) {
        expanded.add("/requests");
        expanded.add("/request");
    }

    return Array.from(expanded);
};

export const isStaffPathAllowed = (pathname: string, allowedPaths: string[]) => {
    const expandedPaths = expandAllowedStaffPaths(allowedPaths);
    const current = normalizePath(pathname);

    return expandedPaths.some((allowed) => {
        const normalizedAllowed = normalizePath(allowed);
        return current === normalizedAllowed || current.startsWith(`${normalizedAllowed}/`);
    });
};

export const getRoleIdFromUser = (user: any) => {
    if (!user) return null;
    return user.roleId || user.role?.id || user.role?._id || user.role || null;
};

let cachedMenuAccess: { roleId: string; paths: string[] } | null = null;

export const loadAllowedStaffPaths = async () => {
    const user = getUser();
    const roleId = getRoleIdFromUser(user);

    if (!roleId) return [];

    const roleKey = String(roleId);
    if (cachedMenuAccess?.roleId === roleKey) {
        return cachedMenuAccess.paths;
    }

    const { getUserMenus } = await import("@/api-client/menuApi");
    const response = await getUserMenus(roleKey);
    const paths = collectAllowedStaffPaths(response?.menus || []);

    cachedMenuAccess = { roleId: roleKey, paths };
    return paths;
};

export const clearMenuAccessCache = () => {
    cachedMenuAccess = null;
};

export const canAccessStaffPath = async (pathname: string) => {
    if (isAdmin()) return true;

    const allowedPaths = await loadAllowedStaffPaths();
    return isStaffPathAllowed(pathname, allowedPaths);
};
