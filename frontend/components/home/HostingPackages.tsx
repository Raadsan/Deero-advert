"use client";

import { useState } from "react";
import { CheckIcon } from "@heroicons/react/24/outline";

const plans = [
    {
        name: "Basic",
        description: "Packed with great features, such as oneclick software installs.24/7 support",
        monthlyPrice: 3.99,
        yearlyPrice: 3.59, // 10% off
        save: "10%",
        features: [
            "WordPress Hosting",
            "Website 1",
            "Subdomains 5",
            "SSD Storage 50GB",
            "Bandwidth 5GB",
            "Databases 10",
            "Email Accounts - 3",
            "SSL Certificates 24/7",
            "Support & Server Monitoring",
        ],
        buttonColor: "bg-[#f28b6d]",
        bgColor: "bg-[#fce5d8]",
        isMain: false,
    },
    {
        name: "Enterprise",
        description: "Packed with great features, such as oneclick software installs.24/7 support",
        monthlyPrice: 9.99,
        yearlyPrice: 8.49, // 15% off
        save: "15%",
        features: [
            "Linux Hosting",
            "Websites Unlimited & Free Domain",
            "Subdomains Unlimited",
            "SSD Storage Unlimited",
            "Bandwidth Unlimited",
            "Databases Unlimited",
            "Email Accounts Unlimited",
            "SSL Certificates 24/7",
            "Support & Server Monitoring",
        ],
        buttonColor: "bg-[#651313]",
        bgColor: "bg-[#fdeada]",
        isMain: true,
    },
    {
        name: "Startup",
        description: "Packed with great features, such as oneclick software installs.24/7 support",
        monthlyPrice: 5.99,
        yearlyPrice: 5.39, // 10% off
        save: "10%",
        features: [
            "Linux Hosting",
            "Website 10",
            "Subdomains 20",
            "SSD Storage 100GB",
            "Bandwidth 20GB",
            "Databases 20",
            "Email Accounts 10",
            "SSL Certificates 24/7",
            "Support & Server Monitoring",
        ],
        buttonColor: "bg-[#f28b6d]",
        bgColor: "bg-[#fce5d8]",
        isMain: false,
    },
];

export default function HostingPackages() {
    const [isYearly, setIsYearly] = useState(false);

    return (
        <section className="bg-white py-20 px-4">
            <div className="mx-auto max-w-7xl">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-[#651313] mb-8">Web Hosting Packages</h2>

                    {/* Toggle */}
                    <div className="flex items-center justify-center gap-4">
                        <span className={`text-sm font-semibold ${!isYearly ? 'text-[#651313]' : 'text-gray-400'}`}>Monthly</span>
                        <button
                            onClick={() => setIsYearly(!isYearly)}
                            className="relative w-14 h-7 bg-[#EB4724] rounded-full p-1 transition-colors duration-300"
                        >
                            <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-300 ${isYearly ? 'translate-x-7' : 'translate-x-0'}`}></div>
                        </button>
                        <span className={`text-sm font-semibold ${isYearly ? 'text-[#651313]' : 'text-gray-400'}`}>Yearly</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
                    {plans.map((plan) => (
                        <div
                            key={plan.name}
                            className={`${plan.bgColor} rounded-2xl p-8 shadow-sm flex flex-col relative overflow-hidden transition-transform hover:scale-[1.02] duration-300`}
                        >
                            {/* Decorative element for main card */}
                            {plan.isMain && (
                                <div className="absolute top-0 right-0 w-20 h-20 overflow-hidden">
                                    <div className="absolute top-0 right-0 w-12 h-12 bg-[#EB4724]/20 rotate-45 transform translate-x-4 -translate-y-4"></div>
                                </div>
                            )}

                            <h3 className="text-3xl font-bold text-[#651313] mb-4">{plan.name}</h3>
                            <p className="text-sm text-[#651313]/80 mb-6 leading-relaxed">
                                {plan.description}
                            </p>

                            <div className="bg-[#651313] text-white text-[10px] font-bold py-1 px-3 rounded-full w-fit mb-6 uppercase tracking-wider">
                                Save {plan.save}
                            </div>

                            <div className="mb-2 text-[#651313]/60 text-xs font-semibold">From only</div>
                            <div className="flex items-baseline mb-8">
                                <span className="text-4xl font-bold text-[#651313]">
                                    ${isYearly ? plan.yearlyPrice : plan.monthlyPrice}
                                </span>
                                <span className="text-[#651313]/60 text-xs ml-1 font-semibold">
                                    /{isYearly ? 'month' : 'month'}
                                </span>
                            </div>

                            <ul className="space-y-4 mb-10 flex-1">
                                {plan.features.map((feature) => (
                                    <li key={feature} className="flex items-center gap-3 text-[#651313] text-sm">
                                        <CheckIcon className="h-4 w-4 shrink-0 stroke-[3]" />
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            <button className={`${plan.buttonColor} text-white font-bold py-4 rounded-full shadow-lg hover:brightness-110 transition uppercase tracking-widest text-xs`}>
                                Choose Plan
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
