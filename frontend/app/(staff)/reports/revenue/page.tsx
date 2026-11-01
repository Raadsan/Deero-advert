"use client";

import { useState, useEffect, useMemo } from "react";
import { getAllTransactions, getRevenueAnalytics } from "@/api-client/transactionApi";
import {
    TrendingUp,
    DollarSign,
    Calendar,
    ArrowUpRight,
    ArrowDownRight,
    PieChart,
    BarChart3,
    Layers,
    Server,
    Globe,
    Briefcase,
    CreditCard,
    RefreshCw,
    Download
} from "lucide-react";
import toast from "react-hot-toast";

export default function RevenueAnalyticsPage() {
    const [transactions, setTransactions] = useState<any[]>([]);
    const [monthlyRevenue, setMonthlyRevenue] = useState<Array<{ label: string; year: number; revenue: number }>>([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [txRes, analyticsRes] = await Promise.all([
                getAllTransactions(),
                getRevenueAnalytics()
            ]);

            setTransactions(txRes.data?.transactions || []);
            setMonthlyRevenue(analyticsRes.data?.data || []);
        } catch (error: any) {
            console.error("Failed to fetch revenue analytics:", error);
            toast.error(error.response?.data?.message || "Failed to load revenue analytics");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Aggregations
    const analytics = useMemo(() => {
        const completed = transactions.filter((t) => t.status === "completed");

        const totalRevenue = completed.reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
        const avgOrderValue = completed.length > 0 ? totalRevenue / completed.length : 0;

        let maxTransaction = 0;
        completed.forEach((t) => {
            const amt = Number(t.amount) || 0;
            if (amt > maxTransaction) maxTransaction = amt;
        });

        // Category breakdown
        let serviceRev = 0;
        let serviceCount = 0;
        let hostingRev = 0;
        let hostingCount = 0;
        let domainRev = 0;
        let domainCount = 0;
        let otherRev = 0;
        let otherCount = 0;

        completed.forEach((t) => {
            const amt = Number(t.amount) || 0;
            if (t.type === "service_payment") {
                serviceRev += amt;
                serviceCount++;
            } else if (t.type === "hosting_payment") {
                hostingRev += amt;
                hostingCount++;
            } else if (t.type === "register") {
                domainRev += amt;
                domainCount++;
            } else {
                otherRev += amt;
                otherCount++;
            }
        });

        // Top Spenders
        const userMap = new Map<number, { name: string; email: string; total: number; count: number }>();
        completed.forEach((t) => {
            const uid = t.userId;
            const amt = Number(t.amount) || 0;
            const name = t.user?.name || t.user?.fullName || t.user?.username || `User #${uid}`;
            const email = t.user?.email || "";

            const existing = userMap.get(uid) || { name, email, total: 0, count: 0 };
            existing.total += amt;
            existing.count += 1;
            userMap.set(uid, existing);
        });

        const topSpenders = Array.from(userMap.values())
            .sort((a, b) => b.total - a.total)
            .slice(0, 5);

        return {
            totalRevenue,
            completedCount: completed.length,
            avgOrderValue,
            maxTransaction,
            categories: [
                { name: "Services", revenue: serviceRev, count: serviceCount, icon: Briefcase, color: "bg-purple-500", text: "text-purple-600" },
                { name: "Hosting Packages", revenue: hostingRev, count: hostingCount, icon: Server, color: "bg-blue-500", text: "text-blue-600" },
                { name: "Domain Registrations", revenue: domainRev, count: domainCount, icon: Globe, color: "bg-emerald-500", text: "text-emerald-600" },
                ...(otherCount > 0 ? [{ name: "Other Payments", revenue: otherRev, count: otherCount, icon: CreditCard, color: "bg-gray-500", text: "text-gray-600" }] : [])
            ],
            topSpenders
        };
    }, [transactions]);

    // Maximum revenue in monthly bars for scale
    const maxMonthlyRev = useMemo(() => {
        if (!monthlyRevenue.length) return 100;
        const max = Math.max(...monthlyRevenue.map((m) => m.revenue));
        return max > 0 ? max : 100;
    }, [monthlyRevenue]);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                <div>
                    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#651313]">
                        <TrendingUp className="h-4 w-4" />
                        <span>Financial Analytics</span>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mt-1">Revenue Analytics</h1>
                    <p className="text-sm text-gray-500 mt-0.5">
                        Historical financial performance, streams breakdown, and growth indicators
                    </p>
                </div>

                <div className="flex items-center gap-2.5">
                    <button
                        onClick={fetchData}
                        disabled={loading}
                        className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors shadow-sm disabled:opacity-50"
                    >
                        <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin text-[#651313]" : "text-gray-500"}`} />
                        <span>Refresh</span>
                    </button>
                </div>
            </div>

            {/* KPI Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                    <div className="flex items-center justify-between text-xs font-semibold uppercase text-gray-400">
                        <span>Total Revenue</span>
                        <div className="h-9 w-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                            <DollarSign className="h-5 w-5" />
                        </div>
                    </div>
                    <div className="text-2xl font-extrabold text-gray-900 mt-2">
                        ${analytics.totalRevenue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                    <div className="mt-1 text-xs text-gray-500">From {analytics.completedCount} completed transactions</div>
                </div>

                <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                    <div className="flex items-center justify-between text-xs font-semibold uppercase text-gray-400">
                        <span>Average Order Value</span>
                        <div className="h-9 w-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                            <TrendingUp className="h-5 w-5" />
                        </div>
                    </div>
                    <div className="text-2xl font-extrabold text-gray-900 mt-2">
                        ${analytics.avgOrderValue.toFixed(2)}
                    </div>
                    <div className="mt-1 text-xs text-gray-500">Average ticket per purchase</div>
                </div>

                <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                    <div className="flex items-center justify-between text-xs font-semibold uppercase text-gray-400">
                        <span>Highest Sale</span>
                        <div className="h-9 w-9 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                            <ArrowUpRight className="h-5 w-5" />
                        </div>
                    </div>
                    <div className="text-2xl font-extrabold text-gray-900 mt-2">
                        ${analytics.maxTransaction.toFixed(2)}
                    </div>
                    <div className="mt-1 text-xs text-gray-500">Single highest completed transaction</div>
                </div>

                <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                    <div className="flex items-center justify-between text-xs font-semibold uppercase text-gray-400">
                        <span>Completed Volume</span>
                        <div className="h-9 w-9 rounded-lg bg-[#651313]/10 text-[#651313] flex items-center justify-center">
                            <CreditCard className="h-5 w-5" />
                        </div>
                    </div>
                    <div className="text-2xl font-extrabold text-gray-900 mt-2">
                        {analytics.completedCount} orders
                    </div>
                    <div className="mt-1 text-xs text-gray-500">Successfully verified payments</div>
                </div>
            </div>

            {/* Monthly Revenue Chart Visualization */}
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-base font-bold text-gray-900">Monthly Revenue Stream</h2>
                        <p className="text-xs text-gray-500">Monthly breakdown of gross completed earnings</p>
                    </div>
                    <span className="text-xs font-semibold text-gray-500 px-2.5 py-1 bg-gray-50 rounded-lg border border-gray-200">
                        Last 6 Months
                    </span>
                </div>

                {monthlyRevenue.length === 0 ? (
                    <div className="py-12 text-center text-gray-400 text-sm">No monthly analytics recorded yet.</div>
                ) : (
                    <div className="pt-6 pb-2">
                        <div className="flex items-end justify-between gap-4 h-64 border-b border-gray-100 pb-3">
                            {monthlyRevenue.map((m, idx) => {
                                const heightPercent = Math.max(8, Math.round((m.revenue / maxMonthlyRev) * 100));
                                return (
                                    <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end group">
                                        <div className="text-[11px] font-bold text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity mb-2">
                                            ${Number(m.revenue).toFixed(2)}
                                        </div>
                                        <div
                                            style={{ height: `${heightPercent}%` }}
                                            className="w-full max-w-[48px] bg-gradient-to-t from-[#651313] to-[#EB4724] rounded-t-lg transition-all duration-300 hover:brightness-110 shadow-sm"
                                        />
                                        <div className="mt-2 text-center">
                                            <span className="text-xs font-semibold text-gray-700 block">{m.label}</span>
                                            <span className="text-[10px] text-gray-400">{m.year}</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>

            {/* Category Breakdown & Top Spenders */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Revenue by Stream */}
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-4">
                    <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                        <Layers className="h-4 w-4 text-[#651313]" />
                        <span>Revenue by Product Stream</span>
                    </h3>

                    <div className="space-y-4 pt-2">
                        {analytics.categories.map((cat, idx) => {
                            const percent = analytics.totalRevenue > 0
                                ? Math.round((cat.revenue / analytics.totalRevenue) * 100)
                                : 0;
                            const Icon = cat.icon;

                            return (
                                <div key={idx} className="space-y-1.5">
                                    <div className="flex items-center justify-between text-xs font-medium">
                                        <span className="flex items-center gap-2 text-gray-700">
                                            <Icon className={`h-4 w-4 ${cat.text}`} />
                                            <span className="font-semibold">{cat.name}</span>
                                            <span className="text-gray-400">({cat.count} orders)</span>
                                        </span>
                                        <span className="font-bold text-gray-900">
                                            ${cat.revenue.toFixed(2)} ({percent}%)
                                        </span>
                                    </div>
                                    <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                                        <div
                                            style={{ width: `${percent}%` }}
                                            className={`h-full ${cat.color} rounded-full transition-all duration-500`}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Top Spenders */}
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-4">
                    <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                        <PieChart className="h-4 w-4 text-[#651313]" />
                        <span>Top Contributing Clients</span>
                    </h3>

                    <div className="divide-y divide-gray-100 pt-1">
                        {analytics.topSpenders.length === 0 ? (
                            <p className="py-6 text-center text-xs text-gray-400">No client transactions yet.</p>
                        ) : (
                            analytics.topSpenders.map((client, idx) => (
                                <div key={idx} className="py-3 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="h-8 w-8 rounded-full bg-gray-100 text-gray-700 font-bold text-xs flex items-center justify-center">
                                            #{idx + 1}
                                        </div>
                                        <div>
                                            <div className="text-xs font-semibold text-gray-900">{client.name}</div>
                                            <div className="text-[11px] text-gray-500">{client.email || `${client.count} transactions`}</div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-xs font-bold text-gray-900">${client.total.toFixed(2)}</div>
                                        <div className="text-[10px] text-gray-400">{client.count} purchases</div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
