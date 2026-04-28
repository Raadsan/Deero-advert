"use client";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import TeamSection from "@/components/home/TeamSection";
import { motion } from "framer-motion";

export default function TeamPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#f8f9fa]">
      <Header />
      <main className="flex-grow pt-[106px] md:pt-[131px]">
        {/* Banner Section */}
        <section className="relative w-full bg-gradient-to-r from-[#4d0e0e] via-[#651313] to-[#EB4724] py-20 lg:py-24 px-4 overflow-hidden mb-10">
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

            <div className="mx-auto max-w-6xl relative z-10 flex flex-col items-center justify-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center"
                >
                    <h1 className="text-4xl md:text-5xl lg:text-5xl font-bold text-white mb-4">Meet Our Team</h1>
                    <p className="text-white/80 max-w-2xl mx-auto text-lg">
                        The creative minds and technical experts behind Deero Advert's success.
                    </p>
                </motion.div>
            </div>
        </section>

        {/* Team Grid */}
        <div className="container mx-auto px-4 sm:px-10 pb-20">
            <TeamSection view="grid" />
        </div>
      </main>
      <Footer />
    </div>
  );
}
