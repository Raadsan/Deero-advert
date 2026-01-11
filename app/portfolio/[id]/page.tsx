"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowLeft, X } from "lucide-react";
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
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [currentIndex, setCurrentIndex] = useState(0);

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

    const openLightbox = (index: number) => {
        setCurrentIndex(index);
        setSelectedImage(portfolio.gallery[index]);
    };

    const closeLightbox = () => {
        setSelectedImage(null);
    };

    const nextImage = () => {
        const newIndex = (currentIndex + 1) % portfolio.gallery.length;
        setCurrentIndex(newIndex);
        setSelectedImage(portfolio.gallery[newIndex]);
    };

    const prevImage = () => {
        const newIndex = (currentIndex - 1 + portfolio.gallery.length) % portfolio.gallery.length;
        setCurrentIndex(newIndex);
        setSelectedImage(portfolio.gallery[newIndex]);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#fcd7c3] flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#EB4724]"></div>
            </div>
        );
    }

    if (!portfolio) {
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

    const galleryImages = portfolio.gallery || [];

    return (
        <>
            <Header />
            <div className="min-h-screen bg-[#fcd7c3] pt-[220px] pb-20 px-4 sm:px-10">
                <div className="mx-auto max-w-7xl">
                    {/* Title */}
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-5xl font-bold text-[#651313] mb-12 text-center"
                    >
                        {portfolio.title}
                    </motion.h1>

                    {/* Gallery Grid */}
                    {galleryImages.length > 0 ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                        >
                            {galleryImages.map((img: string, index: number) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: index * 0.1 }}
                                    whileHover={{ y: -8 }}
                                    className="relative aspect-[4/3] group overflow-hidden rounded-lg shadow-lg bg-white"
                                >
                                    <Image
                                        src={getImageUrl(img) || "/logo deero-02 .svg"}
                                        alt={`${portfolio.title} - Image ${index + 1}`}
                                        fill
                                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                                        onError={(e) => {
                                            const target = e.target as HTMLImageElement;
                                            target.src = "/logo deero-02 .svg";
                                        }}
                                    />
                                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                                </motion.div>
                            ))}
                        </motion.div>
                    ) : (
                        <div className="text-center py-20">
                            <p className="text-[#651313]/60 italic text-lg">No gallery images available for this portfolio.</p>
                        </div>
                    )}
                </div>

                {/* Lightbox */}
                {selectedImage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
                        onClick={closeLightbox}
                    >
                        {/* Close Button */}
                        <button
                            onClick={closeLightbox}
                            className="absolute top-4 right-4 text-white hover:text-[#EB4724] transition-colors z-10"
                        >
                            <X className="h-8 w-8" />
                        </button>

                        {/* Navigation Buttons */}
                        {galleryImages.length > 1 && (
                            <>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        prevImage();
                                    }}
                                    className="absolute left-4 text-white hover:text-[#EB4724] transition-colors z-10"
                                >
                                    <ArrowLeft className="h-10 w-10" />
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        nextImage();
                                    }}
                                    className="absolute right-4 text-white hover:text-[#EB4724] transition-colors z-10"
                                >
                                    <ArrowLeft className="h-10 w-10 rotate-180" />
                                </button>
                            </>
                        )}

                        {/* Image */}
                        <motion.div
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            className="relative max-w-5xl max-h-[80vh] w-full h-full"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <Image
                                src={getImageUrl(selectedImage) || "/logo deero-02 .svg"}
                                alt={`${portfolio.title} - Gallery Image`}
                                fill
                                className="object-contain"
                                onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.src = "/logo deero-02 .svg";
                                }}
                            />
                        </motion.div>

                        {/* Image Counter */}
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-sm">
                            {currentIndex + 1} / {galleryImages.length}
                        </div>
                    </motion.div>
                )}
            </div>
            <Footer />
        </>
    );
}
