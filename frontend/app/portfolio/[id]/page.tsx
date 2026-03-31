"use client";
export const dynamic = 'force-static';

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import { getPortfolios, getPortfolioById } from "@/api-client/portfolioApi";
import { getImageUrl, slugify } from "@/utils/url";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { ArrowLeft, ArrowRight } from "lucide-react";
import ImageModal from "@/components/layout/ImageModal";

export default function PortfolioDetailPage() {
    const params = useParams();
    const router = useRouter();
    const identifier = params.id as string;

    const [portfolio, setPortfolio] = useState<any>(null);
    const [nextProject, setNextProject] = useState<any>(null);
    const [prevProject, setPrevProject] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    useEffect(() => {
        const fetchPortfolio = async () => {
            try {
                setLoading(true);
                const isId = /^[0-9a-fA-F]{24}$/.test(identifier);

                const response = await getPortfolios();
                const data = response.data;
                let items: any[] = [];

                if (data.success) {
                    items = Array.isArray(data.portfolios) ? [...data.portfolios].reverse() : (data.portfolio ? [data.portfolio] : []);
                } else if (Array.isArray(data)) {
                    items = [...data].reverse();
                }

                const currentIndex = items.findIndex((p: any) =>
                    p._id === identifier || (p.title && slugify(p.title) === identifier)
                );

                if (currentIndex !== -1) {
                    setPortfolio(items[currentIndex]);
                    
                    if (items.length > 1) {
                        const nextIdx = currentIndex + 1;
                        const prevIdx = currentIndex - 1;
                        setNextProject(nextIdx < items.length ? items[nextIdx] : null);
                        setPrevProject(prevIdx >= 0 ? items[prevIdx] : null);
                    }
                } else {
                    // Fallback to direct ID fetch if not found in list (e.g. unlisted)
                    if (isId) {
                        try {
                            const singleResponse = await getPortfolioById(identifier);
                            if (singleResponse.data.success && singleResponse.data.portfolio) {
                                setPortfolio(singleResponse.data.portfolio);
                            }
                        } catch (e) {
                            console.log("Direct ID fetch failed");
                        }
                    }
                }

            } catch (error) {
                console.error("Error fetching portfolio:", error);
            } finally {
                setLoading(false);
            }
        };

        if (identifier) fetchPortfolio();
    }, [identifier]);

    if (!loading && !portfolio) {
        return (
            <div className="min-h-screen bg-white flex flex-col items-center justify-center pt-32">
                <h1 className="text-3xl font-bold text-[#651313] mb-4">Project Not Found</h1>
                <button
                    onClick={() => router.push("/portfolio")}
                    className="bg-[#651313] text-white px-8 py-3 rounded-full font-bold hover:bg-[#EC4724] transition-all"
                >
                    Back to Portfolio
                </button>
            </div>
        );
    }

    const galleryImages = portfolio?.gallery || [];

    return (
        <div className="bg-white min-h-screen">
            <Header />

            <main className="pt-[220px] pb-24 px-4 sm:px-10">
                <div className="mx-auto max-w-7xl">

                    {/* Hero Section - Pure Image Display */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="w-full mb-16 relative flex items-center justify-center"
                    >
                        {loading ? (
                            <div className="w-full h-[500px] bg-gray-50 animate-pulse rounded-[40px]" />
                        ) : (
                            <div className="relative w-full h-[600px] rounded-[24px] overflow-hidden shadow-md border border-[#651313]/5">
                                <Image
                                    src={getImageUrl(portfolio?.mainImage) || "/logo deero-02 .svg"}
                                    alt={portfolio?.title || "Project Image"}
                                    fill
                                    className="object-cover"
                                    priority
                                    unoptimized
                                    onError={(e) => {
                                        const target = e.target as HTMLImageElement;
                                        target.src = "/logo deero-02 .svg";
                                    }}
                                />
                            </div>
                        )}


                    </motion.div>

                    {/* Information Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="max-w-5xl"
                    >
                        <h1 className="text-4xl md:text-7xl font-bold text-[#651313] mb-8 tracking-tighter capitalize leading-none">
                            {portfolio?.title}
                        </h1>
                        <div className="space-y-6 mb-12">
                            <h3 className="text-xl md:text-2xl font-bold text-[#651313]">Project Description</h3>
                            <p className="text-gray-700 text-lg md:text-xl leading-relaxed whitespace-pre-wrap">
                                {portfolio?.description || "No description provided."}
                            </p>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-12 pt-8 border-t border-[#651313]/10 mb-20">
                            <div>
                                <p className="text-[#1a1a1a] font-bold text-xl mb-1">Year:</p>
                                <p className="text-gray-500 text-lg md:text-xl font-medium">{portfolio?.year || "N/A"}</p>
                            </div>
                            <div>
                                <p className="text-[#1a1a1a] font-bold text-xl mb-1">Industry:</p>
                                <p className="text-gray-500 text-lg md:text-xl font-medium capitalize">{portfolio?.industry || "N/A"}</p>
                            </div>
                            {portfolio?.projectDirection && portfolio.projectDirection.length > 0 && (
                                <div className="col-span-2 md:col-span-1">
                                    <p className="text-[#1a1a1a] font-bold text-xl mb-2">Project direction:</p>
                                    <ul className="space-y-1">
                                        {portfolio.projectDirection.map((item: string, i: number) => (
                                            <li key={i} className="text-gray-500 text-lg md:text-xl font-medium">{item}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </motion.div>

                    {/* Gallery Section - Cinematic Bento Grid */}
                    {galleryImages.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="pt-16 border-t border-[#651313]/10"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 auto-rows-[250px] md:auto-rows-[300px]">
                                {galleryImages.map((img: string, i: number) => {
                                    // Cinematic Pattern: 1st is full width, then staggered mosaic
                                    let spanClass = "col-span-1 md:col-span-4 row-span-1";

                                    if (i === 0) {
                                        // Row 1: Cinematic Full Width
                                        spanClass = "col-span-1 md:col-span-12 row-span-2";
                                    } else if (i === 1) {
                                        // Row 2 Left
                                        spanClass = "col-span-1 md:col-span-4 row-span-1";
                                    } else if (i === 2) {
                                        // Row 2 Middle
                                        spanClass = "col-span-1 md:col-span-5 row-span-1";
                                    } else if (i === 3) {
                                        // Row 2 Right (Top Right)
                                        spanClass = "col-span-1 md:col-span-3 row-span-1";
                                    } else if (i === 4) {
                                        // Row 3 Left
                                        spanClass = "col-span-1 md:col-span-6 row-span-1";
                                    } else if (i === 5) {
                                        // Row 3 Middle
                                        spanClass = "col-span-1 md:col-span-3 row-span-1";
                                    } else if (i === 6) {
                                        // Row 3+4 Right (Tall / Vertical span)
                                        spanClass = "col-span-1 md:col-span-3 row-span-2";
                                    } else if (i === 7) {
                                        // Row 4 Left
                                        spanClass = "col-span-1 md:col-span-5 row-span-1";
                                    } else if (i === 8) {
                                        // Row 4 Middle
                                        spanClass = "col-span-1 md:col-span-4 row-span-1";
                                    } else if ((i - 9) % 6 < 3) {
                                        // Zigzag Pattern continues for remaining images
                                        if ((i - 9) % 3 === 0) spanClass = "col-span-1 md:col-span-3 row-span-1";
                                        else if ((i - 9) % 3 === 1) spanClass = "col-span-1 md:col-span-6 row-span-1";
                                        else spanClass = "col-span-1 md:col-span-3 row-span-1";
                                    } else {
                                        if ((i - 9) % 3 === 0) spanClass = "col-span-1 md:col-span-6 row-span-1";
                                        else spanClass = "col-span-1 md:col-span-3 row-span-1";
                                    }

                                    return (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            whileInView={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: i * 0.05 }}
                                            className={`${spanClass} relative rounded-[24px] overflow-hidden shadow-md border border-[#651313]/5 bg-white`}
                                        >
                                            <Image
                                                src={getImageUrl(img) || "/logo deero-02 .svg"}
                                                alt={`Project gallery ${i + 1}`}
                                                fill
                                                className="object-cover"
                                                unoptimized
                                            />
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </motion.div>
                    )}

                    {/* Navigation - Prev & Next Project */}
                    {(prevProject || nextProject) && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="pt-16 pb-8 border-t border-[#651313]/10 mt-16 flex flex-row justify-center items-center gap-4 md:gap-10"
                        >
                            {/* Prev Arrow */}
                            <button
                                onClick={() => {
                                     if (!prevProject) return;
                                     const url = prevProject.title ? `/portfolio/${slugify(prevProject.title)}` : `/portfolio/${prevProject._id}`;
                                     router.push(url);
                                }}
                                className={`w-14 h-14 md:w-16 md:h-16 rounded-full bg-[#fcd7c3]/30 hover:bg-[#651313] text-[#651313] hover:text-white flex items-center justify-center transition-all shadow-sm active:scale-95 shrink-0 group ${!prevProject ? 'invisible' : ''}`}
                            >
                                <ArrowLeft className="w-6 h-6 md:w-8 md:h-8 group-hover:-translate-x-1 transition-transform" />
                            </button>

                            {/* Center Title (Next Project) */}
                            <div className="text-center group cursor-pointer px-4"
                                 onClick={() => {
                                      if (!nextProject) return;
                                      const url = nextProject.title ? `/portfolio/${slugify(nextProject.title)}` : `/portfolio/${nextProject._id}`;
                                      router.push(url);
                                 }}
                            >
                                <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-[#651313] group-hover:text-[#EB4724] transition-colors capitalize">
                                    Next Project
                                </h2>
                            </div>

                            {/* Next Arrow */}
                            <button
                                onClick={() => {
                                     if (!nextProject) return;
                                     const url = nextProject.title ? `/portfolio/${slugify(nextProject.title)}` : `/portfolio/${nextProject._id}`;
                                     router.push(url);
                                }}
                                className={`w-14 h-14 md:w-16 md:h-16 rounded-full bg-[#fcd7c3]/30 hover:bg-[#651313] text-[#651313] hover:text-white flex items-center justify-center transition-all shadow-sm active:scale-95 shrink-0 group ${!nextProject ? 'invisible' : ''}`}
                            >
                                <ArrowRight className="w-6 h-6 md:w-8 md:h-8 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </motion.div>
                    )}
                </div>
            </main>

            {/* Call To Action Section */}
            <section className="bg-white pb-24 px-4 sm:px-10">
                <div className="mx-auto max-w-5xl bg-[#651313] rounded-[40px] py-10 md:py-14 px-8 text-center shadow-xl overflow-hidden relative group">
                    {/* Background Detail */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl group-hover:bg-white/10 transition-all duration-700" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full -ml-32 -mb-32 blur-3xl group-hover:bg-white/10 transition-all duration-700" />
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-2xl md:text-4xl font-bold text-white mb-4 tracking-tight leading-tight">
                            Build Your Vision with Professional Design
                        </h2>
                        <p className="text-white/70 text-base md:text-lg mb-8 max-w-2xl mx-auto leading-relaxed">
                            Ready to transform your brand into a visual masterpiece? Let's discuss how we can bring your next project to life.
                        </p>
                        <button
                            onClick={() => window.open("https://wa.me/252618553566", "_blank")}
                            className="bg-white text-[#651313] hover:bg-[#EC4724] hover:text-white px-8 py-4 rounded-full font-bold text-base md:text-lg shadow-xl active:scale-95 flex items-center gap-2 mx-auto"
                        >
                            Book A Call Now
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </button>
                    </motion.div>
                </div>
            </section>

            <ImageModal
                isOpen={!!selectedImage}
                onClose={() => setSelectedImage(null)}
                onNext={() => {
                    if (!selectedImage) return;
                    const idx = galleryImages.indexOf(selectedImage);
                    if (idx < galleryImages.length - 1) setSelectedImage(galleryImages[idx + 1]);
                }}
                onPrev={() => {
                    if (!selectedImage) return;
                    const idx = galleryImages.indexOf(selectedImage);
                    if (idx > 0) setSelectedImage(galleryImages[idx - 1]);
                }}
                hasNext={selectedImage ? galleryImages.indexOf(selectedImage) < galleryImages.length - 1 : false}
                hasPrev={selectedImage ? galleryImages.indexOf(selectedImage) > 0 : false}
            >
                {selectedImage && (
                    <div className="relative w-auto h-auto max-w-[90vw] max-h-[90vh]">
                        <Image
                            src={getImageUrl(selectedImage) || "/logo deero-02 .svg"}
                            alt="Project Gallery"
                            width={1200}
                            height={800}
                            className="max-h-[85vh] w-auto object-contain rounded-xl"
                            unoptimized
                        />
                    </div>
                )}
            </ImageModal>
            
            <Footer />
        </div>
    );
}
