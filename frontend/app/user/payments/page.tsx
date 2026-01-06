"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated, getUserId } from "@/utils/auth";
import { getTransactionsByUser } from "@/api/transactionApi";
import { Transaction } from "@/types/transaction";
import { motion } from "framer-motion";
import {
    CreditCardIcon,
    CheckCircleIcon,
    ExclamationTriangleIcon,
    ClockIcon,
    ArrowUpRightIcon
} from "@heroicons/react/24/outline";

export default function UserPaymentsPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [transactions, setTransactions] = useState<Transaction[]>([]);

    useEffect(() => {
        const fetchTransactions = async () => {
            if (!isAuthenticated()) {
                router.push("/login?redirect=/user/payments");
                return;
            }

            try {
                const userId = getUserId();
                if (userId) {
                    const response = await getTransactionsByUser(userId);
                    if (response.data.success) {
                        setTransactions(response.data.transactions);
                    }
                }
            } catch (error) {
                console.error("Error fetching transactions:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchTransactions();
    }, [router]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="w-12 h-12 border-4 border-[#651313]/20 border-t-[#651313] rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="p-4 sm:p-8">
            <div className="max-w-6xl mx-auto">
                <div className="mb-10 text-center">
                    <h2 className="text-3xl font-bold text-[#651313] mb-4">My Payments</h2>
                    <p className="text-[#651313]/70">Track and manage all your transaction history.</p>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100"
                >
                    {transactions.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-[#651313] text-white">
                                        <th className="py-4 px-6 font-bold uppercase text-sm">Full Name</th>
                                        <th className="py-4 px-6 font-bold uppercase text-sm">Domain / Service</th>
                                        <th className="py-4 px-6 font-bold uppercase text-sm text-center">Amount</th>
                                        <th className="py-4 px-6 font-bold uppercase text-sm text-center">Method</th>
                                        <th className="py-4 px-6 font-bold uppercase text-sm text-center">Status</th>
                                        <th className="py-4 px-6 font-bold uppercase text-sm text-center">Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {transactions.map((t, idx) => {
                                        const domainName = typeof t.domain === 'object' ? t.domain?.name : 'N/A';
                                        const fullName = typeof t.user === 'object' ? t.user?.fullname : 'N/A';

                                        return (
                                            <tr
                                                key={t._id}
                                                className={`hover:bg-gray-50 transition-colors ${idx !== transactions.length - 1 ? 'border-b border-gray-100' : ''}`}
                                            >
                                                <td className="py-4 px-6 font-medium text-gray-900">{fullName}</td>
                                                <td className="py-4 px-6">
                                                    <div className="flex items-center gap-2 text-gray-700">
                                                        <span className="font-semibold text-[#651313]">{domainName}</span>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-6 text-center">
                                                    <span className="font-bold text-lg text-gray-900">${t.amount.toFixed(2)}</span>
                                                </td>
                                                <td className="py-4 px-6 text-center">
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 uppercase">
                                                        {t.paymentMethod || 'N/A'}
                                                    </span>
                                                </td>
                                                <td className="py-4 px-6 text-center">
                                                    <div className="flex flex-col items-center">
                                                        {t.status === 'completed' && (
                                                            <span className="inline-flex items-center gap-1 text-green-600 font-bold uppercase text-xs">
                                                                <CheckCircleIcon className="w-4 h-4" />
                                                                Completed
                                                            </span>
                                                        )}
                                                        {t.status === 'failed' && (
                                                            <span className="inline-flex items-center gap-1 text-red-600 font-bold uppercase text-xs">
                                                                <ExclamationTriangleIcon className="w-4 h-4" />
                                                                Failed
                                                            </span>
                                                        )}
                                                        {t.status === 'pending' && (
                                                            <span className="inline-flex items-center gap-1 text-orange-500 font-bold uppercase text-xs">
                                                                <ClockIcon className="w-4 h-4" />
                                                                Pending
                                                            </span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="py-4 px-6 text-center text-gray-500 text-sm">
                                                    {new Date(t.createdAt).toLocaleDateString()}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="py-20 text-center">
                            <CreditCardIcon className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                            <h3 className="text-xl font-bold text-gray-900 mb-2">No payments found</h3>
                            <p className="text-gray-500">You haven't made any transactions yet.</p>
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
}
