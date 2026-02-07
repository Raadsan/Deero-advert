"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Bell, Search, Menu, LogOut, User } from "lucide-react";
import { logout } from "../../api/authApi";

export default function UnifiedHeader({ onMenuClick }: { onMenuClick: () => void }) {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [showDropdown, setShowDropdown] = useState(false);
    const [portalTitle, setPortalTitle] = useState("Portal");

    useEffect(() => {
        const userData = localStorage.getItem("user");
        if (userData) {
            try {
                const parsedUser = JSON.parse(userData);
                setUser(parsedUser);

                const role = parsedUser.role;
                const roleName = (typeof role === 'object' && role?.name) ? role.name.toLowerCase() : 'user';

                // Unified title for all portals
                const formattedRole = roleName.charAt(0).toUpperCase() + roleName.slice(1);
                setPortalTitle(`${formattedRole} Dashboard`);
            } catch (e) {
                console.error("Error parsing user data", e);
            }
        }
    }, []);

    const handleLogout = () => {
        logout();
        setShowDropdown(false);
        router.push("/login"); // Consistent logout redirect
    };

    return (
        <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-gray-200 bg-white px-4 shadow-sm sm:px-6 lg:px-8">
            <div className="flex items-center gap-4">
                <button
                    type="button"
                    className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 sm:hidden"
                    onClick={onMenuClick}
                >
                    <span className="sr-only">Open sidebar</span>
                    <Menu className="h-6 w-6" />
                </button>
                <div className="hidden md:block">
                    <h1 className="text-xl font-bold text-[#651313]">{portalTitle}</h1>
                </div>
            </div>

            <div className="flex items-center gap-4">
                <div className="relative hidden sm:block">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                    <input
                        type="text"
                        placeholder="Search..."
                        className="h-10 w-64 rounded-full border border-gray-200 bg-gray-50 pl-9 pr-4 text-sm text-gray-900 focus:border-[#EB4724] focus:outline-none focus:ring-1 focus:ring-[#EB4724]"
                    />
                </div>

                <button className="relative rounded-full p-2 text-gray-500 hover:bg-gray-100">
                    <Bell className="h-5 w-5" />
                    <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-[#EB4724]"></span>
                </button>

                <div className="relative">
                    <button
                        onClick={() => setShowDropdown(!showDropdown)}
                        className="h-8 w-8 overflow-hidden rounded-full bg-gray-200 hover:ring-2 hover:ring-[#EB4724] transition-all"
                    >
                        {user?.fullname ? (
                            <div className="flex h-full w-full items-center justify-center bg-[#651313] text-xs font-medium text-white">
                                {user.fullname.charAt(0).toUpperCase()}
                                {user.fullname.split(" ")[1]?.charAt(0).toUpperCase() || ""}
                            </div>
                        ) : (
                            <div className="flex h-full w-full items-center justify-center bg-[#651313] text-xs font-medium text-white">
                                <User className="h-4 w-4" />
                            </div>
                        )}
                    </button>

                    {showDropdown && (
                        <>
                            <div
                                className="fixed inset-0 z-10"
                                onClick={() => setShowDropdown(false)}
                            />
                            <div className="absolute right-0 mt-2 w-48 rounded-lg border border-gray-200 bg-white shadow-lg z-20">
                                <div className="p-3 border-b border-gray-100">
                                    <p className="text-sm font-semibold text-gray-900">{user?.fullname || portalTitle.split(" ")[0]}</p>
                                    <p className="text-xs text-gray-500">{user?.email || ""}</p>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                >
                                    <LogOut className="h-4 w-4" />
                                    Logout
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}
