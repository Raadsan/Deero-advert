"use client";
export const dynamic = 'force-static';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getTransactionsByUser } from "@/api-client/transactionApi";
import { getUserId, isAuthenticated } from "@/utils/auth";
import DataTable from "@/components/layout/DataTable";

export default function MyServicesPage() {
    const router = useRouter();
    const [services, setServices] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMyServices = async () => {
            if (!isAuthenticated()) {
                router.push("/login?redirect=/user/my-services");
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
                console.log('Transaction row:', row);
                console.log('Service data:', row.service, 'Type:', typeof row.service);

                let serviceName = "N/A";
                if (typeof row.service === 'object' && row.service?.serviceTitle) {
                    serviceName = row.service.serviceTitle;
                } else if (row.description) {
                    // Fallback: try to parse from description
                    serviceName = row.description.replace("Payment for ", "").split(" - ")[0] || "N/A";
                }

                return <span className="font-medium text-gray-900">{serviceName}</span>;
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
                } else if (row.description && row.description.includes(" - ")) {
                    // Fallback: try to parse from description
                    const parts = row.description.replace("Payment for ", "").split(" - ");
                    packageTitle = parts[1] || "N/A";
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
                    <span className="font-bold text-gray-900">${row.amount}</span>
                </div>
            )
        },
        {
            label: "Method",
            key: "paymentMethod",
            align: "center",
            render: (row: any) => (
                <div className="text-center">
                    <span className="text-blue-600 font-bold uppercase text-xs">
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
                    completed: "text-green-600",
                    failed: "text-red-600",
                    pending: "text-yellow-600"
                };
                return (
                    <div className="text-center">
                        <span className={`font-bold uppercase text-xs ${statusColors[row.status] || 'text-gray-600'}`}>
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
                <div className="text-center text-gray-600">
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
                title="Service Purchase History"
                columns={columns}
                data={services}
                showAddButton={false}
                loading={loading}
            />
        </div>
    );
}

