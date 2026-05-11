"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { getAllCaseStudies } from "@/api-client/caseStudyApi";
import { getImageUrl } from "@/utils/url";

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export default function CaseStudyList() {
    const [caseStudies, setCaseStudies] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCaseStudies = async () => {
            try {
                const res = await getAllCaseStudies();
                const data = Array.isArray(res.data) ? res.data : (res.data?.data || []);
                setCaseStudies(data);
            } catch (err) {
                console.error("Failed to fetch case studies", err);
            } finally {
                setLoading(false);
            }
        };
        fetchCaseStudies();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center py-20">
                <div className="animate-pulse text-gray-400 font-bold">Loading case studies...</div>
            </div>
        );
    }

    if (caseStudies.length === 0) {
        return (
            <div className="text-center py-20">
                <p className="text-gray-500 font-medium">No case studies found.</p>
            </div>
        );
    }

    return (
        <section className="bg-[#fce5d8]/30 py-20 px-4 sm:px-10">
            <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.1 }}
                variants={containerVariants}
                className="mx-auto max-w-6xl xl:max-w-7xl"
            >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {caseStudies.map((cs, idx) => (
                        <motion.div
                            key={cs.id || cs._id}
                            variants={itemVariants}
                            className="h-full"
                        >
                            <Link 
                                href={`/casestudy/${cs.id || cs._id}`}
                                className="bg-white rounded-xl overflow-hidden shadow-lg flex flex-col group transition-all duration-300 transform hover:-translate-y-2 h-full min-h-[500px]"
                            >
                                {/* Top Card Area with Image */}
                                <div className={`${['bg-[#EB4724]', 'bg-[#4d0e0e]', 'bg-[#9b7677]'][idx % 3]} h-48 relative overflow-hidden flex-shrink-0`}>
                                    <Image
                                        src={getImageUrl(cs.image) || ""}
                                        alt={cs.title}
                                        fill
                                        unoptimized
                                        className="object-cover brightness-110 contrast-125 transition-transform duration-500 group-hover:scale-110"
                                    />
                                </div>

                                {/* Content Area */}
                                <div className="p-6 pt-8 flex-1 flex flex-col text-left">
                                    <div className="flex items-center gap-2 mb-3">
                                        <span className="bg-[#EB4724]/10 text-[#EB4724] text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                                            {cs.category}
                                        </span>
                                        <span className="text-gray-400 text-xs font-medium">
                                            {cs.client}
                                        </span>
                                    </div>
                                    
                                    <h3 className="text-2xl font-bold text-[#651313] mb-4 min-h-[56px] flex items-center justify-start leading-tight line-clamp-2 group-hover:text-[#EB4724] transition-colors">
                                        {cs.title}
                                    </h3>
                                    
                                    <div className="text-gray-600 text-sm mb-6 flex-1 line-clamp-3 overflow-hidden leading-relaxed">
                                        <span className="font-bold text-[#EB4724]">Challenge: </span>
                                        {cs.challenge}
                                    </div>

                                    <div className="flex items-center gap-2 text-[#EB4724] font-bold text-sm mb-6 border-t border-gray-50 pt-6">
                                        View Case Study
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </div>

                                    <div className="mt-auto pt-4 flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-gray-400">
                                        <span>
                                            {cs.publishedDate ? new Date(cs.publishedDate).toLocaleDateString() : 'Recent'}
                                        </span>
                                        <span className="text-[#651313]/40">
                                            {cs.author}
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </section>
    );
}
