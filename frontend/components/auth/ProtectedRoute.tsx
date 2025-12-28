"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { getToken, getUser, isAdmin, isUser } from "@/utils/auth";

interface ProtectedRouteProps {
    children: React.ReactNode;
    requiredRole?: "admin" | "user" | "any";
}

export default function ProtectedRoute({ children, requiredRole = "any" }: ProtectedRouteProps) {
    const router = useRouter();
    const pathname = usePathname();
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkAuth = () => {
            const token = getToken();
            const user = getUser();

            // If no token, redirect to login
            if (!token || !user) {
                router.push("/login");
                return;
            }

            // Check role-based access
            if (requiredRole === "admin") {
                if (!isAdmin()) {
                    // User is not admin, redirect to user dashboard
                    router.push("/user");
                    return;
                }
            } else if (requiredRole === "user") {
                if (!isUser() || isAdmin()) {
                    // User is admin trying to access user routes, redirect to admin
                    if (isAdmin()) {
                        router.push("/admin");
                        return;
                    }
                    // Not authenticated as user
                    router.push("/login");
                    return;
                }
            }

            // Authorized
            setIsAuthorized(true);
            setIsLoading(false);
        };

        checkAuth();
    }, [router, pathname, requiredRole]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#651313] border-r-transparent"></div>
                    <p className="mt-4 text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    if (!isAuthorized) {
        return null;
    }

    return <>{children}</>;
}

