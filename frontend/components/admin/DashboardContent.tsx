"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Users, TrendingUp, Activity, Briefcase, Award, ArrowUpRight } from "lucide-react";
import { getAllServices } from "@/api/serviceApi";
import { getAllUsers } from "@/api/usersApi";
import { getAllAchievements } from "@/api/achievementApi";
import { getAllEventsNews } from "@/api/eventsNewsApi";
import { getMajorClients } from "@/api/majorClientApi";
import DataTable from "@/components/admin/DataTable";

export default function DashboardContent() {
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
        {
            title: "Major Clients",
            value: "0",
            change: "Total clients",
            icon: Activity,
            color: "bg-purple-100 text-purple-700",
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
                const [servicesRes, usersRes, achievementsRes, majorClientsRes] = await Promise.all([
                    getAllServices(),
                    getAllUsers(),
                    getAllAchievements(),
                    getMajorClients(),
                ]);

                const servicesResAny = servicesRes as any;
                const achievementsResAny = achievementsRes as any;

                const servicesCount = servicesResAny.data?.count || servicesResAny.data?.data?.length || 0;
                const usersCount = Array.isArray(usersRes.data) ? usersRes.data.length : 0;
                const achievementsCount = achievementsResAny.data?.count || achievementsResAny.data?.data?.length || 0;
                const majorClients = majorClientsRes.clients || [];
                const majorClientsCount = majorClients.reduce((acc: number, client: any) => acc + (client.images?.length || 0), 0);

                const formatNumber = (num: number) => num.toLocaleString();

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
                        title: "Major Clients",
                        value: formatNumber(majorClientsCount),
                        change: "Total clients",
                        icon: Activity,
                        color: "bg-purple-100 text-purple-700",
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
    }, []);

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
            <h1 className="text-3xl font-bold tracking-tight text-[#651313]">Dashboard</h1>

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
                    <div className="mb-4 flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-900">Revenue Overview</h3>
                        <div className="flex items-center gap-2 text-sm text-green-600 font-medium">
                            <TrendingUp className="h-4 w-4" />
                            <span>+12.5%</span>
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

                            {/* Data points path */}
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

                <div className="col-span-3 rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
                    <div className="mb-4 flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-900">Events & News</h3>
                        <Activity className="h-5 w-5 text-[#EB4724]" />
                    </div>
                    <div className="space-y-4">
                        {eventsLoading ? [1, 2, 3].map(i => <div key={i} className="h-16 bg-gray-50 rounded-lg animate-pulse" />) :
                            eventsNews.length > 0 ? eventsNews.map((item, i) => (
                                <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 border border-gray-100">
                                    <Activity className="h-5 w-5 text-[#EB4724]" />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-gray-900 truncate">{item.title}</p>
                                        <p className="text-xs text-gray-500">{new Date(item.date).toLocaleDateString()}</p>
                                    </div>
                                </div>
                            )) : <div className="text-center py-6 text-gray-400 text-sm italic">No events found.</div>}
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-100">
                        <Link href="/management/events-news" className="block text-center text-sm font-medium text-[#651313] hover:underline">View All →</Link>
                    </div>
                </div>
            </div>

            {usersLoading ? (
                <div className="rounded-xl border border-gray-100 bg-white p-6 animate-pulse h-64" />
            ) : (
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
                />
            )}
        </div>
    );
}
