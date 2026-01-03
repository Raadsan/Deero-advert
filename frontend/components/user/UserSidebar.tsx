"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Package, FileText, Settings, LogOut, X, Heart, ShoppingBag, Globe, CreditCard, User } from "lucide-react";
import Image from "next/image";
import { logout } from "../../api/authApi";
import { getUserMenus } from "../../api/menuApi";
import { getUser } from "../../utils/auth";

const iconMapping: { [key: string]: any } = {
    "Dashboard": LayoutDashboard,
    "My Domains": Globe,
    "My Services": Package,
    "My Orders": ShoppingBag,
    "Documents": FileText,
    "Favorites": Heart,
    "Settings": Settings,
    "Payments": CreditCard,
    "Profile": User,
};

export default function UserSidebar({ isOpen, onClose }: { isOpen?: boolean; onClose?: () => void }) {
    const pathname = usePathname();
    const router = useRouter();
    const [menuItems, setMenuItems] = useState<any[]>([]);

    useEffect(() => {
        const fetchMenus = async () => {
            try {
                const user = getUser();
                if (user && user.role) {
                    const roleId = typeof user.role === 'object' ? user.role._id : user.role;
                    // If user.role is just a string name like 'user', we might need to look up the ID or the backend handles names? 
                    // Assuming roleId is what we need. If it fails, we might need a fallback.
                    // Actually api expects roleId.
                    const response = await getUserMenus(roleId);
                    if (response && response.menus) {
                        setMenuItems(response.menus);
                    }
                }
            } catch (error) {
                console.error("Failed to fetch user menus:", error);
            }
        };

        fetchMenus();
    }, []);

    const handleLogout = () => {
        logout();
        router.push("/login");
    };

    const displayLinks = menuItems.length > 0 ? menuItems : [];

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
                    <ul className="flex-1 space-y-1.5 font-medium   py-5">
                        {displayLinks.map((link) => {
                            // Backend might return title/url/icon or similar. Adjust matching.
                            // Assuming link has { title, url, icon }
                            const Icon = iconMapping[link.title] || FileText;
                            const isActive = pathname === link.url;

                            return (
                                <li key={link.url}>
                                    <Link
                                        href={link.url}
                                        onClick={onClose} // Auto-close on mobile nav
                                        className={`flex items-center rounded-lg px-4 py-3 transition-colors hover:bg-white/10 ${isActive ? "bg-[#EB4724] text-white shadow-md" : "text-white/80 hover:text-white"
                                            }`}
                                    >
                                        <Icon className="h-5 w-5 flex-shrink-0" />
                                        <span className="ml-3 text-sm font-medium tracking-wide">{link.title}</span>
                                    </Link>
                                </li>
                            );
                        })}
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

