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
                setError("no portfolio found");
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

                {/* List of Portfolios */}
                <div className="flex flex-col gap-12">
                    {loading ? (
                        // Skeleton Loading State
                        Array.from({ length: 2 }).map((_, i) => (
                            <div key={i} className="w-full h-[400px] bg-white/50 animate-pulse rounded-3xl" />
                        ))
                    ) : portfolios.length > 0 ? (
                        (limit ? portfolios.slice(0, limit) : portfolios).map((item, index) => (
                            <motion.div
                                key={item._id}
                                initial={{ opacity: 0, y: 50 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                className="bg-white rounded-[40px] overflow-hidden shadow-sm flex flex-col lg:flex-row min-h-[450px] lg:gap-12"
                            >
                                {/* Left Content Area */}
                                <div className="lg:w-1/2 p-8 md:p-12 flex flex-col justify-between">
                                    <div>
                                        <h3 className="text-4xl md:text-5xl font-bold text-[#1a1a1a] mb-6">
                                            {item.title}
                                        </h3>
                                        <p className="text-gray-600 text-lg leading-relaxed mb-8 max-w-xl line-clamp-4">
                                            {item.description}
                                        </p>
                                    </div>

                                    {/* Year and Industry */}
                                    <div className="flex gap-12 mb-8">
                                        <div>
                                            <p className="text-xl font-bold text-[#1a1a1a] mb-1">Year:</p>
                                            <p className="text-lg text-gray-500 font-medium">{item.year || "N/A"}</p>
                                        </div>
                                        <div>
                                            <p className="text-xl font-bold text-[#1a1a1a] mb-1">Industry:</p>
                                            <p className="text-lg text-gray-500 font-medium">{item.industry || "N/A"}</p>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => handlePortfolioClick(item)}
                                        className="w-full px-12 py-5 bg-[#e2e1ff] hover:bg-[#d5d4ff] text-[#1a1a1a] font-semibold text-xl rounded-full transition-colors duration-300"
                                    >
                                        Full project
                                    </button>
                                </div>

                                {/* Right Image Area */}
                                <div className="lg:w-1/2 p-6 lg:p-8 flex items-center justify-center">
                                    <div className="relative w-full h-full min-h-[300px] md:min-h-[400px] rounded-[32px] overflow-hidden shadow-md">
                                        <Image
                                            src={item.mainImage || "/logo deero-02 .svg"}
                                            alt={item.title}
                                            fill
                                            className="object-cover transition-transform duration-500 hover:scale-105"
                                            onError={(e) => {
                                                const target = e.target as HTMLImageElement;
                                                target.src = "/logo deero-02 .svg";
                                            }}
                                        />
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    ) : error ? (
                        <div className="col-span-full py-20 text-center text-red-600">
                            {error}
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
