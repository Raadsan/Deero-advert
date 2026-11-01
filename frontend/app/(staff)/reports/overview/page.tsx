"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { getAllTransactions } from "@/api-client/transactionApi";
import {
    BarChart3,
    DollarSign,
    Receipt,
    TrendingUp,
    Briefcase,
    Server,
    Globe,
    CheckCircle2,
    Clock,
    ArrowRight,
    Users,
    Layers,
    FileSpreadsheet,
    ShieldCheck
} from "lucide-react";

export default function ReportsOverviewPage() {
    const [transactions, setTransactions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                setLoading(true);
                const res = await getAllTransactions();
                setTransactions(res.data?.transactions || []);
            } catch (err) {
                console.error("Overview load error:", err);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const overview = useMemo(() => {
        const completed = transactions.filter((t) => t.status === "completed");
        const pending = transactions.filter((t) => t.status === "pending");

        const totalRevenue = completed.reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
        const totalPending = pending.reduce((sum, t) => sum + (Number(t.amount) || 0), 0);

        const domainCount = transactions.filter((t) => t.type === "register").length;
        const serviceCount = transactions.filter((t) => t.type === "service_payment").length;
        const hostingCount = transactions.filter((t) => t.type === "hosting_payment").length;

        const uniqueUsers = new Set(transactions.map((t) => t.userId)).size;

        return {
            totalRevenue,
            totalPending,
            completedCount: completed.length,
            pendingCount: pending.length,
            totalCount: transactions.length,
            domainCount,
            serviceCount,
            hostingCount,
            uniqueUsers,
            recent: transactions.slice(0, 6)
        };
    }, [transactions]);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#651313] to-[#801818] p-6 sm:p-8 rounded-2xl text-white shadow-lg relative overflow-hidden">
                <div className="relative z-10 max-w-2xl">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white/90 text-xs font-semibold mb-3">
                        <BarChart3 className="h-3.5 w-3.5" />
                        <span>Executive Reporting Center</span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                        Deero Advertising Agency Reports
                    </h1>
                    <p className="mt-2 text-sm text-white/80 leading-relaxed">
                        Centralized financial intelligence, real-time transaction reconciliation, revenue breakdowns, and customer ordering activity.
                    </p>
                </div>
            </div>

            {/* Quick KPI stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                    <span className="text-xs font-semibold uppercase text-gray-400">Total Settled Revenue</span>
                    <div className="text-2xl font-extrabold text-gray-900 mt-2">
                        ${overview.totalRevenue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                    <div className="mt-1 text-xs text-emerald-600 font-medium flex items-center gap-1">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        <span>{overview.completedCount} verified orders</span>
                    </div>
                </div>

                <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                    <span className="text-xs font-semibold uppercase text-gray-400">Total Transactions</span>
                    <div className="text-2xl font-extrabold text-gray-900 mt-2">
                        {overview.totalCount}
                    </div>
                    <div className="mt-1 text-xs text-gray-500">
                        {overview.uniqueUsers} active customer accounts
                    </div>
                </div>

                <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                    <span className="text-xs font-semibold uppercase text-gray-400">Pending Settlements</span>
                    <div className="text-2xl font-extrabold text-amber-600 mt-2">
                        ${overview.totalPending.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                    <div className="mt-1 text-xs text-amber-600 font-medium flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        <span>{overview.pendingCount} awaiting confirmation</span>
                    </div>
                </div>

                <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                    <span className="text-xs font-semibold uppercase text-gray-400">Products & Services</span>
                    <div className="text-2xl font-extrabold text-gray-900 mt-2">
                        {overview.serviceCount + overview.hostingCount + overview.domainCount}
                    </div>
                    <div className="mt-1 text-xs text-gray-500">
                        Orders across 3 primary categories
                    </div>
                </div>
            </div>

            {/* Quick Access Modules */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Link
                    href="/reports/transactions"
                    className="group bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:border-[#651313]/30 hover:shadow-md transition-all flex flex-col justify-between"
                >
                    <div className="space-y-3">
                        <div className="h-12 w-12 rounded-xl bg-[#651313]/10 text-[#651313] flex items-center justify-center group-hover:scale-105 transition-transform">
                            <Receipt className="h-6 w-6" />
                        </div>
                        <h2 className="text-lg font-bold text-gray-900 group-hover:text-[#651313] transition-colors">
                            Transactions Report
                        </h2>
                        <p className="text-xs text-gray-500 leading-relaxed">
                            Search, filter, view printable receipts, audit reference numbers, and export full CSV spreadsheets of all customer payments and requests.
                        </p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs font-semibold text-[#651313]">
                        <span>Open Detailed Transactions</span>
                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                </Link>

                <Link
                    href="/reports/revenue"
                    className="group bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:border-[#EB4724]/30 hover:shadow-md transition-all flex flex-col justify-between"
                >
                    <div className="space-y-3">
                        <div className="h-12 w-12 rounded-xl bg-[#EB4724]/10 text-[#EB4724] flex items-center justify-center group-hover:scale-105 transition-transform">
                            <TrendingUp className="h-6 w-6" />
                        </div>
                        <h2 className="text-lg font-bold text-gray-900 group-hover:text-[#EB4724] transition-colors">
                            Revenue Analytics
                        </h2>
                        <p className="text-xs text-gray-500 leading-relaxed">
                            Visual monthly trends, breakdown by service type, hosting, domain sales, average customer spending, and growth metrics.
                        </p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs font-semibold text-[#EB4724]">
                        <span>Explore Revenue Intelligence</span>
                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                </Link>
            </div>

            {/* Recent Transactions Preview */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                    <div>
                        <h3 className="text-base font-bold text-gray-900">Recent Transactions</h3>
                        <p className="text-xs text-gray-500">Most recent activity across all services</p>
                    </div>
                    <Link
                        href="/reports/transactions"
                        className="text-xs font-semibold text-[#651313] hover:underline flex items-center gap-1"
                    >
                        <span>View All Transactions</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                </div>

                <div className="divide-y divide-gray-100">
                    {loading ? (
                        <div className="p-6 text-center text-xs text-gray-400">Loading activity...</div>
                    ) : overview.recent.length === 0 ? (
                        <div className="p-6 text-center text-xs text-gray-400">No transactions recorded yet.</div>
                    ) : (
                        overview.recent.map((tx) => (
                            <div key={tx.id} className="p-4 sm:px-6 flex items-center justify-between hover:bg-gray-50/50 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="h-9 w-9 rounded-lg bg-gray-100 flex items-center justify-center text-gray-700">
                                        {tx.type === "service_payment" ? (
                                            <Briefcase className="h-4 w-4 text-purple-600" />
                                        ) : tx.type === "hosting_payment" ? (
                                            <Server className="h-4 w-4 text-blue-600" />
                                        ) : (
                                            <Globe className="h-4 w-4 text-emerald-600" />
                                        )}
                                    </div>
                                    <div>
                                        <div className="text-xs font-semibold text-gray-900">
                                            {tx.description || tx.service?.serviceTitle || tx.hostingPackage?.name || tx.domainName || "Order"}
                                        </div>
                                        <div className="text-[11px] text-gray-500">
                                            {tx.user?.name || tx.user?.fullName || `User #${tx.userId}`} • {new Date(tx.createdAt).toLocaleDateString()}
                                        </div>
                                    </div>
                                </div>

                                <div className="text-right">
                                    <div className="text-xs font-bold text-gray-900">${Number(tx.amount).toFixed(2)}</div>
                                    <span
                                        className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                                            tx.status === "completed"
                                                ? "bg-emerald-50 text-emerald-700"
                                                : tx.status === "pending"
                                                ? "bg-amber-50 text-amber-700"
                                                : "bg-rose-50 text-rose-700"
                                        }`}
                                    >
                                        {tx.status}
                                    </span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
