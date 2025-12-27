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
];

export default function BusinessGrowthSolution() {
    return (
        <section id="business-growth" className="bg-[#f2f2f2] py-8 px-4 sm:px-10 overflow-hidden">
            <div className="mx-auto max-w-6xl">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="bg-gradient-to-br from-[#FFE5D9] to-[#FFD4C4] rounded-3xl p-5 md:p-6 shadow-xl"
                >
                    <div className="flex flex-col lg:flex-row items-center gap-4 lg:gap-6">
                        {/* Left Side - Image */}
                        <div className="w-full lg:w-1/2 flex justify-center items-center">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6 }}
                                className="relative w-full max-w-xs md:max-w-sm"
                            >
                                <Image
                                    src="/home-images/bussines-1.png"
                                    alt="Business Growth Illustration"
                                    width={400}
                                    height={400}
                                    className="w-full h-auto object-contain"
                                    priority
                                />
                            </motion.div>
                        </div>

                        {/* Right Side - Content */}
                        <div className="w-full lg:w-1/2 space-y-3">
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="space-y-1"
                            >
                                <h2 className="text-2xl md:text-3xl font-bold text-[#8B4513] leading-tight">
                                    All-in-One Business Growth Solution
                                </h2>
                                <div className="text-3xl md:text-4xl font-bold text-[#EB4724]">
                                    $2499<sup className="text-xl md:text-2xl">.99</sup>
                                </div>
                            </motion.div>

                            <ul className="space-y-1.5">
                                {features.map((feature, index) => (
                                    <motion.li
                                        key={index}
                                        initial={{ opacity: 0, x: 20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: index * 0.05 }}
                                        className="flex items-start gap-2"
                                    >
                                        <CheckIcon className="h-4 w-4 shrink-0 stroke-[4] text-[#8B4513] mt-1" />
                                        <p className="text-[#8B4513] text-xs md:text-sm font-medium leading-relaxed">
                                            {feature}
                                        </p>
                                    </motion.li>
                                ))}
                            </ul>

                            {/* Delivery Timeline */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                            >
                                <p className="text-[#8B4513] text-sm md:text-base font-medium">
                                    Delivery Timeline: 4-6 Weeks
                                </p>
                            </motion.div>

                            {/* Purchase Plan Button */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="pt-1"
                            >
                                <button className="bg-[#EB4724] text-white px-8 py-3 rounded-xl font-bold text-base hover:bg-[#d63e1f] transition-all shadow-lg active:scale-95 w-full md:w-auto">
                                    Purchase Plan
                                </button>
                            </motion.div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
