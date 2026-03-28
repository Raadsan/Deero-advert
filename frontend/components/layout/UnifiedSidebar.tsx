"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
    LayoutDashboard,
    Users,
    Settings,
    FileText,
    BarChart3,
    LogOut,
    X,
    Briefcase,
    Newspaper,
    Award,
    MessageSquare,
    Calendar,
    ChevronDown,
    ChevronRight,
    Folder,
    LucideIcon,
    Package,
    Heart,
    ShoppingBag,
    Globe,
    CreditCard,
    User
} from "lucide-react";
import Image from "next/image";
import { logout } from "@/api-client/authApi";
import { useEffect, useState } from "react";
import { getUserMenus } from "@/api-client/menuApi";
import { getUser, isAdminOrManager } from "@/utils/auth";
import { Menu } from "@/types/menu";
import { Users as UsersIcon } from "lucide-react"; // Rename to avoid confusion with the mapping

// Icon mapping from string names to Lucide components
const iconMap: Record<string, LucideIcon> = {
    dashboard: LayoutDashboard,
    "layout-dashboard": LayoutDashboard,
    users: Users,
    settings: Settings,
    "file-text": FileText,
    filetext: FileText,
    "bar-chart": BarChart3,
    barchart: BarChart3,
    briefcase: Briefcase,
    career: Briefcase,
    newspaper: Newspaper,
    news: Newspaper,
    blogs: Newspaper,
    award: Award,
    achievements: Award,
    "message-square": MessageSquare,
    messagesquare: MessageSquare,
    testimonials: MessageSquare,
    calendar: Calendar,
    "events-news": Calendar,
    folder: Folder,
    package: Package,
    services: Package,
    "shopping-bag": ShoppingBag,
    shoppingbag: ShoppingBag,
    globe: Globe,
    heart: Heart,
    "credit-card": CreditCard,
    creditcard: CreditCard,
    "my domains": Globe,
    "my services": Package,
    "my orders": ShoppingBag,
    documents: FileText,
    favorites: Heart,
    payments: CreditCard,
    roles: Users,
    "role-permissions": Settings,
    menus: Settings,
    announcements: Calendar,
    "major-clients": Users,
    domains: Globe,
    teams: Users,
    management: LayoutDashboard,
};

