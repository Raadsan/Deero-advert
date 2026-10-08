"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { getToken, getUser, isStaff, isUser } from "@/utils/auth";
import { canAccessStaffPath } from "@/utils/menuAccess";

interface ProtectedRouteProps {
    children: React.ReactNode;
    requiredRole?: "staff" | "user" | "any";
    enforceMenuAccess?: boolean;
}

export default function ProtectedRoute({
    children,
    requiredRole = "any",
    enforceMenuAccess = true,
}: ProtectedRouteProps) {
    const router = useRouter();
    const pathname = usePathname();
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        const checkAuth = async () => {
            const token = getToken();
            const user = getUser();

            if (!token || !user) {
                if (isMounted) {
                    setIsAuthorized(false);
                    setIsLoading(false);
                }
                router.push("/login");
                return;
            }

            if (requiredRole === "staff") {
                if (!isStaff()) {
                    if (isMounted) {
                        setIsAuthorized(false);
                        setIsLoading(false);
                    }
                    router.push("/");
                    return;
                }

                if (enforceMenuAccess) {
                    const allowed = await canAccessStaffPath(pathname || "/dashboard");
                    if (!allowed) {
                        if (isMounted) {
                            setIsAuthorized(false);
                            setIsLoading(false);
                        }
                        router.push("/dashboard");
                        return;
                    }
                }
            } else if (requiredRole === "user") {
                if (!isUser()) {
                    if (isMounted) {
                        setIsAuthorized(false);
                        setIsLoading(false);
                    }
                    router.push("/dashboard");
                    return;
                }
            }

            if (isMounted) {
                setIsAuthorized(true);
                setIsLoading(false);
            }
        };

        // Keep the shell mounted across navigations — only the first auth check
        // shows the full-page loader. Path changes re-check access in place.
        checkAuth();

        return () => {
            isMounted = false;
        };
    }, [router, pathname, requiredRole, enforceMenuAccess]);

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
