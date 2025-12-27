"use client";

import Image from "next/image";
import { CheckIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";

const features = [
    "Marketing Strategy – training, action plan, and performance measurement reports",
    "Business Startup Support – business naming, profiles, legal articles, notarization, registration and development plan",
    "Logo Design and Brand Identity Kit – Bran guidelines, logos, fonts, color palette",
    "Web Design – UI/UX tailored to your business, premium Domains, hosting, SEO optimization, website security, and professional email with signature.",
    "Social media and Strategy – content creation (text, video & images) + growth plan",
    "Full Digital Strategy Consulting – branding, marketing, web, and video planning",
    "Business Stationery Design – letterhead, envelope, stamp, invoice templates",
    "Marketing Materials – brochures, flyers, books, roll-ups, banners",
    "Advertising Campaign Setup – traditional marketing and digital marketing plan",
    "Delivery Timeline: 4–6 Weeks",
];

export default function BusinessGrowthSolution() {
    return (
        <section className="bg-[#f2f2f2] py-20 px-4 sm:px-10 overflow-hidden border-t border-gray-200">
            <div className="mx-auto max-w-6xl">
                <div className="flex flex-col lg:flex-row items-start gap-10 lg:gap-16">

                    {/* Left Side - Large Stylized Illustration */}
                    <div className="w-full lg:w-1/2 flex justify-center lg:justify-start lg:sticky lg:top-32">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="relative group"
                        >
                            {/* The Swell Effect (Static version as it's a feature highlight) */}
                            <div className="relative w-full max-w-lg aspect-square flex items-center justify-center">
                                <Image
                                    src="/home-images/bussines-1.png"
                                    alt="Business Growth Illustration"
                                    width={600}
                                    height={600}
                                    className="w-full h-full object-contain"
                                    priority
                                />
                            </div>
                        </motion.div>
                    </div>

                    {/* Right Side - Content */}
                    <div className="w-full lg:w-1/2 space-y-6">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="space-y-2"
                        >
                            <h2 className="text-2xl md:text-3xl font-bold text-[#4d0e0e] leading-tight">
                                All-in-One Business Growth Solution <span className="text-[#EB4724] whitespace-nowrap">$2499.99</span>
                            </h2>
                        </motion.div>

                        <ul className="space-y-3">
                            {features.map((feature, index) => (
                                <motion.li
                                    key={index}
                                    initial={{ opacity: 0, x: 20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.05 }}
                                    className="flex items-start gap-3"
                                >
                                    <CheckIcon className="h-4 w-4 shrink-0 stroke-[4] text-[#4d0e0e] mt-1" />
                                    <p className="text-[#4d0e0e] text-xs md:text-sm font-medium leading-relaxed">
                                        {feature}
                                    </p>
                                </motion.li>
                            ))}
                        </ul>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="pt-4"
                        >
                            <button className="bg-[#606d7a] text-white px-8 py-3 rounded-lg font-bold text-base hover:bg-[#4d5a67] transition-all shadow-lg active:scale-95">
                                Purchase Plan
                            </button>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
}
