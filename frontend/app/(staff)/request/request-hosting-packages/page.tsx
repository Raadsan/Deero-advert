"use client";
export const dynamic = 'force-static';

import { useState, useEffect } from "react";
import { getAllTransactions } from "@/api-client/transactionApi";
import DataTable from "@/components/layout/DataTable";

export default function RequestHostingPage() {
    const [hostingRequests, setHostingRequests] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchHostingRequests = async () => {
        try {
            setLoading(true);
            const response = await getAllTransactions();
            const allTransactions = response.data?.transactions || [];

            // Filter for hosting_payment type transactions
            const hostingPayments = allTransactions.filter(
                (t: any) => t.type === "hosting_payment" &&
                    t.status?.toLowerCase() === "completed"
            );

            setHostingRequests(hostingPayments);
        } catch (error) {
            console.error("Error fetching hosting requests:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHostingRequests();
    }, []);

    return (
        <div className="space-y-6">
            <DataTable
                title="Hosting Package Purchase Requests"
                columns={[
                    {
                        label: "Username",
                        key: "user",
                        render: (row: any) => {
                            const user = row.user;
                            return typeof user === 'object' ? user?.fullname || "N/A" : "N/A";
                        }
                    },
                    {
                        label: "Email",
                        key: "email",
                        render: (row: any) => {
                            const user = row.user;
                            return typeof user === 'object' ? user?.email || "N/A" : "N/A";
                        }
                    },
                    {
                        label: "Phone",
                        key: "phone",
                        render: (row: any) => {
                            const user = row.user;
                            return typeof user === 'object' ? user?.phone || "N/A" : "N/A";
                        }
                    },
                    {
                        label: "Hosting Package",
                        key: "hostingPackage",
                        render: (row: any) => {
                            const pkg = row.hostingPackage;
                            return typeof pkg === 'object' ? pkg?.name || "N/A" : "N/A";
                        }
                    },
                    {
                        label: "Price",
                        key: "price",
                        render: (row: any) => {
                            const pkg = row.hostingPackage;
                            return pkg?.price ? `$${(pkg.price).toFixed(2)}` : "N/A";
                        }
                    },
                    {
                        label: "Amount paid",
                        key: "amount",
                        render: (row: any) => `$${(row.amount || 0).toFixed(2)}`
                    },
                    {
                        label: "Status",
                        key: "status",
                        render: (row: any) => {
                            const statusColors: any = {
                                completed: "bg-green-100 text-green-700",
                                pending: "bg-yellow-100 text-yellow-700",
                                failed: "bg-red-100 text-red-700"
                            };
                            const colorClass = statusColors[row.status] || "bg-gray-100 text-gray-700";
                            return (
                                <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase ${colorClass}`}>
                                    {row.status || "unknown"}
                                </span>
                            );
                        }
                    },
                    {
                        label: "Date",
                        key: "createdAt",
                        render: (row: any) => new Date(row.createdAt).toLocaleDateString()
                    }
                ]}
                data={hostingRequests}
                showAddButton={false}
                onRefresh={fetchHostingRequests}
                loading={loading}
            />
        </div>
    );
}

