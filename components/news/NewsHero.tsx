"use client";

import { motion } from "framer-motion";

export default function NewsHero() {
    return (
        <section className="relative w-full bg-gradient-to-r from-[#4d0e0e] via-[#651313] to-[#EB4724] py-16 lg:py-20 px-4 overflow-hidden">
            {/* Watermark Pattern - Single Row */}
            <div className="absolute inset-0 flex items-center justify-between opacity-10 pointer-events-none select-none px-4">
                {Array.from({ length: 7 }).map((_, i) => (
                    <div key={i} className="w-24 h-24 md:w-32 md:h-32 relative shrink-0">
                        <img
                            src="/home-images/about-01.svg"
                            alt=""
                            className="w-full h-full object-contain grayscale brightness-0 invert opacity-30"
                        />
                    </div>
                ))}
            </div>

            <div className="relative z-10 max-w-6xl mx-auto flex flex-col gap-4">
                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-3xl md:text-4xl lg:text-5xl font-bold text-white"
                >
                    News & Updates
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="text-white/90 max-w-2xl text-sm md:text-base"
                >
                    Stay up to date with Deero Advert – latest campaigns, brand launches,
                    industry insights and stories from our creative team.
                </motion.p>
            </div>
        </section>
    );
}

