"use client";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Image from "next/image";
import { motion } from "framer-motion";

const marketingImages = [
    { src: "/Digital Marketing/download.jpg", alt: "Digital Marketing 1" },
    { src: "/Digital Marketing/download (1).jpg", alt: "Digital Marketing 2" },
    { src: "/Digital Marketing/download (2).jpg", alt: "Digital Marketing 3" },
    { src: "/Digital Marketing/download (3).jpg", alt: "Digital Marketing 4" },
    { src: "/Digital Marketing/download (4).jpg", alt: "Digital Marketing 5" },
    { src: "/Digital Marketing/download (5).jpg", alt: "Digital Marketing 6" },
    { src: "/Digital Marketing/download (8).jpg", alt: "Digital Marketing 7" },
    { src: "/Digital Marketing/download.png", alt: "Digital Marketing 8" },
];

export default function DigitalMarketingPage() {
    return (
        <div className="bg-white min-h-screen text-[#1a1a1a]">
            <Header />
            <main className="pt-[170px]">
                <section className="py-20 px-4 sm:px-10">
                    <div className="mx-auto max-w-7xl">
                        <motion.h1
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-4xl md:text-5xl font-bold text-[#EB4724] text-center mb-12 uppercase tracking-wide"
                        >
                            Digital Marketing
                        </motion.h1>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {marketingImages.map((img, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    viewport={{ once: true }}
                                    className="relative aspect-[4/3] group overflow-hidden rounded-none shadow-md cursor-pointer"
                                >
                                    <Image
                                        src={img.src}
                                        alt={img.alt}
                                        fill
                                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                    {/* Optional Overlay on Hover */}
                                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
}
