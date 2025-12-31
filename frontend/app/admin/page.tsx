"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Users, DollarSign, TrendingUp, Activity, Briefcase, Newspaper, Award, MessageSquare, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { getAllServices } from "@/api/serviceApi";
import { getAllUsers } from "@/api/usersApi";
import { getAllAchievements } from "@/api/achievementApi";
import { getAllEventsNews } from "@/api/eventsNewsApi";
import DataTable from "@/components/admin/DataTable";

export default function AdminPage() {
    const [stats, setStats] = useState([
        {
            title: "Total Services",
            value: "0",
            change: "Active services offered",
            icon: Briefcase,
            color: "bg-blue-100 text-blue-700",
        },
        {
            title: "Total Users",
            value: "0",
            change: "Total registered users",
            icon: Users,
            color: "bg-green-100 text-green-700",
        },
        {
            title: "Achievements",
            value: "0",
            change: "Awards & Recognitions",
            icon: Award,
            color: "bg-orange-100 text-orange-700",
        },
    ]);
    const [loading, setLoading] = useState(true);
    const [topUsers, setTopUsers] = useState<any[]>([]);
    const [usersLoading, setUsersLoading] = useState(true);
    const [eventsNews, setEventsNews] = useState<any[]>([]);
    const [eventsLoading, setEventsLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                setLoading(true);

                // Fetch all data in parallel
                const [servicesRes, usersRes, achievementsRes] = await Promise.all([
                    getAllServices(),
                    getAllUsers(),
                    getAllAchievements(),
                ]);

                // Extract counts from backend responses
                const servicesResAny = servicesRes as any;
                const achievementsResAny = achievementsRes as any;

                const servicesCount = servicesResAny.data?.count || servicesResAny.data?.data?.length || 0;
                const usersCount = Array.isArray(usersRes.data) ? usersRes.data.length : 0;
                const achievementsCount = achievementsResAny.data?.count || achievementsResAny.data?.data?.length || 0;

                // Format numbers with commas
                const formatNumber = (num: number) => {
                    return num.toLocaleString();
                };

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
                ]);
            } catch (error) {
                console.error("Error fetching stats:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    useEffect(() => {
        const fetchTopUsers = async () => {
            try {
                setUsersLoading(true);
                const res = await getAllUsers();
                const users = Array.isArray(res.data) ? res.data : [];

                // Filter only users with role "user" (exclude admins)
                const regularUsers = users.filter((user: any) =>
                    user.role === "user" || !user.role || user.role === undefined
                );

                // Sort by createdAt (newest first) and take top 10
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
    }, []);

    useEffect(() => {
        const fetchEventsNews = async () => {
            try {
                setEventsLoading(true);
                const res = await getAllEventsNews();
                if (res.data.success) {
                    // Take top 5 for the dashboard
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
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight text-[#651313]">Dashboard</h1>

            </div>

            {/* Stats Grid */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {loading ? (
                    // Loading skeleton
                    [1, 2, 3].map((i) => (
                        <div
                            key={i}
                            className="group relative overflow-hidden rounded-2xl bg-white p-5 shadow-sm border border-gray-100/50 animate-pulse"
                        >
                            <div className="absolute right-0 top-0 -mr-4 -mt-4 h-20 w-20 rounded-full bg-gray-50 opacity-50"></div>
                            <div className="relative flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="h-3 w-24 bg-gray-200 rounded mb-2"></div>
                                    <div className="h-8 w-16 bg-gray-200 rounded"></div>
                                </div>
                                <div className="rounded-xl p-2.5 bg-gray-200 w-10 h-10"></div>
                            </div>
                            <div className="mt-3 flex items-center gap-2">
                                <div className="h-4 w-16 bg-gray-200 rounded-full"></div>
                                <div className="h-3 w-24 bg-gray-200 rounded"></div>
                            </div>
                        </div>
                    ))
                ) : (
                    stats.map((stat, index) => {
                        const Icon = stat.icon;
                        return (
                            <div
                                key={index}
                                className="group relative overflow-hidden rounded-2xl bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg border border-gray-100/50"
                            >
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
                                        {stat.change.includes('+') ? '+12%' : 'Active'}
                                    </span>
                                    <span className="text-xs text-gray-400">{stat.change}</span>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {/* Charts Section */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
                {/* Revenue Overview Chart */}
                <div className="col-span-4 rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
                    <div className="mb-4 flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-900">Revenue Overview</h3>
                        <div className="flex items-center gap-2 text-sm">
                            <span className="text-gray-500">Last 6 months</span>
                            <div className="flex items-center gap-1 text-green-600">
                                <TrendingUp className="h-4 w-4" />
                                <span className="font-medium">+12.5%</span>
                            </div>
                        </div>
                    </div>
                    <div className="h-[300px] relative">
                        <svg viewBox="0 0 600 300" className="w-full h-full">
                            {/* Gradient definitions */}
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

                            {/* Grid lines */}
                            {[0, 1, 2, 3, 4].map((i) => (
                                <line
                                    key={i}
                                    x1="50"
                                    y1={50 + i * 50}
                                    x2="550"
                                    y2={50 + i * 50}
                                    stroke="#f3f4f6"
                                    strokeWidth="1"
                                />
                            ))}

                            {/* Data points */}
                            <path
                                d="M 50,200 Q 150,180 250,150 T 450,100 T 550,80"
                                fill="none"
                                stroke="url(#lineGradient)"
                                strokeWidth="3"
                                strokeLinecap="round"
                            />

                            {/* Area fill */}
                            <path
                                d="M 50,200 Q 150,180 250,150 T 450,100 T 550,80 L 550,250 L 50,250 Z"
                                fill="url(#revenueGradient)"
                            />

                            {/* Data points circles */}
                            {[
                                { x: 50, y: 200 },
                                { x: 150, y: 180 },
                                { x: 250, y: 150 },
                                { x: 350, y: 120 },
                                { x: 450, y: 100 },
                                { x: 550, y: 80 },
                            ].map((point, i) => (
                                <circle
                                    key={i}
                                    cx={point.x}
                                    cy={point.y}
                                    r="5"
                                    fill="#EB4724"
                                    stroke="white"
                                    strokeWidth="2"
                                />
                            ))}

                            {/* X-axis labels */}
                            {["Jan", "Feb", "Mar", "Apr", "May", "Jun"].map((label, i) => (
                                <text
                                    key={i}
                                    x={50 + i * 100}
                                    y={280}
                                    textAnchor="middle"
                                    className="text-xs fill-gray-500"
                                    fontSize="12"
                                >
                                    {label}
                                </text>
                            ))}

                            {/* Y-axis labels */}
                            {["$0", "$10k", "$20k", "$30k", "$40k"].map((label, i) => (
                                <text
                                    key={i}
                                    x="30"
                                    y={250 - i * 50}
                                    textAnchor="end"
                                    className="text-xs fill-gray-500"
                                    fontSize="12"
                                >
                                    {label}
                                </text>
                            ))}
                        </svg>
                    </div>
                </div>

                {/* Recent Activity Chart */}
                <div className="col-span-3 rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
                    <div className="mb-4 flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-900">Events & News</h3>
                        <Activity className="h-5 w-5 text-[#EB4724]" />
                    </div>

                    <div className="space-y-4">
                        {eventsLoading ? (
                            // Loading skeleton for events
                            [1, 2, 3].map((i) => (
                                <div key={i} className="h-16 bg-gray-50 rounded-lg animate-pulse"></div>
                            ))
                        ) : eventsNews.length > 0 ? (
                            eventsNews.map((item, i) => (
                                <div
                                    key={i}
                                    className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-gray-50 to-white hover:from-gray-100 hover:shadow-sm transition-all border border-gray-100"
                                >
                                    <div className="relative flex-shrink-0">
                                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#651313] to-[#EB4724] flex items-center justify-center shadow-sm">
                                            <Activity className="h-5 w-5 text-white" />
                                        </div>

                                        <div className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-green-500 border-2 border-white flex items-center justify-center">
                                            <ArrowUpRight className="h-2.5 w-2.5 text-white" />
                                        </div>
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-gray-900 truncate">
                                            {item.title}
                                        </p>
                                        <p className="text-xs text-gray-500 mt-0.5">
                                            {new Date(item.date).toLocaleDateString('en-US', {
                                                month: 'short',
                                                day: 'numeric',
                                                year: 'numeric'
                                            })}
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-1 text-sm font-bold text-[#EB4724] flex-shrink-0 capitalize">
                                        {item.type}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-6 text-gray-400 text-sm italic">
                                No events or news found.
                            </div>
                        )}
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-100">
                        <Link href="/admin/events-news" className="block w-full text-center text-sm font-medium text-[#651313] hover:text-[#EB4724] transition-colors">
                            View All Events & News →
                        </Link>
                    </div>
                </div>
            </div>

            {/* Top 10 Users Section */}
            {usersLoading ? (
                <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
                    <div className="animate-pulse">
                        <div className="h-6 w-32 bg-gray-200 rounded mb-4"></div>
                        <div className="space-y-3">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <div key={i} className="h-12 bg-gray-200 rounded"></div>
                            ))}
                        </div>
                    </div>
                </div>
            ) : (
                <DataTable
                    title="Top 10 Regular Users"
                    columns={[
                        {
                            label: "#",
                            key: "rank",
                            width: "60px",
                            render: (_: any, index: number) => (
                                <span className="font-semibold text-gray-600">{index + 1}</span>
                            ),
                        },
                        {
                            label: "Fullname",
                            key: "fullname",
                            render: (row: any) => (
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#651313] to-[#EB4724] flex items-center justify-center shadow-sm text-white font-semibold text-sm">
                                        {row.fullname?.charAt(0)?.toUpperCase() || "U"}
                                        {row.fullname?.split(" ")[1]?.charAt(0)?.toUpperCase() || ""}
                                    </div>
                                    <span className="font-medium text-gray-900">{row.fullname || "Unknown User"}</span>
                                </div>
                            ),
                        },
                        {
                            label: "Email",
                            key: "email",
                            render: (row: any) => (
                                <span className="text-gray-600">{row.email || "-"}</span>
                            ),
                        },
                        {
                            label: "Phone",
                            key: "phone",
                            render: (row: any) => (
                                <span className="text-gray-600">{row.phone || "-"}</span>
                            ),
                        },
                        {
                            label: "Role",
                            key: "role",
                            width: "120px",
                            render: (row: any) => (
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${row.role === "admin"
                                    ? "bg-purple-100 text-purple-700 border border-purple-200"
                                    : "bg-blue-100 text-blue-700 border border-blue-200"
                                    }`}>
                                    {row.role || "user"}
                                </span>
                            ),
                        },
                    ]}
                    data={topUsers}
                    showAddButton={false}
                />
            )}
        </div>
    );
}
