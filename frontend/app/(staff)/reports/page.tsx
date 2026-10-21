"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ReportsIndexPage() {
    const router = useRouter();

    useEffect(() => {
        router.replace("/reports/transactions");
    }, [router]);

    return (
        <div className="flex min-h-[50vh] items-center justify-center">
            <div className="text-center">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#651313] border-r-transparent"></div>
                <p className="mt-3 text-sm text-gray-500 font-medium">Loading Reports...</p>
            </div>
        </div>
    );
}
