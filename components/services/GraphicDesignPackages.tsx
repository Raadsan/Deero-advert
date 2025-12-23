"use client";

import { CheckIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";

const graphicPlans = [
    {
        name: "Curdun Package",
        price: 330,
        features: [
            "Logo Design – 2 Options",
            "Brand Guideline",
            "Business card",
            "ID Card",
            "Outdoor Banner",
        ],
        buttonColor: "bg-[#f28b6d]",
        isPopular: false,
    },
    {
        name: "Hanaqaad Package",
        price: 490,
        features: [
            "Logo Design – 3 Options",
            "Brand Consulting",
            "Brand Guideline",
            "Full Stationery Design",
            "Banners, Roll-up Banner and Billboard",
        ],
        buttonColor: "bg-[#4d0e0e]",
        isPopular: true,
    },
    {
        name: "Kobac Package",
        price: 700,
        features: [
            "Brand Consulting",
            "Logo Design – 4 Options",
            "Brand Guideline",
            "Stationery Design",
            "Marketing Material",
        ],
        buttonColor: "bg-[#f28b6d]",
        isPopular: false,
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

export default function GraphicDesignPackages() {
    return (
        <section className="bg-[#f2f2f2] py-24 px-4 sm:px-10 overflow-hidden">
            <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                variants={containerVariants}
                className="mx-auto max-w-6xl"
            >
                <div className="text-center mb-16">
                    <motion.h2 variants={itemVariants} className="text-4xl md:text-5xl font-bold text-[#EB4724]">
                        Graphic Design and<br />Branding Packages
                    </motion.h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
                    {graphicPlans.map((plan) => (
                        <motion.div
                            key={plan.name}
                            variants={itemVariants}
                            whileHover={{ scale: 1.02 }}
                            className="bg-[#fcd7c3] p-8 md:p-10 shadow-sm flex flex-col relative overflow-hidden rounded-2xl transition-all duration-300"
                        >
                            {/* Most Popular Ribbon */}
                            {plan.isPopular && (
                                <div className="absolute top-8 -right-8 w-40 h-8">
                                    <div className="bg-[#651313] w-full h-full rotate-45 flex items-center justify-center shadow-md">
                                        <span className="text-white text-[10px] font-bold uppercase tracking-widest translate-y-[1px]">Most Popular</span>
                                    </div>
                                </div>
                            )}

                            <h3 className="text-3xl font-bold text-[#4d0e0e] mb-2 pr-8 leading-tight">{plan.name}</h3>

                            <div className="flex items-baseline mb-10">
                                <span className="text-5xl font-bold text-[#EB4724]">
                                    ${plan.price}
                                </span>
                            </div>

                            <ul className="space-y-5 mb-6 flex-1">
                                {plan.features.map((feature) => (
                                    <li key={feature} className="flex items-start gap-3 text-[#4d0e0e] text-sm md:text-base font-medium leading-tight">
                                        <CheckIcon className="h-4 w-4 shrink-0 stroke-[4] text-[#4d0e0e] mt-1" />
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            {/* Expand Feature Toggle Placeholder */}
                            <div className="flex items-center gap-2 text-[#4d0e0e]/60 text-sm font-bold mb-10 cursor-pointer hover:text-[#4d0e0e] transition-colors group">
                                <div className="w-5 h-5 rounded-full bg-white/50 flex items-center justify-center group-hover:bg-white transition-colors">
                                    <ChevronDownIcon className="h-3 w-3 stroke-[3]" />
                                </div>
                                <span>Expand Feature</span>
                            </div>

                            <button className={`${plan.buttonColor} text-white font-bold py-4 rounded-xl shadow-lg hover:brightness-110 active:scale-95 transition-all text-sm uppercase tracking-wide`}>
                                Purchase Plan
                            </button>

                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </section>
    );
}
