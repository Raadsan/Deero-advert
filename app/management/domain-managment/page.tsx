"use client";

import React, { useEffect, useState } from "react";
import DataTable from "@/components/layout/DataTable";
import { Globe } from "lucide-react";
import { getAllDomainPrices } from "@/api/domainPriceApi";

interface DomainPrice {
    _id: string;
    tld: string;
    newPrice: number;
    duration: string;
}

export default function DomainManagementPage() {
    const [data, setData] = useState<DomainPrice[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchDomainPrices = async () => {
        setLoading(true);
        try {
            const res = await getAllDomainPrices();
            // Adjust based on the provided JSON structure: { success: true, prices: [...] }
            const items = (res.data as any).prices || (Array.isArray(res.data) ? res.data : []);
            setData([...items].reverse());
        } catch (err) {
            console.error("Failed to load domain prices", err);
            setData([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDomainPrices();
    }, []);

    const columns = [
        {
            label: "Domain",
            key: "tld",
            render: (row: DomainPrice) => (
                <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded bg-blue-50 text-blue-600">
                        <Globe className="h-4 w-4" />
                    </div>
                    <span className="font-bold text-gray-900 text-base">{row.tld}</span>
                </div>
            ),
        },
        {
            label: "Price",
            key: "newPrice",
            render: (row: DomainPrice) => (
                <div className="flex flex-col">
                    <span className="font-bold text-gray-900 text-base">${row.newPrice.toFixed(2)} USD</span>
                    <span className="text-xs text-[#EB4724]">{row.duration || "1 Year"}</span>
                </div>
            ),
        },
    ];

    return (
        <div className="space-y-6">
            <DataTable
                title="Domain Pricing Management"
                columns={columns}
                data={data}
                onRefresh={fetchDomainPrices}
                loading={loading}
            />
        </div>
    );
}
