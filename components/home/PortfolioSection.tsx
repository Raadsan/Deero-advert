"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

import { useState, useEffect } from "react";
import { getPortfolios } from "@/api/portfolioApi";
import { getImageUrl, slugify } from "@/utils/url";

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
    hidden: { opacity: 0, scale: 0.9, y: 30 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.5 } },
};

export default function PortfolioSection({ showHeader = true, limit }: { showHeader?: boolean; limit?: number }) {
    const router = useRouter();
    const [portfolios, setPortfolios] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPortfolios = async () => {
            try {
                setLoading(true);
                const response = await getPortfolios();
                console.log("Raw API response:", response); // Debug log

                const data = response.data;
                console.log("Response data:", data); // Debug log

                let items = [];

                // Handle various response formats
                if (data.success) {
                    if (Array.isArray(data.portfolios)) {
                        items = data.portfolios;
                    } else if (data.portfolio) {
                        items = Array.isArray(data.portfolio) ? data.portfolio : [data.portfolio];
                    }
                } else if (Array.isArray(data)) {
                    // Direct array response
                    items = data;
                } else if (Array.isArray(data.portfolios)) {
                    // Portfolios array without success flag
                    items = data.portfolios;
                }

                console.log("Parsed items before processing:", items); // Debug log

                // Process image URLs
                const processedItems = items.map((item: any) => {
                    const processed = getImageUrl(item.mainImage);
                    return {
                        ...item,
                        mainImage: processed,
                    };
                });

                console.log("Processed portfolios:", processedItems); // Debug log
                setPortfolios(processedItems.reverse());
            } catch (err: any) {
                console.error("Error fetching portfolios:", err);
                setError(err?.message || "Failed to load portfolios");
                setPortfolios([]);
            } finally {
                setLoading(false);
            }
        };

        fetchPortfolios();
    }, []);

    const handlePortfolioClick = (item: any) => {
        // Navigate to individual portfolio gallery page
        const slug = item.title ? slugify(item.title) : item._id;
        router.push(`/portfolio/${slug}`);
    };

    return (
        <section className="bg-[#fcd7c3] py-20 px-4 sm:px-10">
            <motion.div
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className="mx-auto max-w-6xl"
            >
                {/* Header Area */}
                {showHeader && (
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
                        <motion.div variants={itemVariants}>
                            <h2 className="text-4xl font-bold text-[#651313] mb-4 text-center justify-center">Our Portfolios</h2>
                        </motion.div>
                        <motion.div variants={itemVariants}>
                            <Link
                                href="/portfolio"
                                className="bg-[#EB4724] text-white px-10 py-3 rounded-full font-bold hover:bg-[#d13d1d] hover:scale-105 active:scale-95 transition-all uppercase tracking-wider text-sm shadow-md inline-block"
                            >
                                View More
                            </Link>
                        </motion.div>
                    </div>
                )}

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {loading ? (
                        // Skeleton Loading State
                        Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className="aspect-[4/3] bg-white/50 animate-pulse rounded-lg" />
                        ))
                    ) : portfolios.length > 0 ? (
                        (limit ? portfolios.slice(0, limit) : portfolios).map((item, index) => (
                            <motion.div
                                key={item._id}
                                initial={{ opacity: 0, scale: 0.9, y: 30 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                whileHover={{ y: -8 }}
                                onClick={() => handlePortfolioClick(item)}
                                className="group relative bg-white rounded-none overflow-hidden shadow-lg transition-all duration-300 cursor-pointer"
                            >
                                {/* Image Container */}
                                <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                                    <Image
                                        src={item.mainImage || "/logo deero-02 .svg"}
                                        alt={item.title || "Portfolio Item"}
                                        fill
                                        className="object-cover transition duration-500 group-hover:scale-110"
                                        onError={(e) => {
                                            const target = e.target as HTMLImageElement;
                                            target.src = "/logo deero-02 .svg";
                                        }}
                                    />
                                    {/* Overlay */}
                                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-300">
                                        <div className="bg-[#EB4724] h-1 w-12 mb-4 transform -translate-y-4 group-hover:translate-y-0 transition-transform duration-300"></div>
                                        <h3 className="text-white font-bold text-xl text-center px-6 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                                            {item.title}
                                        </h3>
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    ) : error ? (
                        <div className="col-span-full py-20 text-center text-red-600">
                            Error: {error}
                        </div>
                    ) : (
                        <div className="col-span-full py-20 text-center text-[#651313]/60 italic">
                            No portfolios found in the gallery.
                        </div>
                    )}
                </div>
            </motion.div>
        </section>
    );
}
