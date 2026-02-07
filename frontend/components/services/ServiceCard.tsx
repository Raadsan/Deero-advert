"use client";

import Image from "next/image";
import { motion } from "framer-motion";

interface ServiceCardProps {
    name: string;
    icon: string;
    index: number;
    active?: boolean;
    itemVariants: any;
    onClick?: () => void;
}

export default function ServiceCard({ name, icon, index, active, itemVariants, onClick }: ServiceCardProps) {
    return (
        <motion.div
            variants={itemVariants}
            whileHover={onClick ? "hover" : undefined}
            onClick={onClick}
            className={`flex flex-col items-center relative group p-6 rounded-2xl transition-all duration-300 ${onClick ? "cursor-pointer" : "cursor-default"}`}
        >
            {/* Hover/Active Background - Rounded Rectangle */}
            <motion.div
                variants={{
                    hover: {
                        opacity: 1,
                        scale: 1,
                    }
                }}
                animate={active ? { opacity: 0, scale: 1 } : undefined}
                initial={active ? { opacity: 0, scale: 1 } : { opacity: 0, scale: 0.95 }}
                className={`absolute inset-0 rounded-2xl z-0 pointer-events-none transition-all duration-300 bg-gray-100`}
            />

            {/* Icon Container */}
            <div className="relative mb-6 z-10 flex flex-col items-center">
                <motion.div
                    variants={{
                        hover: { y: -10, scale: 0.8 }
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="w-24 h-24 md:w-32 md:h-32 flex items-center justify-center relative z-20"
                >
                    <Image
                        src={icon || "/placeholder-icon.png"}
                        alt={(name || "Service").replace("\n", " ")}
                        width={100}
                        height={100}
                        className="w-full h-full object-contain group-hover:invert-0 transition-all duration-300"
                    />
                </motion.div>

                {/* Decorative Curved Line (Smile) */}
                <motion.div
                    variants={{
                        hover: { opacity: 1, scale: 1.1, y: -5 }
                    }}
                    initial={{ opacity: 0, scale: 0.8, y: 5 }}
                    className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-20 h-8 pointer-events-none"
                >
                    <svg viewBox="0 0 100 40" className="w-full h-full">
                        <path
                            d="M10 10 Q50 40 90 10"
                            fill="none"
                            stroke="#EB4724"
                            strokeWidth="4"
                            strokeLinecap="round"
                        />
                        <circle cx="10" cy="10" r="4" fill="#651313" />
                        <circle cx="90" cy="10" r="4" fill="#651313" />
                    </svg>
                </motion.div>
            </div>

            {/* Title */}
            <motion.h3
                variants={{
                    hover: { color: "#EB4724", scale: 1.05, y: -5 }
                }}
                className="text-[#651313] font-bold text-center whitespace-pre-line leading-tight relative z-10 text-base"
            >
                {name}
            </motion.h3>
        </motion.div>
    );
}

