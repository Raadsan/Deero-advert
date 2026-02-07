"use client";

import { ServerIcon, ShieldCheckIcon, RocketLaunchIcon, ClockIcon, LifebuoyIcon, CurrencyDollarIcon } from "@heroicons/react/24/outline";

const features = [
    {
        name: "99.9% Uptime Guarantee",
        description: "We keep your website online with our redundant infrastructure and monitoring.",
        icon: ClockIcon,
    },
    {
        name: "Super Fast Speed",
        description: "Powered by SSD storage and optimized servers for lightning-fast load times.",
        icon: RocketLaunchIcon,
    },
    {
        name: "Secure & Safe",
        description: "Free SSL certificates and advanced security measures to protect your data.",
        icon: ShieldCheckIcon,
    },
    {
        name: "24/7 Expert Support",
        description: "Our dedicated team is here to help you anytime, day or night.",
        icon: LifebuoyIcon,
    },
    {
        name: "Easy Control Panel",
        description: "Manage your website, email, and databases with our user-friendly cPanel.",
        icon: ServerIcon,
    },
    {
        name: "30-Day Money Back",
        description: "Try our services risk-free. If you're not satisfied, get a full refund.",
        icon: CurrencyDollarIcon,
    },
];

export default function HostingFeatures() {
    return (
        <section className="py-20 px-4 sm:px-10 bg-white">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold text-[#651313] mb-4">Why Choose Deero Hosting?</h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        We provide everything you need to get your business online and thriving.
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature) => (
                        <div key={feature.name} className="flex flex-col items-center text-center p-6 rounded-2xl bg-gray-50 hover:bg-white hover:shadow-xl transition-all duration-300 border border-gray-100 group">
                            <div className="w-16 h-16 rounded-full bg-[#EB4724]/10 flex items-center justify-center mb-6 group-hover:bg-[#EB4724] transition-colors duration-300">
                                <feature.icon className="w-8 h-8 text-[#EB4724] group-hover:text-white transition-colors duration-300" />
                            </div>
                            <h3 className="text-xl font-bold text-[#4d0e0e] mb-3">{feature.name}</h3>
                            <p className="text-gray-500 text-sm leading-relaxed">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

