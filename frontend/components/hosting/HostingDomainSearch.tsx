"use client";

import { useState } from "react";
import { MagnifyingGlassIcon, ArrowPathIcon } from "@heroicons/react/24/outline";
import { motion, AnimatePresence } from "framer-motion";

export default function HostingDomainSearch() {
    const [activeTab, setActiveTab] = useState<'register' | 'transfer'>('register');

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
                                            placeholder="Enter your domain name (e.g. example.com)"
                                            className="w-full px-6 py-4 rounded-xl border border-gray-200 focus:border-[#EB4724] focus:ring-2 focus:ring-[#EB4724]/10 focus:outline-none transition-all text-lg"
                                        />
                                        <MagnifyingGlassIcon className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
                                    </div>
                                    <button className="bg-[#651313] text-white px-8 py-4 rounded-xl font-bold hover:bg-[#4d0e0e] transition-colors flex items-center justify-center gap-2 shadow-lg hover:shadow-xl active:scale-95 duration-200">
                                        <MagnifyingGlassIcon className="w-5 h-5" />
                                        Search
                                    </button>
                                </div>
                                <div className="flex flex-wrap justify-center gap-4 text-sm font-medium text-gray-500">
                                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500"></span>.com $9.99</span>
                                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500"></span>.net $8.99</span>
                                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-purple-500"></span>.org $11.99</span>
                                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-orange-500"></span>.so $29.99</span>
                                </div>
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
