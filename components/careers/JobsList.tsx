"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Briefcase, MapPin, Calendar } from "lucide-react";
import { getActiveCareers, Career } from "../../api/careerApi";

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

export default function JobsList() {
    const [jobs, setJobs] = useState<Career[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const res = await getActiveCareers();
                if (res.data.success) {
                    setJobs(res.data.data);
                }
            } catch (error) {
                console.error("Failed to fetch careers:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            day: "numeric",
            month: "short",
            year: "numeric",
        });
    };

    return (
        <section className="bg-[#f8f9fa] py-16 px-4 sm:px-10">
            <div className="max-w-6xl mx-auto space-y-10">
                {/* Loading State */}
                {loading ? (
                    <div className="space-y-6">
                        {[1, 2, 3].map((i) => (
                            <div
                                key={i}
                                className="bg-white rounded-2xl shadow-sm p-6 animate-pulse"
                            >
                                <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
                                <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
                                <div className="h-20 bg-gray-200 rounded mb-4"></div>
                                <div className="h-10 bg-gray-200 rounded w-32"></div>
                            </div>
                        ))}
                    </div>
                ) : jobs.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-20"
                    >
                        <Briefcase className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                        <p className="text-gray-500 text-lg">No open positions at the moment.</p>
                        <p className="text-gray-400 text-sm mt-2">
                            Check back soon or send us your portfolio at{" "}
                            <a href="mailto:info@advert.deero.so" className="text-[#EB4724] font-semibold hover:underline">
                                info@advert.deero.so
                            </a>
                        </p>
                    </motion.div>
                ) : (
                    <AnimatePresence mode="wait">
                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            className="space-y-6"
                        >
                            {jobs.map((job) => (
                                <motion.article
                                    key={job._id}
                                    variants={itemVariants}
                                    className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100 group"
                                >
                                    <div className="p-6 md:p-8">
                                        {/* Job Title */}
                                        <h3 className="text-2xl font-bold text-[#4d0e0e] mb-3 group-hover:text-[#EB4724] transition-colors">
                                            {job.title}
                                        </h3>

                                        {/* Job Meta */}
                                        <div className="flex flex-wrap gap-4 mb-4 text-sm text-gray-600">
                                            <div className="flex items-center gap-1.5">
                                                <Briefcase className="h-4 w-4 text-[#EB4724]" />
                                                <span className="font-medium">{job.type}</span>
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <MapPin className="h-4 w-4 text-[#EB4724]" />
                                                <span>{job.location}</span>
                                            </div>
                                        </div>

                                        {/* Description */}
                                        <p className="text-gray-700 mb-6 leading-relaxed">
                                            {job.description}
                                        </p>

                                        {/* Footer */}
                                        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-gray-100">
                                            <div className="flex items-center gap-2 text-xs text-gray-500">
                                                <Calendar className="h-3.5 w-3.5" />
                                                <span>
                                                    Posted: {formatDate(job.postedDate)} • Expires: {formatDate(job.expireDate)}
                                                </span>
                                            </div>
                                            <a
                                                href="mailto:info@advert.deero.so"
                                                className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#EB4724] text-white font-bold text-sm rounded-full hover:bg-[#651313] transition-all duration-300 shadow-md hover:shadow-lg"
                                            >
                                                Apply Now
                                            </a>
                                        </div>
                                    </div>
                                </motion.article>
                            ))}
                        </motion.div>
                    </AnimatePresence>
                )}
            </div>
        </section>
    );
}
