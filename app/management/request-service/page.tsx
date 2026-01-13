"use client";

import { useState, useEffect } from "react";
import { getAllTransactions } from "@/api/transactionApi";
import DataTable from "@/components/layout/DataTable";

export default function RequestServicePage() {
    const [serviceRequests, setServiceRequests] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchServiceRequests = async () => {
            try {
                setLoading(true);
                const response = await getAllTransactions();
                const allTransactions = response.data?.transactions || [];

                // Filter for service_payment type transactions
                const servicePayments = allTransactions.filter(
                    (t: any) => t.type === "service_payment"
                );

                setServiceRequests(servicePayments);
            } catch (error) {
                console.error("Error fetching service requests:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchServiceRequests();
    }, []);

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight text-[#651313]">
                Service Requests
            </h1>

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
                            const service = row.service;
                            return typeof service === 'object' ? service?.serviceTitle || "N/A" : "N/A";
                        }
                    },
                    {
                        label: "Package",
                        key: "package",
                        render: (row: any) => {
                            const service = row.service;
                            const packageId = row.packageId;
                            if (typeof service === 'object' && service?.packages && packageId) {
                                const pkg = service.packages.find((p: any) => p._id === packageId);
                                return pkg?.packageTitle || "N/A";
                            }
                            return "N/A";
                        }
                    },
                    {
                        label: "Amount",
                        key: "amount",
                        render: (row: any) => `$${row.amount || 0}`
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
                loading={loading}
            />
        </div>
    );
}
