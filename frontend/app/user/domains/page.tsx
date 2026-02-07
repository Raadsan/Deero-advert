"use client";
export const dynamic = 'force-static';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated, getUserId } from "@/utils/auth";
import { getTransactionsByUser } from "@/api/transactionApi";
import DataTable from "@/components/layout/DataTable";
import { GlobeAltIcon } from "@heroicons/react/24/outline";

export default function UserDomainsPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [domains, setDomains] = useState<any[]>([]);

    useEffect(() => {
        const fetchDomainsAndTransactions = async () => {
            if (!isAuthenticated()) {
                router.push("/login?redirect=/user/domains");
                return;
            }

            try {
                const userId = getUserId();
                if (userId) {
                    const [transactionsRes] = await Promise.all([
                        getTransactionsByUser(userId)
                    ]);

                    if (transactionsRes.data.success) {
                        const transactions = transactionsRes.data.transactions || [];
                        const validDomains: any[] = [];

                        transactions.forEach((t: any) => {
                            if (t.status === "completed" && (t.type === 'register' || t.domainName || t.domain)) {
                                // Extract domain name
                                let name = t.domainName || (typeof t.domain === 'object' ? t.domain.name : t.domain);

                                // Fallback: If it looks like an ObjectId (24 hex chars) or is missing, try description
                                if (!name || (typeof name === 'string' && name.length === 24 && /^[0-9a-fA-F]{24}$/.test(name))) {
                                    if (t.description) {
                                        if (t.description.includes("Payment for domain - ")) {
                                            name = t.description.replace("Payment for domain - ", "").trim();
                                        } else if (t.description.includes("Domain Registration: ")) {
                                            name = t.description.replace("Domain Registration: ", "").trim();
                                        }
                                    }
                                }

                                if (name && !(typeof name === 'string' && name.length === 24 && /^[0-9a-fA-F]{24}$/.test(name))) {
                                    validDomains.push({
                                        _id: t._id, // Use transaction ID as key
                                        name: name,
                                        status: "registered",
                                        registrationDate: t.createdAt,
                                        expiryDate: new Date(new Date(t.createdAt).setFullYear(new Date(t.createdAt).getFullYear() + 1)).toISOString() // Approximate expiry
                                    });
                                }
                            }
                        });

                        setDomains(validDomains);
                    }
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDomainsAndTransactions();
    }, [router]);

    const columns = [
        {
            label: "Domain Name",
            key: "name",
            render: (row: any) => (
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-[#EB4724]/10 rounded-lg">
                        <GlobeAltIcon className="w-5 h-5 text-[#EB4724]" />
                    </div>
                    <span className="font-bold text-[#651313] text-lg">{row.name}</span>
                </div>
            )
        },
        {
            label: "Status",
            key: "status",
            align: "center",
            render: (row: any) => {
                const isRegistered = row.status === "registered";
                return (
                    <div className="text-center">
                        <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${isRegistered
                                ? "bg-green-100 text-green-700"
                                : "bg-orange-100 text-orange-700"
                                }`}
                        >
                            {isRegistered ? "✓" : "⚠"} {row.status}
                        </span>
                    </div>
                );
            }
        },
        {
            label: "Registration Date",
            key: "registrationDate",
            align: "center",
            render: (row: any) => (
                <div className="text-center text-gray-600 font-medium">
                    {row.registrationDate ? new Date(row.registrationDate).toLocaleDateString() : 'N/A'}
                </div>
            )
        },
        {
            label: "Expiry Date",
            key: "expiryDate",
            align: "center",
            render: (row: any) => (
                <div className="text-center text-gray-600 font-medium">
                    {row.expiryDate ? new Date(row.expiryDate).toLocaleDateString() : 'N/A'}
                </div>
            )
        }
    ];

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="w-12 h-12 border-4 border-[#651313]/20 border-t-[#651313] rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <DataTable
                title="Domain Portfolio"
                columns={columns}
                data={domains}
                showAddButton={true}
                onAddClick={() => router.push("/#search")}
                addButtonLabel="Register New Domain"
                loading={isLoading}
            />
        </div>
    );
}
