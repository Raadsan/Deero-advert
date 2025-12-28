"use client";

import { useState } from "react";
import UserSidebar from "@/components/user/UserSidebar";
import UserHeader from "@/components/user/UserHeader";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default function UserLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <ProtectedRoute requiredRole="user">
            <div className="min-h-screen bg-gray-50 font-sans">
                <UserSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

                <div className="min-h-screen transition-all sm:ml-64">
                    <UserHeader onMenuClick={() => setSidebarOpen(true)} />
                    <main className="p-4 sm:p-6 lg:p-8">
                        {children}
                    </main>
                </div>
            </div>
        </ProtectedRoute>
    );
}

