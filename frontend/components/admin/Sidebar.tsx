"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Users, Settings, FileText, BarChart3, LogOut, X, Briefcase, Newspaper, Award, MessageSquare, Calendar } from "lucide-react";
import Image from "next/image";
import { logout } from "../../api/authApi";

const sidebarLinks = [
    { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { label: "Users", href: "/admin/users", icon: Users },
    { label: "Services", href: "/admin/services", icon: Briefcase },
    { label: "Blogs", href: "/admin/blogs", icon: Newspaper },
    { label: "Achievements", href: "/admin/achievements", icon: Award },
    { label: "Testimonials", href: "/admin/testmonial", icon: MessageSquare },
    { label: "Events & News", href: "/admin/events-news", icon: Calendar },
    { label: "Reports", href: "/admin/reports", icon: FileText },
];

export default function Sidebar({ isOpen, onClose }: { isOpen?: boolean; onClose?: () => void }) {
    const pathname = usePathname();
    const router = useRouter();

    const handleLogout = () => {
        logout();
        router.push("/login");
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
                    <ul className="flex-1 space-y-1.5 font-medium   py-5">
                        {sidebarLinks.map((link) => {
                            const Icon = link.icon;
                            const isActive = pathname === link.href;

                            return (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        onClick={onClose} // Auto-close on mobile nav
                                        className={`flex items-center rounded-lg px-4 py-3 transition-colors hover:bg-white/10 ${isActive ? "bg-[#EB4724] text-white shadow-md" : "text-white/80 hover:text-white"
                                            }`}
                                    >
                                        <Icon className="h-5 w-5 flex-shrink-0" />
                                        <span className="ml-3 text-sm font-medium tracking-wide">{link.label}</span>
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
