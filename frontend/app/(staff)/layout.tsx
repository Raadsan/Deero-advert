"use client";

import StaffAppShell from "@/components/layout/StaffAppShell";

export default function StaffLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <StaffAppShell>{children}</StaffAppShell>;
}
