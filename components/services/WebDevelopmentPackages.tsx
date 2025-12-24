"use client";

import { CheckIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";

const webPlans = [
    {
        name: "Kaabe Package",
        price: 500,
        features: [
            "Custom website design and layout",
            "Responsive design for all screen sizes",
            "Up to 7 pages of content",
            "Basic on-page SEO optimization",
            "Professional business email",
        ],
        buttonColor: "bg-[#f28b6d]",
        isPopular: false,
    },
    {
        name: "Keydiye Package",
        price: 790,
        features: [
            "Custom website design and layout",
            "Responsive design for all screen sizes",
            "Up to 12 pages of content",
            "Advanced on-page SEO optimization",
            "Professional business email",
        ],
        buttonColor: "bg-[#4d0e0e]",
        isPopular: true,
    },
    {
        name: "Heegan Package",
        price: 1050,
        features: [
            "Custom website design and layout",
            "Responsive design for all screen sizes",
            "Up to 20 pages of content",
            "Advanced on-page SEO optimization",
            "Professional business email",
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

export default function WebDevelopmentPackages() {
    return (
        <section id="web-solutions" className="bg-[#f2f2f2] py-24 px-4 sm:px-10 overflow-hidden">
            <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                variants={containerVariants}
                className="mx-auto max-w-6xl"
            >
                <div className="text-center mb-16">
                    <motion.h2 variants={itemVariants} className="text-3xl md:text-4xl font-bold text-[#EB4724]">
                        Website Design and<br />Development Packages
                    </motion.h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
                    {webPlans.map((plan) => (
                        <motion.div
                            key={plan.name}
                            variants={itemVariants}
                            whileHover={{ scale: 1.02 }}
                            className="bg-[#fcd7c3] p-6 md:p-7 shadow-sm flex flex-col relative overflow-hidden rounded-2xl transition-all duration-300 min-h-[480px]"
                        >
                            {/* Most Popular Ribbon */}
                            {plan.isPopular && (
                                <div className="absolute top-6 -right-8 w-40 h-8">
                                    <div className="bg-[#651313] w-full h-full rotate-45 flex items-center justify-center shadow-md">
                                        <span className="text-white text-[10px] font-bold uppercase tracking-widest translate-y-[1px]">Most Popular</span>
                                    </div>
                                </div>
                            )}

                            <h3 className="text-xl font-bold text-[#4d0e0e] mb-2 pr-8 leading-tight">{plan.name}</h3>

                            <div className="flex items-baseline mb-6">
                                <span className="text-4xl font-bold text-[#EB4724]">
                                    ${plan.price}
                                </span>
                            </div>

                            <ul className="space-y-4 mb-4 flex-1">
                                {plan.features.map((feature) => (
                                    <li key={feature} className="flex items-start gap-3 text-[#4d0e0e] text-xs md:text-sm font-medium leading-tight">
                                        <CheckIcon className="h-4 w-4 shrink-0 stroke-[4] text-[#4d0e0e] mt-1" />
                                        <span>{feature}</span>
                                    </li>
                                ))}
                                  {/* Expand Feature Toggle Placeholder */}
                            <div className="flex items-center gap-2 text-[#4d0e0e]/60 text-sm font-bold mb-6 cursor-pointer hover:text-[#4d0e0e] transition-colors group">
                                <div className="w-5 h-5 rounded-full bg-white/50 flex items-center justify-center group-hover:bg-white transition-colors">
                                    <ChevronDownIcon className="h-3 w-3 stroke-[3]" />
                                </div>
                                <span>Expand Feature</span>
                            </div>
                            </ul>

                           

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
