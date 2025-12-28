"use client";

import { useState, useEffect } from "react";
import { Package, ShoppingBag, FileText, TrendingUp, Activity, Heart, ArrowUpRight } from "lucide-react";
import { getUser, getUserId } from "@/utils/auth";

export default function UserPage() {
    const [stats, setStats] = useState([
        {
            title: "My Services",
            value: "0",
            change: "Active services",
            icon: Package,
            color: "bg-blue-100 text-blue-700",
        },
        {
            title: "My Orders",
            value: "0",
            change: "Total orders",
            icon: ShoppingBag,
            color: "bg-green-100 text-green-700",
        },
        {
            title: "Documents",
            value: "0",
            change: "Saved documents",
            icon: FileText,
            color: "bg-orange-100 text-orange-700",
        },
    ]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const currentUser = getUser();
        setUser(currentUser);
    }, []);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                setLoading(true);
                const userId = getUserId();
                
                if (!userId) {
                    setLoading(false);
                    return;
                }

                // Format numbers with commas
                const formatNumber = (num: number) => {
                    return num.toLocaleString();
                };

                // TODO: Replace with actual user-specific API calls when backend endpoints are ready
                // Example: 
                // const myServicesRes = await getUserServices(userId);
                // const myOrdersRes = await getUserOrders(userId);
                // const myDocumentsRes = await getUserDocuments(userId);

                // For now, using placeholder data - these will be replaced with actual API calls
                setStats([
                    {
                        title: "My Services",
                        value: formatNumber(0), // Will be replaced with user's services count from API
                        change: "Active services",
                        icon: Package,
                        color: "bg-blue-100 text-blue-700",
                    },
                    {
                        title: "My Orders",
                        value: formatNumber(0), // Will be replaced with user's orders count from API
                        change: "Total orders",
                        icon: ShoppingBag,
                        color: "bg-green-100 text-green-700",
                    },
                    {
                        title: "Documents",
                        value: formatNumber(0), // Will be replaced with user's documents count from API
                        change: "Saved documents",
                        icon: FileText,
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

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight text-[#651313]">Dashboard</h1>
                {user && (
                    <p className="text-gray-600">Welcome back, {user.fullname}!</p>
                )}
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
                                        Active
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
                {/* Activity Overview Chart */}
                <div className="col-span-4 rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
                    <div className="mb-4 flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-900">Activity Overview</h3>
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
                                <linearGradient id="activityGradient" x1="0%" y1="0%" x2="0%" y2="100%">
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
                                fill="url(#activityGradient)"
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
                            {["0", "10", "20", "30", "40"].map((label, i) => (
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

                {/* Recent Activity */}
                <div className="col-span-3 rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
                    <div className="mb-4 flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
                        <Activity className="h-5 w-5 text-[#EB4724]" />
                    </div>

                    <div className="space-y-4">
                        {[
                            {
                                title: "Service Request Submitted",
                                date: "Jan 10, 2025",
                                category: "Service",
                                trend: "up"
                            },
                            {
                                title: "Order Completed",
                                date: "Jan 8, 2025",
                                category: "Order",
                                trend: "up"
                            },
                            {
                                title: "Document Uploaded",
                                date: "Jan 5, 2025",
                                category: "Document",
                                trend: "up"
                            },
                            {
                                title: "Profile Updated",
                                date: "Jan 2, 2025",
                                category: "Profile",
                                trend: "up"
                            },
                            {
                                title: "New Service Available",
                                date: "Dec 30, 2024",
                                category: "News",
                                trend: "up"
                            },
                        ].map((item, i) => (
                            <div
                                key={i}
                                className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-gray-50 to-white hover:from-gray-100 hover:shadow-sm transition-all border border-gray-100"
                            >
                                <div className="relative flex-shrink-0">
                                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#651313] to-[#EB4724] flex items-center justify-center shadow-sm">
                                        <Activity className="h-5 w-5 text-white" />
                                    </div>

                                    {item.trend === "up" && (
                                        <div className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-green-500 border-2 border-white flex items-center justify-center">
                                            <ArrowUpRight className="h-2.5 w-2.5 text-white" />
                                        </div>
                                    )}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-gray-900 truncate">
                                        {item.title}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-0.5">
                                        {item.date}
                                    </p>
                                </div>

                                <div className="flex items-center gap-1 text-sm font-bold text-[#EB4724] flex-shrink-0">
                                    {item.category}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-100">
                        <button className="w-full text-sm font-medium text-[#651313] hover:text-[#EB4724] transition-colors">
                            View All Activity →
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

