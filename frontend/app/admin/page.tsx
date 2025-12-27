import { Users, DollarSign, TrendingUp, Activity, Briefcase, Newspaper, Award, MessageSquare } from "lucide-react";

const stats = [
    {
        title: "Total Services",
        value: "12",
        change: "Active services offered",
        icon: Briefcase,
        color: "bg-blue-100 text-blue-700",
    },
    {
        title: "Total Users",
        value: "2,350",
        change: "+180 new this month",
        icon: Users,
        color: "bg-green-100 text-green-700",
    },
    {
        title: "Achievements",
        value: "8",
        change: "Awards & Recognitions",
        icon: Award,
        color: "bg-orange-100 text-orange-700",
    },
];

export default function AdminPage() {
    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight text-[#651313]">Dashboard</h1>

            </div>

            {/* Stats Grid */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {stats.map((stat, index) => {
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
                })}
            </div>

            {/* Recent Activity / Content Section */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
                {/* Main Chart Area Placeholder */}
                <div className="col-span-4 rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
                    <h3 className="mb-4 text-lg font-medium text-gray-900">Revenue Overview</h3>
                    <div className="flex h-[300px] items-center justify-center rounded-lg border border-dashed border-gray-200 bg-gray-50 text-gray-400">
                        Chart Placeholder
                    </div>
                </div>

                {/* Recent Sales / Users Placeholder */}
                <div className="col-span-3 rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
                    <h3 className="mb-4 text-lg font-medium text-gray-900">Recent Activity</h3>
                    <div className="space-y-4">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="flex items-center gap-4">
                                <div className="h-9 w-9 rounded-full bg-gray-100" />
                                <div className="flex-1 space-y-1">
                                    <p className="text-sm font-medium leading-none">User Action {i}</p>
                                    <p className="text-xs text-gray-500">2 minutes ago</p>
                                </div>
                                <div className="text-sm font-medium text-[#EB4724]">+$1,999.00</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
