"use client";

import Link from "next/link";
import Image from "next/image";
import { MagnifyingGlassIcon, ExclamationCircleIcon, CheckCircleIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { checkDomainAvailability, DomainCheckResult } from "../../api/domainCheckerApi";

export default function DomainSearch() {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<DomainCheckResult[] | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSearch = async () => {
        if (!query.trim()) return;
        setLoading(true);
        try {
            const data = await checkDomainAvailability(query);
            if (data.success) {
                setResults(data.results);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

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
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search your Domain"
                            className="flex-1 px-3 sm:px-4 py-2 sm:py-3 text-base sm:text-lg outline-none bg-white/90 text-black"
                        />
                        <button
                            onClick={handleSearch}
                            disabled={loading}
                            className="bg-[#651313] px-4 sm:px-6 py-2 sm:py-3 text-white flex items-center gap-1 sm:gap-2 hover:bg-[#4d0e0e] transition disabled:opacity-70"
                        >
                            {loading ? (
                                <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                            ) : (
                                <MagnifyingGlassIcon className="h-5 w-5 sm:h-6 sm:w-6" />
                            )}
                            <span className="font-bold text-sm sm:text-base">Search</span>
                        </button>
                    </div>

                    {/* Banner for primary domain status */}
                    {results && query && (() => {
                        const searchDomain = query.includes('.') ? query.toLowerCase() : `${query.toLowerCase()}.com`;
                        const match = results.find(r => r.domain.toLowerCase() === searchDomain);

                        if (match) {
                            if (!match.available) {
                                return (
                                    <div className="w-full max-w-2xl bg-white rounded-md p-3 flex items-center gap-2 text-[#651313]">
                                        <div className="bg-[#651313] rounded-full p-1">
                                            <ExclamationCircleIcon className="w-5 h-5 text-white" />
                                        </div>
                                        <span className="font-medium text-lg">{match.domain} is unavailable</span>
                                    </div>
                                );
                            } else {
                                return (
                                    <div className="w-full max-w-2xl bg-white rounded-md p-3 flex items-center gap-2 text-green-700">
                                        <div className="bg-green-600 rounded-full p-1">
                                            <CheckCircleIcon className="w-5 h-5 text-white" />
                                        </div>
                                        <span className="font-medium text-lg">{match.domain} is available!</span>
                                    </div>
                                );
                            }
                        }
                        return null;
                    })()}

                    <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-6 sm:gap-12 text-[#651313]">
                        {!results ? (
                            <>
                                <div className="text-center">
                                    <p className="text-2xl sm:text-3xl font-bold">.com</p>
                                    <p className="text-sm sm:text-base font-semibold text-[#EB4724]">$14.99/Year</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-2xl sm:text-3xl font-bold">.org</p>
                                    <p className="text-sm sm:text-base font-semibold text-[#EB4724]">$14.99/Year</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-2xl sm:text-3xl font-bold">.net</p>
                                    <p className="text-sm sm:text-base font-semibold text-[#EB4724]">$14.99/Year</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-2xl sm:text-3xl font-bold">.edu</p>
                                    <p className="text-sm sm:text-base font-semibold text-[#EB4724]">$14.99/Year</p>
                                </div>
                            </>
                        ) : (
                            results.map((res) => {
                                const ext = res.domain.substring(res.domain.lastIndexOf('.'));
                                return (
                                    <div key={res.domain} className="text-center">
                                        <p className="text-2xl sm:text-3xl font-bold">{ext}</p>
                                        {res.available ? (
                                            <p className="text-sm sm:text-base font-semibold text-[#EB4724]">{res.price}</p>
                                        ) : (
                                            <p className="text-sm sm:text-base font-bold text-red-600">Taken</p>
                                        )}
                                    </div>
                                );
                            })
                        )}
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
