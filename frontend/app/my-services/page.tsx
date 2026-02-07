"use client";
export const dynamic = 'force-static';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getTransactionsByUser } from "@/api/transactionApi";
import { getUserId, isAuthenticated } from "@/utils/auth";
import DataTable from "@/components/layout/DataTable";

export default function MyServicesPage() {
    const router = useRouter();
    const [services, setServices] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMyServices = async () => {
            if (!isAuthenticated()) {
                router.push("/login?redirect=/my-services");
                return;
            }

            try {
                setLoading(true);
                const userId = getUserId();
                if (!userId) {
                    router.push("/login");
                    return;
                }

                const response = await getTransactionsByUser(userId);
                const allTransactions = response.data?.transactions || [];

                // Filter for service_payment type transactions
                const servicePayments = allTransactions.filter(
                    (t: any) => t.type === "service_payment"
                );

                setServices(servicePayments);
            } catch (error) {
                console.error("Error fetching my services:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchMyServices();
    }, [router]);

    const columns = [
        {
            label: "Service Name",
            key: "service",
            render: (row: any) => {
                const serviceName = typeof row.service === 'object' ? row.service?.serviceTitle : "N/A";
                return <span className="font-semibold text-gray-900">{serviceName}</span>;
            }
        },
        {
            label: "Package",
            key: "package",
            render: (row: any) => {
                const packageId = row.packageId;
                let packageTitle = "N/A";

                if (typeof row.service === 'object' && row.service?.packages && packageId) {
                    const pkg = row.service.packages.find((p: any) => p._id === packageId);
                    packageTitle = pkg?.packageTitle || "N/A";
                }
                return <span className="text-gray-700">{packageTitle}</span>;
            }
        },
        {
            label: "Amount",
            key: "amount",
            align: "center",
            render: (row: any) => (
                <div className="text-center">
                    <span className="font-bold text-gray-900">${(row.amount || 0).toFixed(2)}</span>
                </div>
            )
        },
        {
            label: "Method",
            key: "paymentMethod",
            align: "center",
            render: (row: any) => (
                <div className="text-center">
                    <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-[10px] font-bold uppercase tracking-tight">
                        {row.paymentMethod || "WAAFI"}
                    </span>
                </div>
            )
        },
        {
            label: "Status",
            key: "status",
            align: "center",
            render: (row: any) => {
                const statusColors: any = {
                    completed: "bg-green-100 text-green-700 border border-green-200",
                    failed: "bg-red-100 text-red-700 border border-red-200",
                    pending: "bg-yellow-100 text-yellow-700 border border-yellow-200"
                };
                return (
                    <div className="text-center">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide ${statusColors[row.status] || 'bg-gray-100 text-gray-700 border border-gray-200'}`}>
                            {row.status === "completed" && "✓ "}
                            {row.status}
                        </span>
                    </div>
                );
            }
        },
        {
            label: "Date",
            key: "createdAt",
            align: "center",
            render: (row: any) => (
                <div className="text-center text-gray-500 text-sm">
                    {new Date(row.createdAt).toLocaleDateString()}
                </div>
            )
        }
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="w-12 h-12 border-4 border-[#651313]/20 border-t-[#651313] rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <DataTable
                title="My Services"
                columns={columns}
                data={services}
                showAddButton={false}
                loading={loading}
            />
        </div>
    );
}
