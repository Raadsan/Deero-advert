"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated, getUser, getUserId } from "@/utils/auth";
import { getDomainsByUser } from "@/api/domainApi";
import { Domain } from "@/types/domain";

import { motion } from "framer-motion";
import { CheckCircleIcon, ExclamationTriangleIcon, EllipsisHorizontalIcon, GlobeAltIcon } from "@heroicons/react/24/outline";

export default function UserDomainsPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [domains, setDomains] = useState<Domain[]>([]);

    useEffect(() => {
        const fetchDomains = async () => {
            if (!isAuthenticated()) {
                router.push("/login?redirect=/user/domains");
                return;
            }

            try {
                const userId = getUserId();
                if (userId) {
                    const response = await getDomainsByUser(userId);
                    if (response.data.success) {
                        setDomains(response.data.domains);
                    }
                }
            } catch (error) {
                console.error("Error fetching domains:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDomains();
    }, [router]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="w-12 h-12 border-4 border-[#651313]/20 border-t-[#651313] rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="text-[#1a1a1a] rounded-xl overflow-hidden min-h-full">
            <section className="py-8 px-4 sm:px-8 relative overflow-hidden">
                <div className="mx-auto max-w-5xl relative z-10">
                    <div className="text-left mb-10 border-b border-gray-100 pb-6 flex items-end justify-between">
                        <div>
                            <h2 className="text-3xl font-bold text-[#651313] mb-2">
                                My Domains
                            </h2>
                            <p className="text-[#651313]/70 font-medium">
                                View and manage all your registered domain names.
                            </p>
                        </div>
                        <button
                            onClick={() => router.push("/#search")}
                            className="px-5 py-2.5 bg-[#651313] text-white text-sm font-bold rounded-xl hover:bg-[#831a1a] transition-all shadow-md active:scale-95"
                        >
                            Register New Domain
                        </button>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="overflow-x-auto"
                    >
                        {domains.length > 0 ? (
                            <table className="w-full bg-white rounded-xl shadow-xl border border-white/40 overflow-hidden">
                                <thead>
                                    <tr className="bg-[#651313] border-b border-[#651313]">
                                        <th className="py-4 px-6 text-left text-white font-bold">Domain Name</th>
                                        <th className="py-4 px-6 text-center text-white font-bold">Status</th>
                                        <th className="py-4 px-6 text-center text-white font-bold">Registration Date</th>
                                        <th className="py-4 px-6 text-center text-white font-bold">Expiry Date</th>
                                        <th className="py-4 px-6 text-center text-white font-bold">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {domains.map((domain, index) => (
                                        <tr
                                            key={domain._id}
                                            className={`hover:bg-gray-50 transition-colors ${index !== domains.length - 1 ? "border-b border-gray-100" : ""
                                                }`}
                                        >
                                            <td className="py-4 px-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 bg-[#EB4724]/10 rounded-lg">
                                                        <GlobeAltIcon className="w-5 h-5 text-[#EB4724]" />
                                                    </div>
                                                    <span className="font-bold text-[#651313] text-lg">{domain.name}</span>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6 text-center">
                                                <span
                                                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${domain.status === "registered"
                                                        ? "bg-green-100 text-green-700"
                                                        : "bg-orange-100 text-orange-700"
                                                        }`}
                                                >
                                                    {domain.status === "registered" ? (
                                                        <CheckCircleIcon className="w-4 h-4" />
                                                    ) : (
                                                        <ExclamationTriangleIcon className="w-4 h-4" />
                                                    )}
                                                    {domain.status}
                                                </span>
                                            </td>
                                            <td className="py-4 px-6 text-center text-gray-600 font-medium">
                                                {domain.registrationDate ? new Date(domain.registrationDate).toLocaleDateString() : 'N/A'}
                                            </td>
                                            <td className="py-4 px-6 text-center text-gray-600 font-medium">
                                                {domain.expiryDate ? new Date(domain.expiryDate).toLocaleDateString() : 'N/A'}
                                            </td>
                                            <td className="py-4 px-6 text-center">
                                                <button className="p-2 text-gray-400 hover:text-[#651313] transition-colors">
                                                    <EllipsisHorizontalIcon className="w-6 h-6" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <div className="text-center py-20 bg-white rounded-xl shadow-xl border border-white/40">
                                <GlobeAltIcon className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                                <h3 className="text-xl font-bold text-gray-900 mb-2">No domains found</h3>
                                <p className="text-gray-500 mb-6 font-medium">You haven't registered any domains yet.</p>
                                <button
                                    onClick={() => router.push("/#search")}
                                    className="px-6 py-2 bg-[#EB4724] text-white font-bold rounded-lg hover:bg-[#d63d1f] transition-all duration-300"
                                >
                                    Search for a Domain
                                </button>
                            </div>
                        )}
                    </motion.div>
                </div>
            </section>
        </div>
    );
}
