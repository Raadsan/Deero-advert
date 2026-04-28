"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon } from "@heroicons/react/24/outline";

export default function MobileDownload() {
    return (
        <section className="bg-[#fcd7c3] pt-6 sm:pt-10 pb-0 px-4 sm:px-10 overflow-hidden">
            <div className="mx-auto max-w-6xl xl:max-w-7xl">
                <div className="flex flex-col md:flex-row items-center justify-between gap-10 md:gap-8">

                    {/* Left: Text & Buttons - Matching the logic of the reference image */}
                    <div className="flex-1 space-y-6 md:space-y-8 z-10 text-left md:ml-8 md:pb-10">
                        <div className="space-y-4">
                            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#651313] leading-[1.3]">
                                Shop, Earn & Unlock More with <br />
                                Your One-Stop Agency
                            </h2>
                            <p className="text-[#651313]/70 text-base sm:text-lg max-w-xl leading-relaxed">
                                Download the Deero Advert App to explore services, earn bonuses, track your progress, get monthly discounts, and unlock an exclusive 50% discount on premium services.
                            </p>
                        </div>

                        {/* Actions Area: Primary Button + Small Icon Buttons */}
                        <div className="flex flex-wrap items-center gap-4">
                            {/* App Store Badge */}
                            <Link
                                href="#"
                                className="flex items-center gap-3 bg-[#651313] px-5 py-2.5 rounded-xl transition-transform hover:scale-105 active:scale-95 shadow-lg"
                            >
                                <svg viewBox="0 0 512 512" fill="white" className="w-6 h-6">
                                    <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" />
                                </svg>
                                <div className="flex flex-col leading-none">
                                    <span className="text-[10px] font-bold text-white/80 uppercase tracking-tight">Download on</span>
                                    <span className="text-lg font-black text-white">App Store</span>
                                </div>
                            </Link>

                            {/* Google Play Badge */}
                            <Link
                                href="#"
                                className="flex items-center gap-3 bg-[#651313] px-5 py-2.5 rounded-xl transition-transform hover:scale-105 active:scale-95 shadow-lg"
                            >
                                <svg viewBox="0 0 24 24" fill="white" className="w-5 h-5">
                                    <path d="M8 5v14l11-7z" />
                                </svg>
                                <div className="flex flex-col leading-none">
                                    <span className="text-[10px] font-bold text-white/80 uppercase tracking-tight">GET IT ON</span>
                                    <span className="text-lg font-black text-white">Google Play</span>
                                </div>
                            </Link>
                        </div>
                    </div>

                    {/* Right: Phone Mockup - Increased size and aligned to bottom */}
                    <div className="relative w-full md:w-auto flex justify-center md:justify-center items-center pr-4 md:pr-0">
                        <div className="relative w-80 h-[400px] sm:w-[450px] sm:h-[450px] md:w-[600px] md:h-[600px]">
                            {/* Primary Phone */}
                            <div className="absolute inset-0 w-full h-full transform">
                                <Image
                                    src="/deero_app1.png"
                                    alt="Deero Advert Mobile App"
                                    fill
                                    className="object-contain object-center"
                                />
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
