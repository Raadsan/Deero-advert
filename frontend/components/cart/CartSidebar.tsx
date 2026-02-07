"use client";

import { motion } from "framer-motion";
import {
    ChevronDown,
    Layers,
    PlusCircle,
    RefreshCcw,
    ShoppingCart,
    ChevronRight,
    Monitor
} from "lucide-react";
import { useState } from "react";
import Link from "next/link";

export default function CartSidebar() {
    const [openSection, setOpenSection] = useState<string | null>("categories");

    const toggleSection = (section: string) => {
        setOpenSection(openSection === section ? null : section);
    };

    return (
        <div className="space-y-6">
            {/* Categories Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <button
                    onClick={() => toggleSection("categories")}
                    className="w-full flex items-center justify-between p-5 bg-[#651313] text-white"
                >
                    <div className="flex items-center gap-2 font-bold">
                        <Layers className="w-5 h-5" />
                        Categories
                    </div>
                    <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${openSection === "categories" ? "rotate-180" : ""}`} />
                </button>

                {openSection === "categories" && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        className="p-2"
                    >
                        <Link
                            href="/hosting#plans"
                            className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 text-[#651313] font-medium transition-all group text-sm"
                        >
                            <div className="flex items-center gap-3">
                                <Monitor className="w-4 h-4 text-[#EB4724]" />
                                Deero Web Hosting
                            </div>
                            <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                        </Link>
                    </motion.div>
                )}
            </div>

            {/* Actions Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <button
                    onClick={() => toggleSection("actions")}
                    className="w-full flex items-center justify-between p-5 text-[#651313] hover:bg-gray-50 transition-colors"
                >
                    <div className="flex items-center gap-2 font-black uppercase tracking-widest text-xs">
                        <PlusCircle className="w-5 h-5 text-[#EB4724]" />
                        Actions
                    </div>
                    <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${openSection === "actions" ? "rotate-180" : ""}`} />
                </button>

                {openSection === "actions" && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        className="p-2 space-y-1"
                    >
                        <Link
                            href="/hosting#register"
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[#651313]/5 text-[#651313] text-sm font-bold transition-all"
                        >
                            <RefreshCcw className="w-4 h-4 text-[#EB4724]" />
                            Register a New Domain
                        </Link>
                        <Link
                            href="/hosting#transfer"
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[#651313]/5 text-[#651313] text-sm font-bold transition-all"
                        >
                            <RefreshCcw className="w-4 h-4 text-[#EB4724]" />
                            Transfer in a Domain
                        </Link>
                        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-[#651313]/10 text-[#651313] text-sm font-bold transition-all">
                            <ShoppingCart className="w-4 h-4 text-[#EB4724]" />
                            View Cart
                        </button>
                    </motion.div>
                )}
            </div>
        </div>
    );
}

