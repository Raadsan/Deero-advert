"use client";

import Link from "next/link";
import { ChevronRightIcon } from "@heroicons/react/24/solid";

export default function ServicesHero() {
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
                    Services
                </h1>

                {/* Breadcrumb - Absolute to the right on desktop */}
                <nav className="md:absolute md:right-4 flex items-center gap-2 text-white/90 font-medium text-xs md:text-sm mt-4 md:mt-0 bg-black/10 backdrop-blur-sm md:bg-transparent p-2 rounded-lg">
                
                </nav>
            </div>
        </section>
    );
}


