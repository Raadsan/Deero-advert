"use client";

import { useState } from "react";
import { MagnifyingGlassIcon, ArrowPathIcon } from "@heroicons/react/24/outline";
import { motion, AnimatePresence } from "framer-motion";

import { checkDomainAvailability, DomainCheckResult } from "../../api/domainApi";
import { ExclamationCircleIcon, CheckCircleIcon } from "@heroicons/react/24/outline";

export default function HostingDomainSearch() {
    const [activeTab, setActiveTab] = useState<'register' | 'transfer'>('register');
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
        <section className="bg-[#fcd7c3] py-16 px-4 sm:px-10 relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 opacity-10 pointer-events-none">
                <div className="w-64 h-64 bg-white rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            </div>

            <div className="mx-auto max-w-4xl relative z-10">
                <div className="text-center mb-10">
                    <h2 className="text-3xl font-bold text-[#651313] mb-4">
                        Search Your Domain Name
                    </h2>
                    <p className="text-[#651313]/80 mb-8 max-w-lg mx-auto">
                        Your perfect domain name is waiting for you. Search now to find it or transfer your existing one.
                    </p>

                    {/* Tabs */}
                    <div className="inline-flex bg-white/50 p-1 rounded-full backdrop-blur-sm border border-white/20">
                        <button
                            onClick={() => setActiveTab('register')}
                            className={`px-6 py-2 rounded-full text-sm font-bold transition-all duration-300 ${activeTab === 'register'
                                ? 'bg-[#EB4724] text-white shadow-md'
                                : 'text-[#651313] hover:bg-white/50'
                                }`}
                        >
                            Register Domain
                        </button>
                        <button
                            onClick={() => setActiveTab('transfer')}
                            className={`px-6 py-2 rounded-full text-sm font-bold transition-all duration-300 ${activeTab === 'transfer'
                                ? 'bg-[#EB4724] text-white shadow-md'
                                : 'text-[#651313] hover:bg-white/50'
                                }`}
                        >
                            Transfer Domain
                        </button>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-xl p-8 border border-white/40">
                    <AnimatePresence mode="wait">
                        {activeTab === 'register' ? (
                            <motion.div
                                key="register"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.3 }}
                                className="space-y-6"
                            >
                                <div className="flex flex-col md:flex-row gap-4">
                                    <div className="flex-1 relative">
                                        <input
                                            type="text"
                                            value={query}
                                            onChange={(e) => setQuery(e.target.value)}
                                            placeholder="Enter your domain name (e.g. example.com)"
                                            className="w-full px-6 py-4 rounded-xl border border-gray-200 focus:border-[#EB4724] focus:ring-2 focus:ring-[#EB4724]/10 focus:outline-none transition-all text-lg text-black"
                                        />
                                        <MagnifyingGlassIcon className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
                                    </div>
                                    <button
                                        onClick={handleSearch}
                                        disabled={loading}
                                        className="bg-[#651313] text-white px-8 py-4 rounded-xl font-bold hover:bg-[#4d0e0e] transition-colors flex items-center justify-center gap-2 shadow-lg hover:shadow-xl active:scale-95 duration-200 disabled:opacity-70"
                                    >
                                        {loading ? (
                                            <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                                        ) : (
                                            <MagnifyingGlassIcon className="w-5 h-5" />
                                        )}
                                        Search
                                    </button>
                                </div>

                                {/* Results Section */}
                                {results && query && (
                                    <div className="space-y-4 pt-4 border-t border-gray-100">
                                        {/* Main Result Banner */}
                                        {(() => {
                                            const searchDomain = query.includes('.') ? query.toLowerCase() : `${query.toLowerCase()}.com`;
                                            const match = results.find(r => r.domain.toLowerCase() === searchDomain);

                                            if (match) {
                                                if (!match.available) {
                                                    return (
                                                        <div className="w-full bg-[#651313]/5 rounded-xl p-4 flex items-center gap-3 text-[#651313]">
                                                            <div className="bg-[#651313] rounded-full p-1 shrink-0">
                                                                <ExclamationCircleIcon className="w-5 h-5 text-white" />
                                                            </div>
                                                            <span className="font-semibold text-lg">{match.domain} is unavailable</span>
                                                        </div>
                                                    );
                                                } else {
                                                    return (
                                                        <div className="w-full bg-green-50 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-green-700">
                                                            <div className="flex items-center gap-3">
                                                                <div className="bg-green-600 rounded-full p-1 shrink-0">
                                                                    <CheckCircleIcon className="w-5 h-5 text-white" />
                                                                </div>
                                                                <span className="font-semibold text-lg">{match.domain} is available!</span>
                                                            </div>
                                                            <button className="whitespace-nowrap bg-[#EB4724] hover:bg-[#d13d1d] text-white px-6 py-2 rounded-lg font-bold transition-colors shadow-sm active:scale-95">
                                                                Add to Cart
                                                            </button>
                                                        </div>
                                                    );
                                                }
                                            }
                                            return null;
                                        })()}

                                        {/* Other Extensions Grid */}
                                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                            {results.map((res) => {
                                                const ext = res.domain.substring(res.domain.lastIndexOf('.'));
                                                return (
                                                    <div key={res.domain} className="bg-gray-50 p-4 rounded-xl text-center border border-gray-100 hover:border-[#EB4724]/30 transition-all flex flex-col items-center justify-center gap-3">
                                                        <div>
                                                            <p className="text-xl font-bold text-[#651313]">{ext}</p>
                                                            {res.available ? (
                                                                <p className="text-sm font-semibold text-[#EB4724]">{res.price}</p>
                                                            ) : (
                                                                <p className="text-sm font-bold text-red-600">Taken</p>
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        ) : (
                            <motion.div
                                key="transfer"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.3 }}
                                className="space-y-6"
                            >
                                <div className="flex flex-col md:flex-row gap-4">
                                    <div className="flex-1 relative">
                                        <input
                                            type="text"
                                            placeholder="Enter domain to transfer"
                                            className="w-full px-6 py-4 rounded-xl border border-gray-200 focus:border-[#EB4724] focus:ring-2 focus:ring-[#EB4724]/10 focus:outline-none transition-all text-lg"
                                        />
                                        <ArrowPathIcon className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
                                    </div>
                                    <div className="w-full md:w-48">
                                        <input
                                            type="text"
                                            placeholder="Auth Code"
                                            className="w-full px-6 py-4 rounded-xl border border-gray-200 focus:border-[#EB4724] focus:ring-2 focus:ring-[#EB4724]/10 focus:outline-none transition-all text-lg"
                                        />
                                    </div>
                                    <button className="bg-[#651313] text-white px-8 py-4 rounded-xl font-bold hover:bg-[#4d0e0e] transition-colors flex items-center justify-center gap-2 shadow-lg hover:shadow-xl active:scale-95 duration-200 whitespace-nowrap">
                                        <ArrowPathIcon className="w-5 h-5" />
                                        Transfer
                                    </button>
                                </div>
                                <p className="text-center text-sm text-gray-500">
                                    Transfer your domain to Deero Advert and get 1 year renewal for free!
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </section>
    );
}
