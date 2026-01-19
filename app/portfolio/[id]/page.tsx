"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import { getPortfolios, getPortfolioById } from "@/api/portfolioApi";
import { getImageUrl, slugify } from "@/utils/url";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";



export default function PortfolioGalleryPage() {
    const params = useParams();
    const router = useRouter();
    const portfolioId = params.id as string;

    const [portfolio, setPortfolio] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPortfolio = async () => {
            try {
                setLoading(true);
                // Try to find by slug first (since we expect slugs now)
                // Note: The backend getPortfolioById likely expects an ObjectID.
                // If param is a slug, direct lookup by ID will fail.
                // So we'll fetch all and filter by slug.

                // However, check if it looks like an ID (24 hex chars)
                const isId = /^[0-9a-fA-F]{24}$/.test(portfolioId);

                if (isId) {
                    try {
                        const singleResponse = await getPortfolioById(portfolioId);
                        const singleData = singleResponse.data;
                        if (singleData.success && singleData.portfolio) {
                            setPortfolio(singleData.portfolio);
                            return;
                        }
                    } catch (singleError) {
                        console.log("Single portfolio fetch failed, falling back to getAll:", singleError);
                    }
                }

                // Fallback: fetch all portfolios and find by ID OR Slug
                const response = await getPortfolios();
                const data = response.data;
                console.log("Portfolio page - All portfolios response:", data);

                let items = [];

                if (data.success) {
                    if (Array.isArray(data.portfolios)) {
                        items = data.portfolios;
                    } else if (data.portfolio) {
                        items = Array.isArray(data.portfolio) ? data.portfolio : [data.portfolio];
                    }
                } else if (Array.isArray(data)) {
                    items = data;
                } else if (Array.isArray(data.portfolios)) {
                    items = data.portfolios;
                }

                // Find the specific portfolio by ID or Slug
                const foundPortfolio = items.find((p: any) => {
                    if (p._id === portfolioId) return true;
                    if (p.title && slugify(p.title) === portfolioId) return true;
                    return false;
                });

                console.log("Portfolio page - Found portfolio:", foundPortfolio);
                setPortfolio(foundPortfolio);
            } catch (error) {
                console.error("Error fetching portfolio:", error);
            } finally {
                setLoading(false);
            }
        };

        if (portfolioId) {
            fetchPortfolio();
        }
    }, [portfolioId]);

    if (!loading && !portfolio) {
        return (
            <div className="min-h-screen bg-[#fcd7c3] flex flex-col items-center justify-center px-4">
                <h1 className="text-3xl font-bold text-[#651313] mb-4">Portfolio Not Found</h1>
                <button
                    onClick={() => router.push("/")}
                    className="bg-[#EB4724] text-white px-6 py-3 rounded-full font-bold hover:bg-[#d13d1d] transition-all"
                >
                    Go Back Home
                </button>
            </div>
        );
    }

    const galleryImages = portfolio?.gallery || [];

    return (
        <>
            <Header />
            <div className="min-h-screen bg-[#fcd7c3] pt-[220px] pb-20 px-4 sm:px-10">
                <div className="mx-auto max-w-7xl">
                    {/* Title */}
                    <div className="text-center mb-16">
                        {loading ? (
                            <div className="h-12 w-64 bg-[#651313]/10 animate-pulse rounded-lg mx-auto mb-4" />
                        ) : (
                            <h1 className="text-4xl md:text-5xl font-black text-[#651313] mb-4 uppercase tracking-tighter italic">
                                {portfolio?.title}
                            </h1>
                        )}
                        <div className="w-24 h-1.5 bg-[#EB4724] mx-auto rounded-full" />
                    </div>

                    {/* Gallery Grid */}
                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {Array.from({ length: 6 }).map((_, i) => (
                                <div key={i} className="aspect-[4/3] bg-white/50 animate-pulse rounded-md shadow-sm" />
                            ))}
                        </div>
                    ) : galleryImages.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {galleryImages.map((img: string, index: number) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 50 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, amount: 0.1 }}
                                    transition={{ duration: 0.8, delay: index * 0.1 }}
                                    className="relative aspect-[4/3] group overflow-hidden rounded-md shadow-lg bg-white"
                                >
                                    <Image
                                        src={getImageUrl(img) || "/logo deero-02 .svg"}
                                        alt={`${portfolio.title} gallery ${index + 1}`}
                                        fill
                                        className="object-cover"
                                        onError={(e) => {
                                            const target = e.target as HTMLImageElement;
                                            target.src = "/logo deero-02 .svg";
                                        }}
                                    />
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20">
                            <p className="text-[#651313]/60 italic text-lg">No gallery images available for this portfolio.</p>
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </>
    );
}
