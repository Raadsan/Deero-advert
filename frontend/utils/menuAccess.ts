import { Menu } from "@/types/menu";
import { getUser, isAdmin, isUser, normalizeStaffMenuUrl } from "@/utils/auth";

const ALWAYS_ALLOWED_STAFF_PATHS = ["/dashboard"];

/** Default portal links for role "user" when Role Permissions has no menus assigned */
export const DEFAULT_CLIENT_MENUS: Menu[] = [
    {
        _id: "client-dashboard",
        title: "Dashboard",
        icon: "dashboard",
        url: "/user",
        isCollapsible: false,
        subMenus: [],
    },
    {
        _id: "client-payments",
        title: "My Payments",
        icon: "payments",
        url: "/payments",
        isCollapsible: false,
        subMenus: [],
    },
    {
        _id: "client-services",
        title: "My Services",
        icon: "my services",
        url: "/user/my-services",
        isCollapsible: false,
        subMenus: [],
    },
    {
        _id: "client-domains",
        title: "My Domains",
        icon: "my domains",
        url: "/user/domains",
        isCollapsible: false,
        subMenus: [],
    },
    {
        _id: "client-hosting",
        title: "My Hosting",
        icon: "package",
        url: "/my-hosting",
        isCollapsible: false,
        subMenus: [],
    },
];

/** Flatten menus into simple { title, url } links for profile dropdowns */
export const flattenMenuLinks = (menus: Menu[] = []) => {
    const links: { title: string; url: string }[] = [];
    menus.forEach((menu) => {
        if (!menu.isCollapsible && menu.url) {
            links.push({ title: menu.title, url: normalizeStaffMenuUrl(menu.url) });
        }
        menu.subMenus?.forEach((sub) => {
            if (sub.url) {
                links.push({ title: sub.title, url: normalizeStaffMenuUrl(sub.url) });
            }
        });
    });
    return links;
};

/** Map staff request/CRM URLs to the client "my …" portal pages (role user) */
const CLIENT_URL_MAP: Record<string, string> = {
    "/dashboard": "/user",
    "/requests/domain-requests": "/user/domains",
    "/requests/service-requests": "/user/my-services",
    "/requests/hosting-requests": "/my-hosting",
    "/request/domains": "/user/domains",
    "/request/request-service": "/user/my-services",
    "/request/request-hosting-packages": "/my-hosting",
};

const mapClientMenuUrl = (url?: string) => {
    if (!url) return url;
    const normalized = normalizeStaffMenuUrl(url);
    return CLIENT_URL_MAP[normalized] || normalized;
};

/** For role "user": remap staff menu URLs to client portal pages */
export const adaptMenusForClient = (menus: Menu[] = []): Menu[] =>
    menus.map((menu) => ({
        ...menu,
        url: menu.url ? mapClientMenuUrl(menu.url) : menu.url,
        subMenus: (menu.subMenus || []).map((sub) => ({
            ...sub,
            url: mapClientMenuUrl(sub.url) || sub.url,
        })),
    }));

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

let cachedMenuAccess: { roleId: string; paths: string[]; menus: Menu[] } | null = null;

const filterMenus = (menus: Menu[] = []) =>
    menus
        .filter(
            (m) => m.title !== "Domain Managment" && m.title !== "Domain Management"
        )
        .map((m) => ({
            ...m,
            subMenus: (m.subMenus || []).filter(
                (sm) => sm.title !== "Domain Managment" && sm.title !== "Domain Management"
            ),
        }));

export const getCachedStaffMenus = (): Menu[] | null => {
    const user = getUser();
    const roleId = getRoleIdFromUser(user);
    if (!roleId || !cachedMenuAccess) return null;
    if (cachedMenuAccess.roleId !== String(roleId)) return null;
    return cachedMenuAccess.menus;
};

export const loadStaffMenus = async (): Promise<Menu[]> => {
    const user = getUser();
    const roleId = getRoleIdFromUser(user);

    if (!roleId) {
        // Client with missing roleId still gets a usable portal menu
        return isUser() ? DEFAULT_CLIENT_MENUS : [];
    }

    const roleKey = String(roleId);
    if (cachedMenuAccess?.roleId === roleKey) {
        return cachedMenuAccess.menus;
    }

    const { getUserMenus } = await import("@/api-client/menuApi");
    const response = await getUserMenus(roleKey);
    let menus = filterMenus(response?.menus || []);

    // Role "user": if admin assigned no menus yet, show default client portal links
    if (menus.length === 0 && isUser()) {
        menus = DEFAULT_CLIENT_MENUS;
    } else if (isUser()) {
        // Permissions assigned for requests → show in sidebar as client's own pages
        menus = adaptMenusForClient(menus);
        // Always keep Dashboard first for clients
        const hasDashboard = menus.some(
            (m) => !m.isCollapsible && (m.url === "/user" || m.title.toLowerCase() === "dashboard")
        );
        if (!hasDashboard) {
            menus = [DEFAULT_CLIENT_MENUS[0], ...menus];
        }
    }

    const paths = collectAllowedStaffPaths(menus);

    cachedMenuAccess = { roleId: roleKey, paths, menus };
    return menus;
};

export const loadAllowedStaffPaths = async () => {
    const menus = await loadStaffMenus();
    const user = getUser();
    const roleId = getRoleIdFromUser(user);
    if (!roleId) return [];

    if (cachedMenuAccess?.roleId === String(roleId)) {
        return cachedMenuAccess.paths;
    }

    return collectAllowedStaffPaths(menus);
};

export const clearMenuAccessCache = () => {
    cachedMenuAccess = null;
};

export const canAccessStaffPath = async (pathname: string) => {
    if (isAdmin()) return true;

    const allowedPaths = await loadAllowedStaffPaths();
    return isStaffPathAllowed(pathname, allowedPaths);
};
