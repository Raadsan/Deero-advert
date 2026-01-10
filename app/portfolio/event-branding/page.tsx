"use client";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Image from "next/image";
import { motion } from "framer-motion";

const eventImages = [
    { src: "/Event Branding/download.jpg", alt: "Event Branding 1" },
    { src: "/Event Branding/download (1).jpg", alt: "Event Branding 2" },
    { src: "/Event Branding/download (2).jpg", alt: "Event Branding 3" },
    { src: "/Event Branding/download (3).jpg", alt: "Event Branding 4" },
    { src: "/Event Branding/download (4).jpg", alt: "Event Branding 5" },
    { src: "/Event Branding/download (5).jpg", alt: "Event Branding 6" },
    { src: "/Event Branding/download (6).jpg", alt: "Event Branding 7" },
    { src: "/Event Branding/download (7).jpg", alt: "Event Branding 8" },
];

export default function EventBrandingPage() {
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
                            Event Branding
                        </motion.h1>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {eventImages.map((img, index) => (
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
