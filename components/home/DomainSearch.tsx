"use client";

import Image from "next/image";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

export default function DomainSearch() {
    return (
        <section className="bg-[#fcd7c3] py-8 sm:py-12 px-4 sm:px-10">
            <div className="mx-auto max-w-6xl flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8">
                {/* Left side: Search */}
                <div className="flex-1 w-full space-y-4 sm:space-y-8">
                    <h2 className="text-2xl sm:text-3xl font-bold text-[#651313] leading-tight">
                        Choose Your Domain Today!
                    </h2>

                    <div className="flex overflow-hidden rounded-md shadow-sm w-full max-w-2xl">
                        <input
                            type="text"
                            placeholder="Search your Domain"
                            className="flex-1 px-3 sm:px-4 py-2 sm:py-3 text-base sm:text-lg outline-none bg-white/90"
                        />
                        <button className="bg-[#651313] px-4 sm:px-6 py-2 sm:py-3 text-white flex items-center gap-1 sm:gap-2 hover:bg-[#4d0e0e] transition">
                            <MagnifyingGlassIcon className="h-5 w-5 sm:h-6 sm:w-6" />
                            <span className="font-bold text-sm sm:text-base">Search</span>
                        </button>
                    </div>

                    <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-4 sm:gap-8 text-[#651313]">
                        <div className="text-center">
                            <p className="text-xl sm:text-2xl font-bold">.com</p>
                            <p className="text-xs sm:text-sm font-semibold text-[#EB4724]">$14.99/Year</p>
                        </div>
                        <div className="text-center">
                            <p className="text-xl sm:text-2xl font-bold">.org</p>
                            <p className="text-xs sm:text-sm font-semibold text-[#EB4724]">$14.99/Year</p>
                        </div>
                        <div className="text-center">
                            <p className="text-xl sm:text-2xl font-bold">.net</p>
                            <p className="text-xs sm:text-sm font-semibold text-[#EB4724]">$14.99/Year</p>
                        </div>
                        <div className="text-center">
                            <p className="text-xl sm:text-2xl font-bold">.edu</p>
                            <p className="text-xs sm:text-sm font-semibold text-[#EB4724]">$14.99/Year</p>
                        </div>
                    </div>
                </div>

                {/* Right side: Discount Badge */}
                <div className="relative w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 shrink-0">
                    <Image
                        src="/home-images/discount.svg"
                        alt="Limited Time Offer Sale .SO"
                        fill
                        className="object-contain"
                    />
                </div>
            </div>
        </section>
    );
}
