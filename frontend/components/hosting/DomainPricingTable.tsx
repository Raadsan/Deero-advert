"use client";

import { motion } from "framer-motion";

const pricingData = [
    { domain: ".com", newPrice: "$14.99 USD", transfer: "$14.99 USD", renewal: "$14.99 USD" },
    { domain: ".net", newPrice: "$14.99 USD", transfer: "$14.99 USD", renewal: "$14.99 USD" },
    { domain: ".org", newPrice: "$14.99 USD", transfer: "$14.99 USD", renewal: "$14.99 USD" },
    { domain: ".info", newPrice: "$14.99 USD", transfer: "$14.99 USD", renewal: "$14.99 USD" },
];

export default function DomainPricingTable() {
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
                    {pricingData.map((item, index) => (
                        <tr
                            key={item.domain}
                            className={`hover:bg-gray-50 transition-colors ${index !== pricingData.length - 1 ? "border-b border-gray-100" : ""
                                }`}
                        >
                            <td className="py-4 px-6 font-bold text-[#651313]">{item.domain}</td>
                            <td className="py-4 px-6 text-center">
                                <div className="font-bold text-[#651313]">{item.newPrice}</div>
                                <div className="text-xs text-[#EB4724] font-medium">1 Year</div>
                            </td>
                            <td className="py-4 px-6 text-center">
                                <div className="font-bold text-[#651313]">{item.transfer}</div>
                                <div className="text-xs text-[#EB4724] font-medium">1 Year</div>
                            </td>
                            <td className="py-4 px-6 text-center">
                                <div className="font-bold text-[#651313]">{item.renewal}</div>
                                <div className="text-xs text-[#EB4724] font-medium">1 Year</div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </motion.div>
    );
}
