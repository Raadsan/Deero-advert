"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { getAllDomainPrices } from "@/api/domainPriceApi";

interface DomainPrice {
    _id: string;
    tld: string;
    newPrice: number;
    transferPrice: number;
    renewalPrice: number;
}

export default function DomainPricingTable() {
    const [prices, setPrices] = useState<DomainPrice[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPrices();
    }, []);

    const fetchPrices = async () => {
        try {
            const response = await getAllDomainPrices();
            // Handle potentially different response structures
            const data = Array.isArray(response.data) ? response.data : response.data.prices || [];
            setPrices(data);
        } catch (error) {
            console.error("Error fetching domain prices:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="mt-12 text-center text-gray-600">Loading pricing...</div>;
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mt-12 overflow-x-auto"
        >
            <table className="w-full bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <thead>
                    <tr className="bg-[#651313] border-b border-[#651313]">
                        <th className="py-4 px-6 text-left text-white font-bold">Domain</th>
                        <th className="py-4 px-6 text-center text-white font-bold">New Price</th>
                        <th className="py-4 px-6 text-center text-white font-bold">Transfer</th>
                        <th className="py-4 px-6 text-center text-white font-bold">Renewal</th>
                    </tr>
                </thead>
                <tbody>
                    {prices.length > 0 ? (
                        prices.map((item, index) => (
                            <tr
                                key={item._id || index}
                                className={`hover:bg-gray-50 transition-colors ${index !== prices.length - 1 ? "border-b border-gray-100" : ""
                                    }`}
                            >
                                <td className="py-4 px-6 font-bold text-[#651313]">{item.tld}</td>
                                <td className="py-4 px-6 text-center">
                                    <div className="font-bold text-[#651313]">${item.newPrice} USD</div>
                                    <div className="text-xs text-[#EB4724] font-medium">1 Year</div>
                                </td>
                                <td className="py-4 px-6 text-center">
                                    <div className="font-bold text-[#651313]">${item.transferPrice} USD</div>
                                    <div className="text-xs text-[#EB4724] font-medium">1 Year</div>
                                </td>
                                <td className="py-4 px-6 text-center">
                                    <div className="font-bold text-[#651313]">${item.renewalPrice} USD</div>
                                    <div className="text-xs text-[#EB4724] font-medium">1 Year</div>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={4} className="py-8 text-center text-gray-500">
                                No pricing data available
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </motion.div>
    );
}
