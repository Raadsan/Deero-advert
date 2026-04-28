"use client";
export const dynamic = 'force-static';

import Header from "@/components/layout/Header";
import Link from "next/link";
import Footer from "@/components/layout/Footer";
import PortfolioSection from "@/components/home/PortfolioSection";

const PortfolioHero = () => {
    return (
        <section className="relative w-full bg-gradient-to-r from-[#4d0e0e] via-[#651313] to-[#EB4724] py-20 lg:py-24 px-4 overflow-hidden">
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

            <div className="mx-auto max-w-6xl relative z-10 flex flex-col md:flex-row items-center justify-center">
                {/* Title - Centered */}
                <h1 className="text-4xl md:text-5xl lg:text-5xl font-bold text-white text-center flex-grow">
                    Portfolio
                </h1>

                {/* Breadcrumb - Absolute to the right on desktop */}
                <nav className="md:absolute md:right-4 flex items-center gap-2 text-white/90 font-medium text-xs md:text-sm mt-4 md:mt-0 bg-black/10 backdrop-blur-sm md:bg-transparent p-2 rounded-lg">

                </nav>
            </div>
        </section>
    );
};

export default function PortfolioPage() {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow pt-[106px] md:pt-[131px]">
                <PortfolioHero />
                <div className="bg-[#fcd7c3] py-16 px-4 sm:px-10">
                    <div className="mx-auto max-w-6xl xl:max-w-7xl">
                        <Link 
                            href="https://www.behance.net/deeroadvert"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-white rounded-[20px] shadow-sm p-2 flex flex-col sm:flex-row items-center border border-gray-100 group hover:shadow-md hover:border-[#EB4724]/30 transition-all duration-300"
                        >
                            <div className="flex items-center flex-grow px-4 w-full sm:w-auto h-14 overflow-hidden">
                                <span className="text-gray-600 font-medium text-[15px] md:text-[16px] truncate w-full">
                                    Explore our comprehensive portfolio of creative projects, featuring innovative designs and strategic branding solutions.
                                </span>
                            </div>
                            <div className="bg-[#601414] group-hover:bg-[#4a0f0f] text-white px-8 h-14 rounded-[14px] font-semibold text-lg transition-all flex items-center justify-center gap-3 w-full sm:w-auto shrink-0 mt-2 sm:mt-0">
                                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M22 7h-7v-2h7v2zm1.726 10c-.442 1.297-2.029 3-5.101 3-3.074 0-5.564-1.729-5.564-5.675 0-3.918 2.338-5.699 5.656-5.699 3.236 0 5.239 1.987 5.239 5.399 0 1.258-.231 2.975-.231 2.975zm-3.029-2.993c0-.986-.71-2.128-2.072-2.128-1.579 0-2.302 1.242-2.302 2.128h4.374zm-14.61-3.619c-1.228 0-2.088.948-2.088 2.222 0 1.272.859 2.221 2.088 2.221 1.227 0 2.087-.948 2.087-2.221 0-1.274-.86-2.222-2.087-2.222zm1.618 6.772c-1.393 1.156-3.23 1.84-5.26 1.84h-4.445v-18h5.086c2.478 0 4.708 1.161 4.708 3.992 0 2.453-1.637 3.39-3.072 3.655 1.638.285 3.328 1.487 3.328 3.864 0 2.015-1.523 3.616-3.345 4.649zm-5.748-12.721h-2.126v4.612h2.126c1.373 0 2.25-.805 2.25-2.306 0-1.5-.877-2.306-2.25-2.306zm2.748 7.426c0-1.599-1.01-2.478-2.585-2.478h-2.289v5.045h2.289c1.574 0 2.585-.88 2.585-2.567z"/></svg>
                                View on Behance
                            </div>
                        </Link>
                    </div>
                </div>
                <PortfolioSection showHeader={false} paddingClasses="pb-20 pt-4 px-4 sm:px-10" />
            </main>
            <Footer />
        </div>
    );
}

