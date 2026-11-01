"use client";

import { useState, useEffect, useMemo } from "react";
import { getAllTransactions } from "@/api-client/transactionApi";
import {
    CreditCard,
    DollarSign,
    CheckCircle2,
    Clock,
    AlertCircle,
    Printer,
    RefreshCw,
    Search,
    Filter,
    Calendar,
    ChevronRight,
    Eye,
    X,
    TrendingUp,
    Tag,
    Receipt,
    Globe,
    Server,
    Briefcase
} from "lucide-react";
import toast from "react-hot-toast";

interface TransactionItem {
    id: number;
    domainName?: string | null;
    serviceId?: number | null;
    hostingPackageId?: number | null;
    packageId?: string | null;
    userId: number;
    type: string;
    amount: number;
    originalAmount?: number;
    discountApplied?: number;
    status: string;
    paymentReferenceId?: string | null;
    currency?: string;
    description?: string | null;
    paymentMethod?: string | null;
    completedAt?: string | null;
    createdAt: string;
    user?: {
        id: number;
        name?: string;
        fullName?: string;
        username?: string;
        email?: string;
        phone?: string;
    };
    service?: {
        id: number;
        serviceTitle: string;
    };
    hostingPackage?: {
        id: number;
        name: string;
    };
}

export default function TransactionsReportPage() {
    const [transactions, setTransactions] = useState<TransactionItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [typeFilter, setTypeFilter] = useState("all");
    const [dateRange, setDateRange] = useState("all");
    const [customStartDate, setCustomStartDate] = useState("");
    const [customEndDate, setCustomEndDate] = useState("");
    const [selectedTx, setSelectedTx] = useState<TransactionItem | null>(null);
    const [pageSize, setPageSize] = useState(15);
    const [currentPage, setCurrentPage] = useState(1);

    const fetchTransactions = async () => {
        try {
            setLoading(true);
            const res = await getAllTransactions();
            const list = res.data?.transactions || [];
            setTransactions(list);
        } catch (error: any) {
            console.error("Failed to fetch transactions:", error);
            toast.error(error.response?.data?.message || "Failed to load transactions report");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTransactions();
    }, []);

    // Filter Logic
    const filteredTransactions = useMemo(() => {
        const now = new Date();

        return transactions.filter((tx) => {
            // Status filter
            if (statusFilter !== "all" && tx.status?.toLowerCase() !== statusFilter.toLowerCase()) {
                return false;
            }

            // Type filter
            if (typeFilter !== "all" && tx.type?.toLowerCase() !== typeFilter.toLowerCase()) {
                return false;
            }

            // Date range filter
            if (tx.createdAt) {
                const txDate = new Date(tx.createdAt);

                if (dateRange === "today") {
                    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                    if (txDate < today) return false;
                } else if (dateRange === "7days") {
                    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                    if (txDate < sevenDaysAgo) return false;
                } else if (dateRange === "thisMonth") {
                    const firstDayMonth = new Date(now.getFullYear(), now.getMonth(), 1);
                    if (txDate < firstDayMonth) return false;
                } else if (dateRange === "lastMonth") {
                    const firstDayLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
                    const lastDayLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);
                    if (txDate < firstDayLastMonth || txDate > lastDayLastMonth) return false;
                } else if (dateRange === "thisYear") {
                    const firstDayYear = new Date(now.getFullYear(), 0, 1);
                    if (txDate < firstDayYear) return false;
                } else if (dateRange === "custom") {
                    if (customStartDate && txDate < new Date(customStartDate)) return false;
                    if (customEndDate) {
                        const end = new Date(customEndDate);
                        end.setHours(23, 59, 59, 999);
                        if (txDate > end) return false;
                    }
                }
            }

            // Text search
            if (search.trim()) {
                const q = search.toLowerCase();
                const userName = (tx.user?.name || tx.user?.fullName || tx.user?.username || "").toLowerCase();
                const userEmail = (tx.user?.email || "").toLowerCase();
                const userPhone = (tx.user?.phone || "").toLowerCase();
                const ref = (tx.paymentReferenceId || "").toLowerCase();
                const desc = (tx.description || "").toLowerCase();
                const domain = (tx.domainName || "").toLowerCase();
                const idStr = String(tx.id);
                const amountStr = String(tx.amount);

                const matches =
                    userName.includes(q) ||
                    userEmail.includes(q) ||
                    userPhone.includes(q) ||
                    ref.includes(q) ||
                    desc.includes(q) ||
                    domain.includes(q) ||
                    idStr.includes(q) ||
                    amountStr.includes(q);

                if (!matches) return false;
            }

            return true;
        });
    }, [transactions, statusFilter, typeFilter, dateRange, customStartDate, customEndDate, search]);

    // Financial calculations
    const stats = useMemo(() => {
        let totalGross = 0;
        let totalCompleted = 0;
        let completedCount = 0;
        let pendingCount = 0;
        let pendingAmount = 0;
        let totalDiscounts = 0;

        filteredTransactions.forEach((tx) => {
            const amount = Number(tx.amount) || 0;
            const discount = Number(tx.discountApplied) || 0;
            totalDiscounts += discount;

            if (tx.status === "completed") {
                totalCompleted += amount;
                completedCount += 1;
            } else if (tx.status === "pending") {
                pendingCount += 1;
                pendingAmount += amount;
            }
            totalGross += amount;
        });

        const successRate = filteredTransactions.length > 0
            ? Math.round((completedCount / filteredTransactions.length) * 100)
            : 0;

        return {
            totalGross,
            totalCompleted,
            completedCount,
            pendingCount,
            pendingAmount,
            totalDiscounts,
            successRate,
            totalCount: filteredTransactions.length
        };
    }, [filteredTransactions]);

    // Pagination
    const totalPages = Math.ceil(filteredTransactions.length / pageSize) || 1;
    const paginatedItems = useMemo(() => {
        const start = (currentPage - 1) * pageSize;
        return filteredTransactions.slice(start, start + pageSize);
    }, [filteredTransactions, currentPage, pageSize]);

    function formatType(type?: string) {
        if (!type) return "Payment";
        if (type === "service_payment") return "Service";
        if (type === "hosting_payment") return "Hosting";
        if (type === "register") return "Domain Registration";
        if (type === "payment") return "General Payment";
        return type.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase());
    }

    function getTypeIcon(type?: string) {
        if (type === "service_payment") return <Briefcase className="h-4 w-4 text-purple-600" />;
        if (type === "hosting_payment") return <Server className="h-4 w-4 text-blue-600" />;
        if (type === "register") return <Globe className="h-4 w-4 text-emerald-600" />;
        return <CreditCard className="h-4 w-4 text-gray-600" />;
    }

    function getStatusBadge(status?: string) {
        const s = (status || "pending").toLowerCase();
        if (s === "completed" || s === "success") {
            return (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-600"></span>
                    Completed
                </span>
            );
        }
        if (s === "pending") {
            return (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                    Pending
                </span>
            );
        }
        return (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                <span className="h-1.5 w-1.5 rounded-full bg-rose-600"></span>
                Failed
            </span>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                <div>
                    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#651313]">
                        <Receipt className="h-4 w-4" />
                        <span>Financial Reports</span>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mt-1">Transactions Report</h1>
                    <p className="text-sm text-gray-500 mt-0.5">
                        Real-time transaction logs, reconciliation, customer orders, and revenue audits
                    </p>
                </div>

                <div className="flex items-center gap-2.5">
                    <button
                        onClick={fetchTransactions}
                        disabled={loading}
                        className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 hover:text-gray-900 transition-colors shadow-sm disabled:opacity-50"
                        title="Refresh data"
                    >
                        <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin text-[#651313]" : "text-gray-500"}`} />
                        <span>Refresh</span>
                    </button>
                </div>
            </div>

            {/* KPI Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Total Gross Volume */}
                <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm relative overflow-hidden">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">Gross Collected</span>
                        <div className="h-10 w-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                            <DollarSign className="h-5 w-5" />
                        </div>
                    </div>
                    <div className="mt-3">
                        <div className="text-2xl font-bold text-gray-900">
                            ${stats.totalCompleted.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </div>
                        <div className="mt-1 flex items-center gap-2 text-xs text-gray-500">
                            <span className="text-emerald-600 font-semibold flex items-center">
                                <CheckCircle2 className="h-3.5 w-3.5 mr-0.5" />
                                {stats.completedCount} paid
                            </span>
                            <span>•</span>
                            <span>{stats.successRate}% success rate</span>
                        </div>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-emerald-500" />
                </div>

                {/* Total Transactions Count */}
                <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm relative overflow-hidden">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">Total Transactions</span>
                        <div className="h-10 w-10 rounded-lg bg-[#651313]/10 text-[#651313] flex items-center justify-center">
                            <Receipt className="h-5 w-5" />
                        </div>
                    </div>
                    <div className="mt-3">
                        <div className="text-2xl font-bold text-gray-900">
                            {stats.totalCount}
                        </div>
                        <div className="mt-1 text-xs text-gray-500">
                            Across all services & domain requests
                        </div>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#651313]" />
                </div>

                {/* Pending Payments */}
                <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm relative overflow-hidden">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">Pending Approvals</span>
                        <div className="h-10 w-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                            <Clock className="h-5 w-5" />
                        </div>
                    </div>
                    <div className="mt-3">
                        <div className="text-2xl font-bold text-gray-900">
                            ${stats.pendingAmount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </div>
                        <div className="mt-1 flex items-center gap-1.5 text-xs text-amber-600 font-medium">
                            <span>{stats.pendingCount} transactions awaiting verification</span>
                        </div>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-amber-500" />
                </div>

                {/* Total Discounts Applied */}
                <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm relative overflow-hidden">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">Discounts & Savings</span>
                        <div className="h-10 w-10 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
                            <Tag className="h-5 w-5" />
                        </div>
                    </div>
                    <div className="mt-3">
                        <div className="text-2xl font-bold text-gray-900">
                            ${stats.totalDiscounts.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </div>
                        <div className="mt-1 text-xs text-gray-500">
                            Promotional codes & milestones applied
                        </div>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#EB4724]" />
                </div>
            </div>

            {/* Filter & Search Toolbar */}
            <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm space-y-4">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    {/* Search Bar */}
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by ID, customer, email, phone, reference..."
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="w-full pl-10 pr-9 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#EB4724] focus:border-transparent transition-all"
                        />
                        {search && (
                            <button
                                onClick={() => setSearch("")}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        )}
                    </div>

                    {/* Date Presets */}
                    <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-xs font-medium text-gray-500 mr-1 flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5" /> Date:
                        </span>
                        {[
                            { id: "all", label: "All Time" },
                            { id: "today", label: "Today" },
                            { id: "7days", label: "7 Days" },
                            { id: "thisMonth", label: "This Month" },
                            { id: "lastMonth", label: "Last Month" },
                            { id: "thisYear", label: "This Year" },
                            { id: "custom", label: "Custom" },
                        ].map((btn) => (
                            <button
                                key={btn.id}
                                onClick={() => {
                                    setDateRange(btn.id);
                                    setCurrentPage(1);
                                }}
                                className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                                    dateRange === btn.id
                                        ? "bg-[#651313] text-white shadow-sm"
                                        : "bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900"
                                }`}
                            >
                                {btn.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Custom Date Range pickers if custom selected */}
                {dateRange === "custom" && (
                    <div className="pt-2 border-t border-gray-100 flex items-center gap-3 flex-wrap">
                        <div className="flex items-center gap-2 text-xs">
                            <span className="text-gray-600 font-medium">From:</span>
                            <input
                                type="date"
                                value={customStartDate}
                                onChange={(e) => {
                                    setCustomStartDate(e.target.value);
                                    setCurrentPage(1);
                                }}
                                className="border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#EB4724]"
                            />
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                            <span className="text-gray-600 font-medium">To:</span>
                            <input
                                type="date"
                                value={customEndDate}
                                onChange={(e) => {
                                    setCustomEndDate(e.target.value);
                                    setCurrentPage(1);
                                }}
                                className="border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#EB4724]"
                            />
                        </div>
                    </div>
                )}

                {/* Filter dropdowns */}
                <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-gray-100">
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Filter className="h-3.5 w-3.5 text-gray-400" />
                        <span>Filter by:</span>
                    </div>

                    {/* Status Dropdown */}
                    <select
                        value={statusFilter}
                        onChange={(e) => {
                            setStatusFilter(e.target.value);
                            setCurrentPage(1);
                        }}
                        className="text-xs bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#EB4724]"
                    >
                        <option value="all">All Statuses</option>
                        <option value="completed">Completed</option>
                        <option value="pending">Pending</option>
                        <option value="failed">Failed</option>
                    </select>

                    {/* Type Dropdown */}
                    <select
                        value={typeFilter}
                        onChange={(e) => {
                            setTypeFilter(e.target.value);
                            setCurrentPage(1);
                        }}
                        className="text-xs bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#EB4724]"
                    >
                        <option value="all">All Types</option>
                        <option value="service_payment">Services</option>
                        <option value="hosting_payment">Hosting</option>
                        <option value="register">Domain Registration</option>
                    </select>

                    {/* Clear Filters */}
                    {(statusFilter !== "all" || typeFilter !== "all" || dateRange !== "all" || search) && (
                        <button
                            onClick={() => {
                                setStatusFilter("all");
                                setTypeFilter("all");
                                setDateRange("all");
                                setSearch("");
                                setCustomStartDate("");
                                setCustomEndDate("");
                                setCurrentPage(1);
                            }}
                            className="text-xs font-semibold text-[#EB4724] hover:underline ml-auto"
                        >
                            Reset All Filters
                        </button>
                    )}
                </div>
            </div>

            {/* Transactions Table */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                    <div>
                        <h2 className="text-base font-bold text-gray-900">Transaction Logs</h2>
                        <p className="text-xs text-gray-500">
                            Showing {filteredTransactions.length === 0 ? 0 : (currentPage - 1) * pageSize + 1} to{" "}
                            {Math.min(currentPage * pageSize, filteredTransactions.length)} of {filteredTransactions.length} records
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500">Rows per page:</span>
                        <select
                            value={pageSize}
                            onChange={(e) => {
                                setPageSize(Number(e.target.value));
                                setCurrentPage(1);
                            }}
                            className="text-xs border border-gray-200 rounded-md px-2 py-1 text-gray-700"
                        >
                            <option value={10}>10</option>
                            <option value={15}>15</option>
                            <option value={25}>25</option>
                            <option value={50}>50</option>
                        </select>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-[#651313] text-white">
                            <tr>
                                <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider">Tx ID / Ref</th>
                                <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider">Customer</th>
                                <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider">Item / Service</th>
                                <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider">Type</th>
                                <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider">Amount</th>
                                <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider">Method</th>
                                <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider">Date</th>
                                <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                [1, 2, 3, 4, 5].map((i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan={9} className="px-6 py-4">
                                            <div className="h-6 bg-gray-100 rounded w-full"></div>
                                        </td>
                                    </tr>
                                ))
                            ) : paginatedItems.length === 0 ? (
                                <tr>
                                    <td colSpan={9} className="px-6 py-12 text-center text-gray-400 text-sm">
                                        <Receipt className="h-10 w-10 mx-auto text-gray-300 mb-2" />
                                        No transactions match the selected filters.
                                    </td>
                                </tr>
                            ) : (
                                paginatedItems.map((tx, idx) => {
                                    const userName =
                                        tx.user?.name ||
                                        tx.user?.fullName ||
                                        tx.user?.username ||
                                        `Customer #${tx.userId}`;
                                    const userContact = tx.user?.email || tx.user?.phone || "-";
                                    const itemTitle =
                                        tx.service?.serviceTitle ||
                                        tx.hostingPackage?.name ||
                                        tx.domainName ||
                                        tx.description ||
                                        "Payment";

                                    return (
                                        <tr
                                            key={tx.id}
                                            className={`transition-colors hover:bg-gray-50/80 ${
                                                idx % 2 === 0 ? "bg-white" : "bg-gray-50/30"
                                            }`}
                                        >
                                            {/* ID & Ref */}
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col">
                                                    <span className="font-mono font-bold text-gray-900 text-xs">
                                                        #{tx.id}
                                                    </span>
                                                    <span className="text-[11px] font-mono text-gray-500 truncate max-w-[120px]">
                                                        {tx.paymentReferenceId || "-"}
                                                    </span>
                                                </div>
                                            </td>

                                            {/* Customer */}
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2.5">
                                                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#651313] to-[#EB4724] text-white flex items-center justify-center text-xs font-bold shrink-0">
                                                        {userName.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="font-semibold text-gray-900 text-xs truncate max-w-[160px]">
                                                            {userName}
                                                        </span>
                                                        <span className="text-[11px] text-gray-500 truncate max-w-[160px]">
                                                            {userContact}
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Item */}
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col max-w-[200px]">
                                                    <span className="font-medium text-gray-900 text-xs truncate">
                                                        {itemTitle}
                                                    </span>
                                                    {tx.description && tx.description !== itemTitle && (
                                                        <span className="text-[11px] text-gray-500 truncate">
                                                            {tx.description}
                                                        </span>
                                                    )}
                                                </div>
                                            </td>

                                            {/* Type */}
                                            <td className="px-6 py-4">
                                                <span className="inline-flex items-center gap-1 text-xs text-gray-700 font-medium">
                                                    {getTypeIcon(tx.type)}
                                                    <span>{formatType(tx.type)}</span>
                                                </span>
                                            </td>

                                            {/* Amount */}
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-gray-900 text-sm">
                                                        ${Number(tx.amount || 0).toFixed(2)}
                                                    </span>
                                                    {Number(tx.discountApplied || 0) > 0 && (
                                                        <span className="text-[10px] text-emerald-600 font-semibold">
                                                            -${Number(tx.discountApplied).toFixed(2)} off
                                                        </span>
                                                    )}
                                                </div>
                                            </td>

                                            {/* Payment Method */}
                                            <td className="px-6 py-4">
                                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-700">
                                                    {tx.paymentMethod || "Waafipay"}
                                                </span>
                                            </td>

                                            {/* Status */}
                                            <td className="px-6 py-4">
                                                {getStatusBadge(tx.status)}
                                            </td>

                                            {/* Date */}
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col text-xs text-gray-600">
                                                    <span>{tx.createdAt ? new Date(tx.createdAt).toLocaleDateString() : "-"}</span>
                                                    <span className="text-[10px] text-gray-400">
                                                        {tx.createdAt ? new Date(tx.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ""}
                                                    </span>
                                                </div>
                                            </td>

                                            {/* Actions */}
                                            <td className="px-6 py-4 text-right">
                                                <button
                                                    onClick={() => setSelectedTx(tx)}
                                                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-[#651313] hover:text-white hover:border-[#651313] transition-all"
                                                >
                                                    <Eye className="h-3.5 w-3.5" />
                                                    <span>Receipt</span>
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                    <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-600">
                        <span>
                            Page {currentPage} of {totalPages}
                        </span>

                        <div className="flex items-center gap-1.5">
                            <button
                                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                                className="px-3 py-1.5 rounded border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed font-medium"
                            >
                                Previous
                            </button>

                            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                let pageNum = i + 1;
                                if (totalPages > 5 && currentPage > 3) {
                                    pageNum = currentPage - 2 + i;
                                    if (pageNum > totalPages) pageNum = totalPages - (4 - i);
                                }
                                return (
                                    <button
                                        key={pageNum}
                                        onClick={() => setCurrentPage(pageNum)}
                                        className={`px-3 py-1.5 rounded border font-medium ${
                                            currentPage === pageNum
                                                ? "bg-[#651313] text-white border-[#651313]"
                                                : "border-gray-200 hover:bg-gray-50 text-gray-700"
                                        }`}
                                    >
                                        {pageNum}
                                    </button>
                                );
                            })}

                            <button
                                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages}
                                className="px-3 py-1.5 rounded border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed font-medium"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Receipt / Details Modal */}
            {selectedTx && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
                    <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-gray-100 overflow-hidden">
                        {/* Receipt Top Banner */}
                        <div className="bg-[#651313] px-6 py-5 text-white flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center">
                                    <Receipt className="h-5 w-5 text-white" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-base">Payment Receipt</h3>
                                    <p className="text-xs text-white/70">Tx ID: #{selectedTx.id} • Deero Advert</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setSelectedTx(null)}
                                className="h-8 w-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        {/* Receipt Content */}
                        <div className="p-6 space-y-5">
                            {/* Status and Big Amount */}
                            <div className="text-center py-3 bg-gray-50 rounded-xl border border-gray-100">
                                <div className="text-3xl font-extrabold text-gray-900">
                                    ${Number(selectedTx.amount).toFixed(2)}
                                </div>
                                <div className="mt-1.5 flex justify-center">
                                    {getStatusBadge(selectedTx.status)}
                                </div>
                                {selectedTx.paymentReferenceId && (
                                    <p className="text-[11px] text-gray-500 font-mono mt-1">
                                        Ref: {selectedTx.paymentReferenceId}
                                    </p>
                                )}
                            </div>

                            {/* Customer Information */}
                            <div className="space-y-2 text-xs">
                                <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                                    Customer Details
                                </span>
                                <div className="p-3 bg-gray-50/50 rounded-lg border border-gray-100 space-y-1.5">
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Name:</span>
                                        <span className="font-semibold text-gray-800">
                                            {selectedTx.user?.name || selectedTx.user?.fullName || selectedTx.user?.username || `User #${selectedTx.userId}`}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Email:</span>
                                        <span className="text-gray-800">{selectedTx.user?.email || "-"}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Phone:</span>
                                        <span className="text-gray-800">{selectedTx.user?.phone || "-"}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Item & Financial Breakdown */}
                            <div className="space-y-2 text-xs">
                                <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                                    Order Summary
                                </span>
                                <div className="p-3 bg-gray-50/50 rounded-lg border border-gray-100 space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Item Description:</span>
                                        <span className="font-medium text-gray-900 text-right max-w-[240px]">
                                            {selectedTx.description || selectedTx.service?.serviceTitle || selectedTx.hostingPackage?.name || selectedTx.domainName || "Service"}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Category:</span>
                                        <span className="font-medium text-gray-800">{formatType(selectedTx.type)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Payment Method:</span>
                                        <span className="font-medium text-gray-800">{selectedTx.paymentMethod || "Waafipay"}</span>
                                    </div>
                                    {Number(selectedTx.originalAmount || 0) > 0 && selectedTx.originalAmount !== selectedTx.amount && (
                                        <div className="flex justify-between text-gray-500">
                                            <span>Original Price:</span>
                                            <span>${Number(selectedTx.originalAmount).toFixed(2)}</span>
                                        </div>
                                    )}
                                    {Number(selectedTx.discountApplied || 0) > 0 && (
                                        <div className="flex justify-between text-emerald-600 font-medium">
                                            <span>Discount Applied:</span>
                                            <span>-${Number(selectedTx.discountApplied).toFixed(2)}</span>
                                        </div>
                                    )}
                                    <div className="pt-2 border-t border-gray-200 flex justify-between font-bold text-gray-900 text-sm">
                                        <span>Total Paid:</span>
                                        <span className="text-[#651313]">${Number(selectedTx.amount).toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Timestamps */}
                            <div className="flex justify-between text-[11px] text-gray-400 border-t border-gray-100 pt-3">
                                <span>Created: {new Date(selectedTx.createdAt).toLocaleString()}</span>
                                {selectedTx.completedAt && (
                                    <span>Completed: {new Date(selectedTx.completedAt).toLocaleString()}</span>
                                )}
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                            <button
                                onClick={() => setSelectedTx(null)}
                                className="px-4 py-2 rounded-lg border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-100 transition-colors"
                            >
                                Close
                            </button>
                            <button
                                onClick={() => window.print()}
                                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#651313] text-white text-xs font-semibold hover:bg-[#520f0f] transition-colors"
                            >
                                <Printer className="h-3.5 w-3.5" />
                                <span>Print Receipt</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
