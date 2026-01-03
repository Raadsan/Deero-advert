"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated } from "@/utils/auth";

import HostingDomainSearch from "@/components/hosting/HostingDomainSearch";
import { motion } from "framer-motion";
import { CheckCircleIcon, ExclamationTriangleIcon, EllipsisHorizontalIcon } from "@heroicons/react/24/outline";

// Mock data for user domains
const mockDomains = [
    {
        id: 1,
        domain: "mybusiness.com",
        status: "Active",
        registrationDate: "2024-01-15",
        nextDue: "2025-01-15",
        autoRenew: true,
    },
    {
        id: 2,
        domain: "project-x.net",
        status: "Expiring Soon",
        registrationDate: "2023-05-20",
        nextDue: "2024-05-20",
        autoRenew: false,
    },
    {
        id: 3,
        domain: "startup-idea.org",
        status: "Active",
        registrationDate: "2023-11-01",
        nextDue: "2024-11-01",
        autoRenew: true,
    },
];

export default function UserDomainsPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!isAuthenticated()) {
            router.push("/login?redirect=/my-domains");
        } else {
            setIsLoading(false);
        }
    }, [router]);

    if (isLoading) {
        return null;
    }

    return (
        <div className="text-[#1a1a1a] rounded-xl overflow-hidden">
            {/* <div className="flex flex-col gap-2 mb-8">
                <h1 className="text-3xl font-bold tracking-tight text-[#651313]">My Domains</h1>
                <p className="text-gray-600">Manage, renew, and transfer your domains.</p>
            </div> */}

            {/* Domain Search Section */}
            <HostingDomainSearch transparent={true} />

            <section className="mt-8 py-8 px-4 sm:px-8 relative overflow-hidden">
                <div className="mx-auto max-w-4xl relative z-10">
                    <div className="text-center mb-10">
                        <h2 className="text-3xl font-bold text-[#651313] mb-4">
                            Manage Your Domains
                        </h2>
                        <p className="text-[#651313]/80 mb-8 max-w-lg mx-auto">
                            View and manage all your registered domain names in one place.
                        </p>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="overflow-x-auto"
                    >
                        <table className="w-full bg-white rounded-xl shadow-xl border border-white/40 overflow-hidden">
                            <thead>
                                <tr className="bg-[#651313] border-b border-[#651313]">
                                    <th className="py-4 px-6 text-left text-white font-bold">Domain Name</th>
                                    <th className="py-4 px-6 text-center text-white font-bold">Status</th>
                                    <th className="py-4 px-6 text-center text-white font-bold">Registration Date</th>
                                    <th className="py-4 px-6 text-center text-white font-bold">Next Due</th>
                                    <th className="py-4 px-6 text-center text-white font-bold">Auto Renew</th>
                             
                                </tr>
                            </thead>
                            <tbody>
                                {mockDomains.map((domain, index) => (
                                    <tr
                                        key={domain.id}
                                        className={`hover:bg-gray-50 transition-colors ${index !== mockDomains.length - 1 ? "border-b border-gray-100" : ""
                                            }`}
                                    >
                                        <td className="py-4 px-6 font-bold text-[#651313] text-lg">
                                            {domain.domain}
                                        </td>
                                        <td className="py-4 px-6 text-center">
                                            <span
                                                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${domain.status === "Active"
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-orange-100 text-orange-700"
                                                    }`}
                                            >
                                                {domain.status === "Active" ? (
                                                    <CheckCircleIcon className="w-4 h-4" />
                                                ) : (
                                                    <ExclamationTriangleIcon className="w-4 h-4" />
                                                )}
                                                {domain.status}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6 text-center text-gray-600 font-medium">
                                            {domain.registrationDate}
                                        </td>
                                        <td className="py-4 px-6 text-center text-gray-600 font-medium">
                                            {domain.nextDue}
                                        </td>
                                        <td className="py-4 px-6 text-center">
                                            <div className={`mx-auto w-10 h-6 rounded-full p-1 transition-colors ${domain.autoRenew ? 'bg-[#EB4724]' : 'bg-gray-300'}`}>
                                                <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${domain.autoRenew ? 'translate-x-4' : 'translate-x-0'}`} />
                                            </div>
                                        </td>
                                        
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}
