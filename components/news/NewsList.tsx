"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, ArrowRight } from "lucide-react";
import { getAllEventsNews } from "../../api/eventsNewsApi";

type EventNewsItem = {
    _id: string;
    title: string;
    type: "event" | "news";
    date: string;
    description?: string;
    isPublished: boolean;
    createdAt: string;
};

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

const NewsCard = ({ item, formatDate }: { item: EventNewsItem; formatDate: (d: string) => string }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <motion.article
            key={item._id}
            variants={itemVariants}
            whileHover={{ y: -8, transition: { duration: 0.3 } }}
            className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col h-full border border-gray-100 group"
        >
            {/* Type Badge */}
            <div className="p-6 pb-4">
                <span
                    className={`inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide shadow-sm transition-all duration-300 ${item.type === "event"
                        ? "bg-blue-100 text-blue-700 border border-blue-200 group-hover:bg-blue-600 group-hover:text-white"
                        : "bg-green-100 text-green-700 border border-green-200 group-hover:bg-green-600 group-hover:text-white"
                        }`}
                >
                    {item.type}
                </span>
            </div>

            {/* Content */}
            <div className="px-6 pb-6 flex flex-col flex-1">
                {/* Date */}
                <div className="flex items-center gap-2 text-xs text-gray-500 font-medium mb-4 group-hover:text-[#EB4724] transition-colors">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>{formatDate(item.date)}</span>
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-[#4d0e0e] mb-2 line-clamp-2 leading-tight group-hover:text-[#EB4724] transition-colors">
                    {item.title}
                </h3>

                {/* Description */}
                {item.description && (
                    <p className={`text-sm text-gray-600 leading-relaxed mb-4 break-words transition-all duration-300 ${isExpanded ? "" : "line-clamp-1"}`}>
                        {item.description}
                    </p>
                )}

                {/* Read More Link */}
                <div className="mt-auto pt-6 border-t border-gray-100">
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="inline-flex items-center gap-2 text-sm font-bold text-[#EB4724] group-hover:gap-3 transition-all duration-300"
                    >
                        {isExpanded ? "Read Less" : "Read More"}
                        <ArrowRight className={`w-4 h-4 transition-transform duration-300 ${isExpanded ? "-rotate-90" : ""}`} />
                    </button>
                </div>
            </div>
        </motion.article>
    );
};

export default function NewsList() {
    const [items, setItems] = useState<EventNewsItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<"all" | "event" | "news">("all");

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const res = await getAllEventsNews();
                if (res.data.success) {
                    setItems(res.data.data);
                }
            } catch (error) {
                console.error("Failed to fetch events & news:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const filteredItems = items.filter((item) => {
        if (filter === "all") return true;
        return item.type === filter;
    });

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    };

    return (
        <section className="bg-[#f8f9fa] py-16 px-4 sm:px-10">
            <div className="max-w-6xl mx-auto space-y-10">
                {/* Header with Filter Tabs */}
                <div className="space-y-6">
                    <div className="space-y-3 text-center md:text-left">
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="text-3xl md:text-4xl font-bold text-[#4d0e0e]"
                        >
                            Latest from Deero Advert
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            className="text-sm md:text-base text-gray-600 max-w-2xl"
                        >
                            Stories, events, and announcements from our creative studio.
                        </motion.p>
                    </div>

                    {/* Filter Tabs */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="flex gap-2 flex-wrap"
                    >
                        {[
                            { value: "all", label: "All" },
                            { value: "event", label: "Events" },
                            { value: "news", label: "News" },
                        ].map((tab) => (
                            <button
                                key={tab.value}
                                onClick={() => setFilter(tab.value as typeof filter)}
                                className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${filter === tab.value
                                    ? "bg-[#651313] text-white shadow-lg scale-105"
                                    : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
                                    }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </motion.div>
                </div>

                {/* Loading State */}
                {loading ? (
                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                        {[1, 2, 3].map((i) => (
                            <div
                                key={i}
                                className="bg-white rounded-2xl shadow-sm overflow-hidden animate-pulse"
                            >
                                <div className="h-48 bg-gray-200"></div>
                                <div className="p-6 space-y-3">
                                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                                    <div className="h-20 bg-gray-200 rounded"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : filteredItems.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-20"
                    >
                        <Calendar className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                        <p className="text-gray-500 text-lg">No {filter !== "all" ? filter + "s" : "items"} found.</p>
                    </motion.div>
                ) : (
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={filter}
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            exit="hidden"
                            className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
                        >
                            {filteredItems.map((item) => (
                                <NewsCard key={item._id} item={item} formatDate={formatDate} />
                            ))}
                        </motion.div>
                    </AnimatePresence>
                )}
            </div>
        </section>
    );
}
