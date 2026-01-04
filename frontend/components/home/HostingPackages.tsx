"use client";

import { useState } from "react";
import { CheckIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";

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
        bgColor: "bg-[#fcd7c3]",
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
        bgColor: "bg-[#fcd7c3]",
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
        bgColor: "bg-[#fcd7c3]",
        isMain: false,
    },
];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export default function HostingPackages() {
    const { toggleCartItem, isInCart } = useCart();
    const router = useRouter();
    const [isYearly, setIsYearly] = useState(false);

    const handleChoosePlan = (plan: any) => {
        const price = isYearly ? plan.yearlyPrice : plan.monthlyPrice;
        toggleCartItem({
            id: Math.random().toString(36).substr(2, 9),
            type: 'hosting',
            title: 'Deero Web Hosting',
            subtitle: `${plan.name} Plan`,
            price: price,
            options: `Billing Cycle: ${isYearly ? 'Yearly' : 'Monthly'}`,
            renewalPrice: price
        });
    };

    return (
        <section className="bg-white py-12 px-4 sm:px-10">
            <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                variants={containerVariants}
                className="mx-auto max-w-6xl"
            >
                <div className="text-center mb-8">
                    <motion.h2 variants={itemVariants} className="text-3xl font-bold text-[#651313] mb-8">Web Hosting Packages</motion.h2>

                    {/* Toggle */}
                    <motion.div variants={itemVariants} className="flex items-center justify-center gap-4">
                        <span className={`text-sm font-semibold transition-colors duration-300 ${!isYearly ? 'text-[#651313]' : 'text-gray-400'}`}>Monthly</span>
                        <button
                            onClick={() => setIsYearly(!isYearly)}
                            className="relative w-14 h-7 bg-[#EB4724] rounded-full p-1 transition-colors duration-300"
                        >
                            <motion.div
                                animate={{ x: isYearly ? 28 : 0 }}
                                className="w-5 h-5 bg-white rounded-full shadow-md"
                            ></motion.div>
                        </button>
                        <span className={`text-sm font-semibold transition-colors duration-300 ${isYearly ? 'text-[#651313]' : 'text-gray-400'}`}>Yearly</span>
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
                    {plans.map((plan) => (
                        <motion.div
                            key={plan.name}
                            variants={itemVariants}
                            whileHover={{ scale: 1.02 }}
                            className={`${plan.bgColor} p-6 shadow-sm flex flex-col relative overflow-hidden transition-all duration-300`}
                        >
                            {/* Decorative element for main card */}
                            {plan.isMain && (
                                <div className="absolute top-0 right-0 w-20 h-20 overflow-hidden">
                                    <div className="absolute top-0 right-0 w-12 h-12 bg-[#EB4724]/20 rotate-45 transform translate-x-4 -translate-y-4"></div>
                                </div>
                            )}

                            <h3 className="text-3xl font-bold text-[#651313] mb-4">{plan.name}</h3>
                            <p className="text-sm text-[#651313]/80 mb-4 leading-relaxed">
                                {plan.description}
                            </p>

                            <div className="bg-[#651313] text-white text-[10px] font-bold py-1 px-3 rounded-full w-fit mb-4 uppercase tracking-wider">
                                Save {plan.save}
                            </div>

                            <div className="mb-2 text-[#651313]/60 text-xs font-semibold">From only</div>
                            <div className="flex items-baseline mb-6">
                                <span className="text-4xl font-bold text-[#651313]">
                                    ${isYearly ? plan.yearlyPrice : plan.monthlyPrice}
                                </span>
                                <span className="text-[#651313]/60 text-xs ml-1 font-semibold">
                                    /{isYearly ? 'month' : 'month'}
                                </span>
                            </div>

                            <ul className="space-y-3 mb-6 flex-1">
                                {plan.features.map((feature) => (
                                    <li key={feature} className="flex items-center gap-3 text-[#651313] text-sm">
                                        <CheckIcon className="h-4 w-4 shrink-0 stroke-[3]" />
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            <button
                                onClick={() => handleChoosePlan(plan)}
                                className={`${isInCart(`${plan.name} Plan`)
                                        ? 'bg-white text-[#651313] border-2 border-[#651313]'
                                        : plan.buttonColor + ' text-white'
                                    } font-bold py-4 rounded-full shadow-lg hover:brightness-110 active:scale-95 transition-all uppercase tracking-widest text-xs`}
                            >
                                {isInCart(`${plan.name} Plan`) ? 'Remove Plan' : 'Choose Plan'}
                            </button>
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </section>
    );
}
