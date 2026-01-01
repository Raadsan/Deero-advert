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
    LucideIcon
} from "lucide-react";
import Image from "next/image";
import { logout } from "../../api/authApi";
import { useEffect, useState } from "react";
import { getUserMenus } from "../../api/menuApi";
import { Menu } from "../../types/menu";

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
    newspaper: Newspaper,
    award: Award,
    "message-square": MessageSquare,
    messagesquare: MessageSquare,
    calendar: Calendar,
    folder: Folder,
};

export default function Sidebar({ isOpen, onClose }: { isOpen?: boolean; onClose?: () => void }) {
    const pathname = usePathname();
    const router = useRouter();
    const [menus, setMenus] = useState<Menu[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [expandedMenus, setExpandedMenus] = useState<Set<string>>(new Set());

    useEffect(() => {
        const fetchMenus = async () => {
            try {
                setLoading(true);
                setError(null);

                // Get user from localStorage
                const userStr = localStorage.getItem("user");
                if (!userStr) {
                    setError("User not found. Please login again.");
                    setLoading(false);
                    return;
                }

                const user = JSON.parse(userStr);
                const roleId = user.role?._id || user.role;

                if (!roleId) {
                    setError("Role not found. Please login again.");
                    setLoading(false);
                    return;
                }

                // Fetch menus from API
                const response = await getUserMenus(roleId);

                if (response.success) {
                    setMenus(response.menus);
                } else {
                    setError("Failed to load menus");
                }
            } catch (err: any) {
                console.error("Error fetching menus:", err);
                setError(err.message || "Failed to load menus");
            } finally {
                setLoading(false);
            }
        };

        fetchMenus();
    }, []);

    const handleLogout = () => {
        logout();
        router.push("/login");
    };

    const toggleMenu = (menuId: string) => {
        setExpandedMenus(prev => {
            const newSet = new Set(prev);
            if (newSet.has(menuId)) {
                newSet.delete(menuId);
            } else {
                newSet.add(menuId);
            }
            return newSet;
        });
    };

    const getIcon = (iconName?: string): LucideIcon => {
        if (!iconName) return Folder;
        const normalizedName = iconName.toLowerCase().replace(/\s+/g, "-");
        return iconMap[normalizedName] || Folder;
    };

    const isMenuActive = (menu: Menu): boolean => {
        if (!menu.isCollapsible && menu.url) {
            return pathname === menu.url;
        }
        // Check if any submenu is active
        return menu.subMenus.some(sub => pathname === sub.url);
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
                        {/* Close button for mobile */}
                        <button
                            onClick={onClose}
                            className="rounded-lg p-1 text-white/70 hover:bg-white/10 sm:hidden"
                        >
                            <X className="h-6 w-6" />
                        </button>
                    </div>

                    {/* Navigation Links */}
                    <ul className="flex-1 space-y-1.5 font-medium py-5 overflow-y-auto">
                        {loading ? (
                            <li className="px-4 py-3 text-white/60 text-sm">Loading menus...</li>
                        ) : error ? (
                            <li className="px-4 py-3 text-red-300 text-sm">{error}</li>
                        ) : menus.length === 0 ? (
                            <li className="px-4 py-3 text-white/60 text-sm">No menus available</li>
                        ) : (
                            menus.map((menu, index) => {
                                const Icon = getIcon(menu.icon);
                                const isActive = isMenuActive(menu);
                                const isExpanded = expandedMenus.has(menu._id);

                                if (!menu.isCollapsible && menu.url) {
                                    // Simple link menu
                                    return (
                                        <li key={`${menu._id}-${index}`}>
                                            <Link
                                                href={menu.url}
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

                                // Collapsible menu with submenus
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

                                        {/* Submenus */}
                                        {isExpanded && menu.subMenus.length > 0 && (
                                            <ul className="mt-1 ml-4 space-y-1">
                                                {menu.subMenus.map((submenu, subIndex) => {
                                                    const isSubActive = pathname === submenu.url;
                                                    return (
                                                        <li key={`${submenu._id}-${subIndex}`}>
                                                            <Link
                                                                href={submenu.url}
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

                    {/* Bottom Actions */}
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
