"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

import { useState, useEffect } from "react";
import { getPortfolios } from "@/api/portfolioApi";
import { getImageUrl, slugify } from "@/utils/url";
import { ArrowRight } from "lucide-react";
import ImageModal from "../layout/ImageModal";





export default function PortfolioSection({ showHeader = true, limit }: { showHeader?: boolean; limit?: number }) {
    const router = useRouter();
    const [portfolios, setPortfolios] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedItem, setSelectedItem] = useState<any | null>(null);

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
            <div className="mx-auto max-w-6xl">
                {/* Header Area */}
                {showHeader && (
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-16 gap-8 text-center md:text-left">
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                        >
                            <h2 className="text-2xl md:text-3xl font-bold text-[#651313]">Our Portfolios</h2>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                        >
                            <Link
                                href="/portfolio"
                                className="bg-[#EB4724] text-white px-10 py-3 rounded-full font-bold hover:bg-[#d13d1d] transition-all uppercase tracking-wider text-sm shadow-md inline-block"
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
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, amount: 0.2 }}
                                transition={{ duration: 0.8, delay: index * 0.1 }}
                                className="bg-white rounded-3xl overflow-hidden shadow-sm flex flex-col lg:flex-row min-h-[400px] lg:gap-12"
                            >
                                {/* Left Content Area */}
                                <div className="lg:w-1/2 p-8 md:p-12 flex flex-col justify-between">
                                    <div>
                                        <h3 className="text-2xl md:text-3xl font-semibold text-[#651313] mb-4 tracking-tighter capitalize">
                                            {item.title}
                                        </h3>
                                        <p className="text-gray-600 text-base leading-relaxed mb-8 max-w-xl line-clamp-4">
                                            {item.description}
                                        </p>
                                    </div>

                                    {/* Year and Industry */}
                                    <div className="flex gap-12 mb-8">
                                        <div>
                                            <p className="text-lg font-bold text-[#1a1a1a] mb-1">Year:</p>
                                            <p className="text-base text-gray-500 font-medium">{item.year || "N/A"}</p>
                                        </div>
                                        <div>
                                            <p className="text-lg font-bold text-[#1a1a1a] mb-1">Industry:</p>
                                            <p className="text-base text-gray-500 font-medium">{item.industry || "N/A"}</p>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => handlePortfolioClick(item)}
                                        className="group w-full px-12 py-5 bg-[#651313] hover:bg-[#EC4724] text-white font-semibold text-lg rounded-full transition-colors duration-300 flex items-center justify-center gap-2"
                                    >
                                        <span>Full project</span>
                                        <ArrowRight className="w-5 h-5 opacity-0 translate-x-[-10px] group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                                    </button>
                                </div>

                                {/* Right Image Area */}
                                <div className="lg:w-1/2 p-6 lg:p-8 flex items-center justify-center">
                                    <div
                                        className="relative w-full rounded-2xl overflow-hidden shadow-md cursor-pointer group/image"
                                        onClick={() => setSelectedItem(item)}
                                    >
                                        <div className="absolute inset-0 bg-black/0 group-hover/image:bg-black/10 transition-colors z-10 flex items-center justify-center">

                                        </div>
                                        <Image
                                            src={item.mainImage || "/logo deero-02 .svg"}
                                            alt={item.title}
                                            width={800}
                                            height={600}
                                            style={{ width: '100%', height: 'auto' }}
                                            className="object-contain"
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
            </div>

            {/* Image Modal */}
            <ImageModal
                isOpen={!!selectedItem}
                onClose={() => setSelectedItem(null)}
                onNext={() => {
                    if (!selectedItem) return;
                    const currentIndex = portfolios.findIndex(p => p._id === selectedItem._id);
                    if (currentIndex < portfolios.length - 1) {
                        setSelectedItem(portfolios[currentIndex + 1]);
                    }
                }}
                onPrev={() => {
                    if (!selectedItem) return;
                    const currentIndex = portfolios.findIndex(p => p._id === selectedItem._id);
                    if (currentIndex > 0) {
                        setSelectedItem(portfolios[currentIndex - 1]);
                    }
                }}
                hasNext={selectedItem && portfolios.findIndex(p => p._id === selectedItem._id) < portfolios.length - 1}
                hasPrev={selectedItem && portfolios.findIndex(p => p._id === selectedItem._id) > 0}
            >
                {selectedItem && (
                    <div className="relative w-auto h-auto max-w-[90vw] max-h-[90vh]">
                        <Image
                            src={selectedItem.mainImage || "/logo deero-02 .svg"}
                            alt={selectedItem.title}
                            width={1200}
                            height={800}
                            style={{ width: 'auto', height: 'auto', maxHeight: '90vh', objectFit: 'contain' }}
                            onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = "/logo deero-02 .svg";
                            }}
                        />
                    </div>
                )}
            </ImageModal>
        </section>
    );
}
