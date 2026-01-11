"use client";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Image from "next/image";
import { motion } from "framer-motion";

import { useState, useEffect } from "react";
import { getPortfolios } from "@/api/portfolioApi";
import { getImageUrl } from "@/utils/url";

export default function GraphicDesignPage() {
    const [gallery, setGallery] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchGallery = async () => {
            try {
                setLoading(true);
                const response = await getPortfolios();
                const data = response.data;

                if (data.success) {
                    const portfolios = Array.isArray(data.portfolios) ? data.portfolios :
                        (data.portfolio ? (Array.isArray(data.portfolio) ? data.portfolio : [data.portfolio]) : []);

                    const target = portfolios.find((p: any) => p.title === "Graphic Design & Branding");
                    if (target && target.gallery) {
                        setGallery(target.gallery);
                    }
                }
            } catch (error) {
                console.error("Error fetching graphic design gallery:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchGallery();
    }, []);

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
                            Graphic Design & Branding
                        </motion.h1>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {loading ? (
                                Array.from({ length: 6 }).map((_, i) => (
                                    <div key={i} className="aspect-[4/3] bg-gray-100 animate-pulse" />
                                ))
                            ) : gallery.length > 0 ? (
                                gallery.map((img, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        transition={{ duration: 0.5, delay: index * 0.1 }}
                                        viewport={{ once: true }}
                                        className="relative aspect-[4/3] group overflow-hidden rounded-none shadow-md cursor-pointer"
                                    >
                                        <Image
                                            src={getImageUrl(img) || "/logo deero-02 .svg"}
                                            alt={`Graphic Design ${index + 1}`}
                                            fill
                                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                                            onError={(e) => {
                                                const target = e.target as HTMLImageElement;
                                                target.src = "/logo deero-02 .svg";
                                            }}
                                        />
                                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                                    </motion.div>
                                ))
                            ) : (
                                <div className="col-span-full py-20 text-center text-gray-400 italic">
                                    No gallery images available for this category yet.
                                </div>
                            )}
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
}
