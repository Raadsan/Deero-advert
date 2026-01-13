"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getTransactionsByUser } from "@/api/transactionApi";
import { getUserId, isAuthenticated } from "@/utils/auth";

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

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="w-12 h-12 border-4 border-[#651313]/20 border-t-[#651313] rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight text-[#651313]">My Services</h1>

            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="text-center py-6 border-b border-gray-100">
                    <h2 className="text-2xl font-bold text-[#651313]">My Services</h2>
                    <p className="text-gray-500 text-sm mt-1">Track and manage all your service purchases.</p>
                </div>

                {services.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-[#651313]">
                                    <th className="py-3 px-6 text-left text-white font-bold uppercase text-xs">Service Name</th>
                                    <th className="py-3 px-6 text-left text-white font-bold uppercase text-xs">Package</th>
                                    <th className="py-3 px-6 text-center text-white font-bold uppercase text-xs">Amount</th>
                                    <th className="py-3 px-6 text-center text-white font-bold uppercase text-xs">Method</th>
                                    <th className="py-3 px-6 text-center text-white font-bold uppercase text-xs">Status</th>
                                    <th className="py-3 px-6 text-center text-white font-bold uppercase text-xs">Date</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white">
                                {services.map((service, index) => {
                                    const serviceName = typeof service.service === 'object' ? service.service?.serviceTitle : "N/A";
                                    const packageId = service.packageId;
                                    let packageTitle = "N/A";

                                    if (typeof service.service === 'object' && service.service?.packages && packageId) {
                                        const pkg = service.service.packages.find((p: any) => p._id === packageId);
                                        packageTitle = pkg?.packageTitle || "N/A";
                                    }

                                    return (
                                        <tr
                                            key={service._id}
                                            className={index % 2 === 0 ? "bg-gray-50 hover:bg-gray-100" : "bg-white hover:bg-gray-100"}
                                        >
                                            <td className="py-4 px-6 text-gray-900 font-medium">
                                                {serviceName}
                                            </td>
                                            <td className="py-4 px-6 text-gray-700">
                                                {packageTitle}
                                            </td>
                                            <td className="py-4 px-6 text-center font-bold text-gray-900">
                                                ${service.amount}
                                            </td>
                                            <td className="py-4 px-6 text-center">
                                                <span className="text-blue-600 font-bold uppercase text-xs">
                                                    {service.paymentMethod || "WAAFI"}
                                                </span>
                                            </td>
                                            <td className="py-4 px-6 text-center">
                                                <span
                                                    className={`font-bold uppercase text-xs ${service.status === "completed"
                                                            ? "text-green-600"
                                                            : service.status === "failed"
                                                                ? "text-red-600"
                                                                : "text-yellow-600"
                                                        }`}
                                                >
                                                    {service.status === "completed" && "✓ "}
                                                    {service.status}
                                                </span>
                                            </td>
                                            <td className="py-4 px-6 text-center text-gray-600">
                                                {new Date(service.createdAt).toLocaleDateString()}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="text-center py-16">
                        <p className="text-gray-500 text-lg mb-4">No services purchased yet.</p>
                        <button
                            onClick={() => router.push("/services")}
                            className="px-6 py-3 bg-[#651313] text-white font-bold rounded-xl hover:bg-[#831a1a] transition-all shadow-lg active:scale-95"
                        >
                            Browse Services
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
