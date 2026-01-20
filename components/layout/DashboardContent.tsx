"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Users, TrendingUp, Activity, Briefcase, Award, ArrowUpRight, Globe, CreditCard, Clock } from "lucide-react";
import { getAllServices } from "@/api/serviceApi";
import { getAllUsers } from "@/api/usersApi";
import { getAllAchievements } from "@/api/achievementApi";
import { getAllEventsNews } from "@/api/eventsNewsApi";
import { getMajorClients } from "@/api/majorClientApi";
import { getAllTransactions, getTransactionsByUser, getRevenueAnalytics } from "@/api/transactionApi";
import { getDomainsByUser } from "@/api/domainApi";
import DataTable from "@/components/layout/DataTable";
import { Transaction } from "@/types/transaction";
import { isAdminOrManager, getUserId, isUser, getUserRole } from "@/utils/auth";

export default function DashboardContent() {
    const [stats, setStats] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [topUsers, setTopUsers] = useState<any[]>([]);
    const [usersLoading, setUsersLoading] = useState(true);
    const [eventsNews, setEventsNews] = useState<any[]>([]);
    const [eventsLoading, setEventsLoading] = useState(true);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [transactionsLoading, setTransactionsLoading] = useState(true);

    // Revenue Analytics State
    const [revenueData, setRevenueData] = useState<any[]>([]);
    const [revenueLoading, setRevenueLoading] = useState(false);

    const isPrivileged = isAdminOrManager();
    const userId = getUserId();
    const userRole = getUserRole(); // Get role

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);
                setTransactionsLoading(true);

                if (isPrivileged) {
                    setRevenueLoading(true);
                    // ADMIN/MANAGER STATS - Global
                    const [servicesRes, usersRes, achievementsRes, transactionsRes, revenueRes] = await Promise.all([
                        getAllServices(),
                        getAllUsers(),
                        getAllAchievements(),
                        getAllTransactions(),
                        getRevenueAnalytics(),
                    ]);

                    const servicesResAny = servicesRes as any;
                    const achievementsResAny = achievementsRes as any;
                    const transactionsData = transactionsRes.data?.transactions || [];

                    // Set revenue data
                    if (revenueRes.data && revenueRes.data.success) {
                        setRevenueData(revenueRes.data.data);
                    }


                    const servicesCount = servicesResAny.data?.count || servicesResAny.data?.data?.length || 0;
                    const usersCount = Array.isArray(usersRes.data) ? usersRes.data.length : 0;
                    const achievementsCount = achievementsResAny.data?.count || achievementsResAny.data?.data?.length || 0;

                    const totalRevenue = transactionsData
                        .filter((t: any) => t.status === "completed")
                        .reduce((acc: number, t: any) => acc + (t.amount || 0), 0);

                    const formatNumber = (num: number) => num.toLocaleString();

                    // Sort transactions by date (newest first)
                    transactionsData.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

                    setTransactions(transactionsData);
                    setStats([
                        {
                            title: "Total Services",
                            value: formatNumber(servicesCount),
                            change: "Active services offered",
                            icon: Briefcase,
                            color: "bg-blue-100 text-blue-700",
                        },
                        {
                            title: "Total Users",
                            value: formatNumber(usersCount),
                            change: "Total registered users",
                            icon: Users,
                            color: "bg-green-100 text-green-700",
                        },
                        {
                            title: "Achievements",
                            value: formatNumber(achievementsCount),
                            change: "Awards & Recognitions",
                            icon: Award,
                            color: "bg-orange-100 text-orange-700",
                        },
                        {
                            title: "Total Revenue",
                            value: `$${formatNumber(totalRevenue)}`,
                            change: "Completed transactions",
                            icon: TrendingUp,
                            color: "bg-purple-100 text-purple-700",
                        },
                    ]);
                } else if (userId) {
                    setRevenueLoading(true);
                    // REGULAR USER STATS - Personal
                    const [domainsRes, transactionsRes, revenueRes] = await Promise.all([
                        getDomainsByUser(userId),
                        getTransactionsByUser(userId),
                        getRevenueAnalytics(userId),
                    ]);

                    const myDomains = domainsRes.data?.domains || [];
                    const myTransactions = transactionsRes.data?.transactions || [];

                    // Filter domains to only count those with completed transactions
                    const activeDomainsCount = myDomains.filter((d: any) => {
                        return myTransactions.some((t: any) =>
                            t.status === "completed" &&
                            (typeof t.domain === 'object' ? t.domain?._id === d._id : t.domain === d._id)
                        );
                    }).length;

                    // Set revenue data (Spending Overview)
                    if (revenueRes.data && revenueRes.data.success) {
                        setRevenueData(revenueRes.data.data);
                    }

                    const totalSpent = myTransactions
                        .filter((t: any) => t.status === "completed")
                        .reduce((acc: number, t: any) => acc + (t.amount || 0), 0);

                    const pendingPayments = myTransactions.filter((t: any) => t.status === "pending").length;

                    // Sort user transactions by date (newest first)
                    myTransactions.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

                    setTransactions(myTransactions);
                    setStats([
                        {
                            title: "My Domains",
                            value: activeDomainsCount.toString(),
                            change: "Registered domains",
                            icon: Globe,
                            color: "bg-blue-100 text-blue-700",
                        },
                        {
                            title: "Total Transactions",
                            value: myTransactions.filter((t: any) => t.status === "completed").length.toString(),
                            change: "Order history count",
                            icon: Activity,
                            color: "bg-green-100 text-green-700",
                        },
                        {
                            title: "Pending Payments",
                            value: pendingPayments.toString(),
                            change: "Awaiting confirmation",
                            icon: Clock,
                            color: "bg-orange-100 text-orange-700",
                        },
                        {
                            title: "Total Payments",
                            value: `$${totalSpent.toLocaleString()}`,
                            change: "Completed orders",
                            icon: CreditCard,
                            color: "bg-purple-100 text-purple-700",
                        },
                    ]);
                }
            } catch (error) {
                console.error("Error fetching dashboard data:", error);
            } finally {
                setLoading(false);
                setTransactionsLoading(false);
                setRevenueLoading(false);
            }
        };

        fetchDashboardData();
    }, [isPrivileged, userId]);

    useEffect(() => {
        if (!isPrivileged) {
            setUsersLoading(false);
            return;
        }

        const fetchTopUsers = async () => {
            try {
                setUsersLoading(true);
                const res = await getAllUsers();
                const users = Array.isArray(res.data) ? res.data : [];
                const regularUsers = users.filter((user: any) => {
                    const roleName = typeof user.role === 'object' ? user.role?.name : user.role;
                    return roleName === "user";
                });
                const sortedUsers = [...regularUsers]
                    .sort((a, b) => {
                        const dateA = new Date(a.createdAt || a._id).getTime();
                        const dateB = new Date(b.createdAt || b._id).getTime();
                        return dateB - dateA;
                    })
                    .slice(0, 10);
                setTopUsers(sortedUsers);
            } catch (error) {
                console.error("Error fetching top users:", error);
            } finally {
                setUsersLoading(false);
            }
        };
        fetchTopUsers();
    }, [isPrivileged]);

    useEffect(() => {
        const fetchEventsNews = async () => {
            try {
                setEventsLoading(true);
                const res = await getAllEventsNews();
                if (res.data.success) {
                    setEventsNews(res.data.data.slice(0, 5));
                }
            } catch (error) {
                console.error("Error fetching events & news:", error);
            } finally {
                setEventsLoading(false);
            }
        };
        fetchEventsNews();
    }, []);

    return (
        <div className="space-y-6">


            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {loading ? (
                    [1, 2, 3, 4].map((i) => (
                        <div key={i} className="group relative overflow-hidden rounded-2xl bg-white p-5 shadow-sm border border-gray-100/50 animate-pulse h-32" />
                    ))
                ) : (
                    stats.map((stat, index) => {
                        const Icon = stat.icon;
                        return (
                            <div key={index} className="group relative overflow-hidden rounded-2xl bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg border border-gray-100/50">
                                <div className="absolute right-0 top-0 -mr-4 -mt-4 h-20 w-20 rounded-full bg-gray-50 opacity-50 transition-transform group-hover:scale-110"></div>
                                <div className="relative flex items-start justify-between">
                                    <div>
                                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">{stat.title}</p>
                                        <h3 className="mt-1 text-2xl font-bold text-gray-900">{stat.value}</h3>
                                    </div>
                                    <div className={`rounded-xl p-2.5 ${stat.color} bg-opacity-10 group-hover:scale-110 transition-transform`}>
                                        <Icon className={`h-5 w-5 ${stat.color.replace('bg-', 'text-').replace('100', '600')}`} />
                                    </div>
                                </div>
                                <div className="mt-3 flex items-center gap-2">
                                    <span className="flex items-center gap-1 text-[10px] font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                                        <TrendingUp className="h-3 w-3" />
                                        Active
                                    </span>
                                    <span className="text-xs text-gray-400">{stat.change}</span>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
                <div className="col-span-4 rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
                    {/* ... Revenue Overview unchanged ... */}
                    <div className="mb-4 flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-900">
                            {isPrivileged ? "Revenue Overview" : "Spending Overview"}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-green-600 font-medium">
                            <TrendingUp className="h-4 w-4" />
                            <span>+12.5%</span>
                        </div>
                    </div>
                    {/* ... (SVG content) ... */}
                    {/* Dynamic Revenue Chart */}
                    <div className="h-[300px] relative">
                        {loading || revenueLoading ? (
                            <div className="w-full h-full flex items-center justify-center">
                                <span className="animate-spin h-8 w-8 border-4 border-[#EB4724] border-t-transparent rounded-full"></span>
                            </div>
                        ) : (
                            <svg viewBox="0 0 600 300" className="w-full h-full">
                                <defs>
                                    <linearGradient id="revenueGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                        <stop offset="0%" stopColor="#EB4724" stopOpacity="0.3" />
                                        <stop offset="100%" stopColor="#EB4724" stopOpacity="0.05" />
                                    </linearGradient>
                                    <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                        <stop offset="0%" stopColor="#651313" />
                                        <stop offset="100%" stopColor="#EB4724" />
                                    </linearGradient>
                                </defs>
                                {/* Grid Lines */}
                                {[0, 1, 2, 3, 4].map((i) => (
                                    <line key={i} x1="50" y1={50 + i * 50} x2="550" y2={50 + i * 50} stroke="#f3f4f6" strokeWidth="1" />
                                ))}

                                {/* Dynamic Path Generation */}
                                {(() => {
                                    if (!revenueData || revenueData.length === 0) {
                                        return (
                                            <text x="300" y="150" textAnchor="middle" className="text-gray-400 text-sm">No revenue data available</text>
                                        );
                                    }

                                    // Calculate maximum revenue to scale Y-axis
                                    const maxRevenue = Math.max(...revenueData.map((d: any) => d.revenue), 100);
                                    // Ensure we scale nicely (add 20% buffer)
                                    const yMax = maxRevenue * 1.2;

                                    // Generate points
                                    // X range: 50 to 550 (width = 500)
                                    // Y range: 250 (bottom) to 50 (top) (height = 200)
                                    // 6 points, so segments = 5. Step X = 500 / 5 = 100

                                    const points = revenueData.map((d: any, i: number) => {
                                        const x = 50 + (i * 100);
                                        // Normalize revenue to height
                                        // ratio = d.revenue / yMax
                                        // y = 250 - (ratio * 200)
                                        const y = 250 - ((d.revenue / yMax) * 200);
                                        return { x, y, val: d.revenue, label: d.label };
                                    });

                                    if (points.length === 0) return null;

                                    // Create path string (Smooth curve using Catmull-Rom or Quadratic Bezier simplification)
                                    // Simple line for now: L x y
                                    let pathD = `M ${points[0].x},${points[0].y}`;
                                    points.slice(1).forEach((p: any) => {
                                        pathD += ` L ${p.x},${p.y}`;
                                    });
                                    // For area fetch, close the path
                                    const areaD = `${pathD} L ${points[points.length - 1].x},250 L ${points[0].x},250 Z`;

                                    // Determine Y-axis labels dynamically
                                    const yLabels = [0, yMax * 0.25, yMax * 0.5, yMax * 0.75, yMax].map(v =>
                                        v >= 1000 ? `$${(v / 1000).toFixed(1)}k` : `$${Math.round(v)}`
                                    );

                                    return (
                                        <>
                                            {/* Y-axis Labels */}
                                            {yLabels.map((label, i) => (
                                                <text key={i} x="40" y={250 - i * 50} textAnchor="end" className="text-xs fill-gray-500" fontSize="12">{label}</text>
                                            ))}

                                            {/* Area Fill */}
                                            <path d={areaD} fill="url(#revenueGradient)" />

                                            {/* Line Stroke */}
                                            <path d={pathD} fill="none" stroke="url(#lineGradient)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

                                            {/* Data Points */}
                                            {points.map((p: any, i: number) => (
                                                <g key={i} className="group relative">
                                                    <circle cx={p.x} cy={p.y} r="5" fill="#EB4724" stroke="white" strokeWidth="2" />
                                                    {/* Tooltip on hover */}
                                                    <title>${p.val.toLocaleString()}</title>
                                                </g>
                                            ))}

                                            {/* X-axis Labels (Months) */}
                                            {points.map((p: any, i: number) => (
                                                <text key={i} x={p.x} y={280} textAnchor="middle" className="text-xs fill-gray-500" fontSize="12">{p.label}</text>
                                            ))}
                                        </>
                                    );
                                })()}
                            </svg>
                        )}
                    </div>
                </div>

                <div className="col-span-3 rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
                    <div className="mb-4 flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-900">Recent Transactions</h3>
                        <Activity className="h-5 w-5 text-[#EB4724]" />
                    </div>
                    <div className="space-y-4">
                        {loading ? [1, 2, 3].map(i => <div key={i} className="h-16 bg-gray-50 rounded-lg animate-pulse" />) :
                            transactions.filter(t => t.status === 'completed').length > 0 ? transactions.filter(t => t.status === 'completed').slice(0, 5).map((t, i) => {
                                // Determine what to display based on transaction type
                                let displayName = 'N/A';

                                if (t.type === 'hosting_payment') {
                                    // For hosting package payments
                                    displayName = typeof t.hostingPackage === 'object' ? t.hostingPackage?.name : 'Hosting Package';
                                } else if (t.type === 'service_payment') {
                                    // For service purchases, show the package name
                                    const packageId = t.packageId;
                                    if (typeof t.service === 'object' && t.service?.packages && packageId) {
                                        const pkg = t.service.packages.find((p: any) => p._id === packageId);
                                        displayName = pkg?.packageTitle || t.service?.serviceTitle || 'Service Purchase';
                                    } else if (typeof t.service === 'object') {
                                        displayName = t.service?.serviceTitle || 'Service Purchase';
                                    }
                                } else {
                                    // For domain purchases, show the domain name
                                    displayName = typeof t.domain === 'object' ? t.domain?.name : 'N/A';
                                }

                                return (
                                    <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 border border-gray-100">
                                        <div className="flex items-center gap-3">
                                            <div className={`p-2 rounded-lg ${t.status === 'completed' ? 'bg-green-100 text-green-600' : t.status === 'failed' ? 'bg-red-100 text-red-600' : 'bg-yellow-100 text-yellow-600'}`}>
                                                <TrendingUp className="h-4 w-4" />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-sm font-semibold text-gray-900 truncate">{displayName}</p>
                                                <p className="text-xs text-gray-500">{new Date(t.createdAt).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-bold text-gray-900">${t.amount}</p>
                                            <p className={`text-[10px] uppercase font-bold ${t.status === 'completed' ? 'text-green-600' : t.status === 'failed' ? 'text-red-600' : 'text-yellow-600'}`}>{t.status}</p>
                                        </div>
                                    </div>
                                );
                            }) : <div className="text-center py-6 text-gray-400 text-sm italic">No transactions found.</div>}
                    </div>
                </div>
            </div>

            {/* Service Purchase History Table for Regular Users */}
            {!isPrivileged && userId && (
                <div className="mt-8">
                    <DataTable
                        title="Service Purchase History"
                        columns={[
                            {
                                label: "Service Name",
                                key: "service",
                                render: (row: any) => {
                                    const serviceName = typeof row.service === 'object' ? row.service?.serviceTitle : "N/A";
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
                        ]}
                        data={transactions.filter(t => t.type === 'service_payment')}
                        showAddButton={false}
                        loading={transactionsLoading}
                    />
                </div>
            )}

            {isPrivileged && (
                <DataTable
                    title="Top 10 Regular Users"
                    columns={[
                        { label: "#", key: "rank", width: "60px", render: (_: any, index: number) => index + 1 },
                        { label: "Fullname", key: "fullname", render: (row: any) => row.fullname },
                        { label: "Email", key: "email" },
                        { label: "Phone", key: "phone" },
                        {
                            label: "Role",
                            key: "role",
                            render: (row: any) => {
                                const roleName = typeof row.role === 'object' ? row.role?.name : row.role;
                                return (
                                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                                        {roleName || "user"}
                                    </span>
                                );
                            }
                        }
                    ]}
                    data={topUsers}
                    showAddButton={false}
                    loading={usersLoading}
                />
            )}
        </div>
    );
}
