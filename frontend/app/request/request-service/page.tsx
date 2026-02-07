"use client";
export const dynamic = 'force-static';

import { useState, useEffect } from "react";
import { getAllTransactions } from "@/api/transactionApi";
import DataTable from "@/components/layout/DataTable";

export default function RequestServicePage() {
    const [serviceRequests, setServiceRequests] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchServiceRequests = async () => {
        try {
            setLoading(true);
            const response = await getAllTransactions();
            const allTransactions = response.data?.transactions || [];

            // Filter for service_payment type transactions
            const servicePayments = allTransactions.filter(
                (t: any) => t.type === "service_payment" &&
                    t.status?.toLowerCase() === "completed"
            );

            setServiceRequests(servicePayments);
        } catch (error) {
            console.error("Error fetching service requests:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchServiceRequests();
    }, []);

    return (
        <div className="space-y-6">


            <DataTable
                title="Service Purchase Requests"
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
                        label: "Service Name",
                        key: "service",
                        render: (row: any) => {
                            if (row.service && typeof row.service === 'object') {
                                return row.service.serviceTitle || "N/A";
                            }
                            // Fallback: Parse from description "Payment for Service - Package"
                            if (row.description && row.description.includes("Payment for")) {
                                const parts = row.description.replace("Payment for ", "").split(" - ");
                                return parts[0] || "N/A";
                            }
                            return "N/A";
                        }
                    },
                    {
                        label: "Package",
                        key: "package",
                        render: (row: any) => {
                            const service = row.service;
                            const packageId = row.packageId;
                            if (typeof service === 'object' && service?.packages && packageId) {
                                // Use a more robust comparison for the ID
                                const pkg = service.packages.find((p: any) =>
                                    (p._id?.toString() === packageId.toString()) || (p._id === packageId)
                                );
                                if (pkg) return pkg.packageTitle || "N/A";
                            }

                            // Fallback: Parse from description
                            if (row.description && row.description.includes("Payment for")) {
                                const parts = row.description.replace("Payment for ", "").split(" - ");
                                return parts[1] || "N/A";
                            }
                            return "N/A";
                        }
                    },
                    {
                        label: "Price",
                        key: "price",
                        render: (row: any) => {
                            const service = row.service;
                            const packageId = row.packageId;
                            if (typeof service === 'object' && service?.packages && packageId) {
                                const pkg = service.packages.find((p: any) =>
                                    (p._id?.toString() === packageId.toString()) || (p._id === packageId)
                                );
                                if (pkg) return `$${(pkg.price || 0).toFixed(2)}`;
                            }
                            // Fallback: use amount paid if price not found
                            return row.amount ? `$${(row.amount || 0).toFixed(2)}` : "N/A";
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
                data={serviceRequests}
                showAddButton={false}
                onRefresh={fetchServiceRequests}
                loading={loading}
            />
        </div>
    );
}