export default function UnifiedSidebar({ isOpen, onClose }: { isOpen?: boolean; onClose?: () => void }) {
    const pathname = usePathname();
    const router = useRouter();
    const [menus, setMenus] = useState<Menu[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [expandedMenuId, setExpandedMenuId] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;
        const fetchMenus = async () => {
            try {
                if (isMounted) {
                    setLoading(true);
                    setError(null);
                }

                const user = getUser();
                if (!user) {
                    if (isMounted) {
                        setError("User not found. Please login again.");
                        setLoading(false);
                    }
                    return;
                }

                const roleId = user.role?._id || user.role;

                if (!roleId) {
                    if (isMounted) {
                        setError("Role not found. Please login again.");
                        setLoading(false);
                    }
                    return;
                }

                // Try to get menus for this role
                try {
                    const response = await getUserMenus(typeof roleId === 'object' ? roleId._id : roleId);
                    if (isMounted) {
                        if (response && response.menus) {
                            // Filter out Domain Management from menus and submenus
                            const filteredMenus = response.menus.filter((m: Menu) =>
                                m.title !== "Domain Managment" && m.title !== "Domain Management"
                            ).map((m: Menu) => ({
                                ...m,
                                subMenus: m.subMenus.filter((sm: any) =>
                                    sm.title !== "Domain Managment" && sm.title !== "Domain Management"
                                )
                            }));
                            setMenus(filteredMenus);
                        } else {
                            setMenus([]);
                        }
                    }
                } catch (innerErr: any) {
                    if (innerErr.code === "ERR_CANCELED" || innerErr.name === "CanceledError") {
                        console.log("Menu fetch canceled");
                        return;
                    }
                    throw innerErr;
                }

            } catch (err: any) {
                console.error("Error fetching menus:", err);
                if (isMounted) setError(err.message || "Failed to load menus");
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        fetchMenus();

        return () => {
            isMounted = false;
        };
    }, []);

    // Auto-expand the active menu section
    useEffect(() => {
        if (menus.length > 0 && pathname) {
            const activeMenu = menus.find(menu =>
                menu.isCollapsible && menu.subMenus.some(sub => pathname === sub.url)
            );
            if (activeMenu) {
                setExpandedMenuId(activeMenu._id);
            }
        }
    }, [menus, pathname]);

    const handleLogout = () => {
        logout();
        router.push("/login");
    };

    const toggleMenu = (menuId: string) => {
        setExpandedMenuId(prev => (prev === menuId ? null : menuId));
    };

    const getIcon = (iconName?: string): LucideIcon => {
        if (!iconName) return Folder;
        const normalizedName = iconName.toLowerCase().replace(/\s+/g, "-");
        return iconMap[normalizedName] || iconMap[iconName.toLowerCase()] || Folder;
    };

    const ensureAbsoluteUrl = (url?: string) => {
        if (!url) return "#";
        return url.startsWith("/") ? url : `/${url}`;
    };

    const isMenuActive = (menu: Menu): boolean => {
        const absoluteUrl = ensureAbsoluteUrl(menu.url);
        if (!menu.isCollapsible && menu.url) {
            return pathname === absoluteUrl;
        }
        return menu.subMenus.some(sub => pathname === ensureAbsoluteUrl(sub.url));
    };

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 sm:hidden"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed left-0 top-0 z-50 h-screen w-64 bg-[#651313] text-white transition-transform duration-300 ease-in-out sm:translate-x-0 ${isOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
            >
                <div className="flex h-full flex-col px-3 pt-2 pb-4">
                    {/* Header / Logo */}
                    <div className="mb-2 flex items-center justify-between pl-2.5 pr-2">
                        <div className="flex justify-center w-full">
                            <Image
                                src="/4 (2).png"
                                alt="Deero Advert"
                                width={180}
                                height={60}
                                className="brightness-0 invert object-contain h-auto max-w-full"
                                priority
                            />
                        </div>
                        <button
                            onClick={onClose}
                            className="rounded-lg p-1 text-white/70 hover:bg-white/10 sm:hidden"
                        >
                            <X className="h-6 w-6" />
                        </button>
                    </div>

                    {/* Navigation Links - Scrollable but with hidden scrollbar for a cleaner look */}
                    <ul className="flex-1 space-y-1.5 font-medium py-5 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                        {loading ? (
                            <li className="px-4 py-3 text-white/60 text-sm">Loading menus...</li>
                        ) : error ? (
                            <li className="px-4 py-3 text-red-300 text-sm">{error}</li>
                        ) : menus.length === 0 ? (
                            <li className="px-4 py-3 text-white/60 text-sm">No menus available</li>
                        ) : (
                            menus.map((menu, index) => {
                                const Icon = getIcon(menu.icon || menu.title);
                                const isActive = isMenuActive(menu);
                                const isExpanded = expandedMenuId === menu._id;

                                if (!menu.isCollapsible && menu.url) {
                                    return (
                                        <li key={`${menu._id}-${index}`}>
                                            <Link
                                                href={ensureAbsoluteUrl(menu.url)}
                                                onClick={onClose}
                                                className={`flex items-center rounded-lg px-4 py-3 transition-colors hover:bg-white/10 ${isActive
                                                    ? "bg-[#EB4724] text-white shadow-md"
                                                    : "text-white/80 hover:text-white"
                                                    }`}
                                            >
                                                <Icon className="h-5 w-5 flex-shrink-0" />
                                                <span className="ml-3 text-sm font-medium tracking-wide">
                                                    {menu.title}
                                                </span>
                                            </Link>
                                        </li>
                                    );
                                }

                                return (
                                    <li key={`${menu._id}-${index}`}>
                                        <button
                                            onClick={() => toggleMenu(menu._id)}
                                            className={`flex w-full items-center justify-between rounded-lg px-4 py-3 transition-colors hover:bg-white/10 ${isActive
                                                ? "bg-[#EB4724] text-white shadow-md"
                                                : "text-white/80 hover:text-white"
                                                }`}
                                        >
                                            <div className="flex items-center">
                                                <Icon className="h-5 w-5 flex-shrink-0" />
                                                <span className="ml-3 text-sm font-medium tracking-wide">
                                                    {menu.title}
                                                </span>
                                            </div>
                                            {isExpanded ? (
                                                <ChevronDown className="h-4 w-4" />
                                            ) : (
                                                <ChevronRight className="h-4 w-4" />
                                            )}
                                        </button>

                                        {isExpanded && menu.subMenus.length > 0 && (
                                            <ul className="mt-1 ml-4 space-y-1">
                                                {menu.subMenus.map((submenu, subIndex) => {
                                                    const subUrl = ensureAbsoluteUrl(submenu.url);
                                                    const isSubActive = pathname === subUrl;
                                                    return (
                                                        <li key={`${submenu._id}-${subIndex}`}>
                                                            <Link
                                                                href={subUrl}
                                                                onClick={onClose}
                                                                className={`flex items-center rounded-lg px-4 py-2 pl-8 text-sm transition-colors hover:bg-white/10 ${isSubActive
                                                                    ? "bg-white/20 text-white font-medium"
                                                                    : "text-white/70 hover:text-white"
                                                                    }`}
                                                            >
                                                                {submenu.title}
                                                            </Link>
                                                        </li>
                                                    );
                                                })}
                                            </ul>
                                        )}
                                    </li>
                                );
                            })
                        )}


                    </ul>

                    <div className="mt-auto border-t border-white/10 pt-4">
                        <button
                            onClick={handleLogout}
                            className="flex w-full items-center rounded-lg px-4 py-3 text-white/80 transition-colors hover:bg-white/10 hover:text-white"
                        >
                            <LogOut className="h-5 w-5 flex-shrink-0" />
                            <span className="ml-3 text-sm font-medium">Logout</span>
                        </button>
                    </div>
                </div>
            </aside>
        </>
    );
}

