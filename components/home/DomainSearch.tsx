"use client";

import Image from "next/image";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

export default function DomainSearch() {
    return (
        <section className="bg-[#fcd7c3] py-12 px-4 sm:px-10 ">
            <div className="mx-auto max-w-6xl flex flex-col md:flex-row items-center justify-between gap-8">
                {/* Left side: Search */}
                <div className="flex-1 space-y-8">
                    <h2 className="text-3xl font-bold text-[#651313]">Choose Your Domain Today!</h2>

                    <div className="flex overflow-hidden rounded-md shadow-sm max-w-2xl">
                        <input
                            type="text"
                            placeholder="Search your Domain"
                            className="flex-1 px-4 py-3 text-lg outline-none bg-white/90"
                        />
                        <button className="bg-[#651313] px-6 py-3 text-white flex items-center gap-2 hover:bg-[#4d0e0e] transition">
                            <MagnifyingGlassIcon className="h-6 w-6" />
                            <span className="font-bold">Search</span>
                        </button>
                    </div>

                    <div className="flex flex-wrap gap-8 text-[#651313]">
                        <div className="text-center">
                            <p className="text-2xl font-bold">.com</p>
                            <p className="text-sm font-semibold text-[#EB4724]">$14.99/Year</p>
                        </div>
                        <div className="text-center">
                            <p className="text-2xl font-bold">.org</p>
                            <p className="text-sm font-semibold text-[#EB4724]">$14.99/Year</p>
                        </div>
                        <div className="text-center">
                            <p className="text-2xl font-bold">.net</p>
                            <p className="text-sm font-semibold text-[#EB4724]">$14.99/Year</p>
                        </div>
                        <div className="text-center">
                            <p className="text-2xl font-bold">.edu</p>
                            <p className="text-sm font-semibold text-[#EB4724]">$14.99/Year</p>
                        </div>
                    </div>
                </div>

                {/* Right side: Discount Badge */}
                <div className="relative w-64 h-64 shrink-0">
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
