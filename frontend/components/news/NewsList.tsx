"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRightIcon } from "@heroicons/react/24/outline";

const newsItems = [
    {
        category: "Campaign",
        title: "Deero Advert launches integrated digital campaign for leading Somali brand",
        date: "Nov 2025",
        summary:
            "A 360° campaign across social, outdoor and motion graphics that boosted engagement and brand awareness across Mogadishu.",
        image: "/home-images/blog1.png",
    },
    {
        category: "Insight",
        title: "5 creative trends shaping digital advertising in Somalia",
        date: "Oct 2025",
        summary:
            "From short-form video to localized storytelling – how brands can stay relevant and connect with young audiences.",
        image: "/home-images/blog2.png",
    },
    {
        category: "Update",
        title: "Deero Advert expands creative team and opens new studio space",
        date: "Sep 2025",
        summary:
            "Stronger motion graphics, content creation and web teams to support growing demand from businesses and organizations.",
        image: "/home-images/blog3.png",
    },
];

export default function NewsList() {
    return (
        <section className="bg-[#f8f9fa] py-16 px-4 sm:px-10">
            <div className="max-w-6xl mx-auto space-y-10">
                <div className="space-y-3 text-center md:text-left">
                    <h2 className="text-3xl md:text-4xl font-bold text-[#4d0e0e]">
                        Latest from Deero Advert
                    </h2>
                    <p className="text-sm md:text-base text-gray-600 max-w-2xl">
                        Stories, case studies and announcements from our creative studio.
                    </p>
                </div>

                <div className="grid gap-8 md:grid-cols-3">
                    {newsItems.map((item) => (
                        <article
                            key={item.title}
                            className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col h-full border border-gray-100 group"
                        >
                            {/* Image Container */}
                            <div className="relative h-56 w-full overflow-hidden">
                                <Image
                                    src={item.image}
                                    alt={item.title}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute top-4 left-4">
                                    <span className="inline-block px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-bold uppercase tracking-wide text-[#EB4724] shadow-sm">
                                        {item.category}
                                    </span>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-6 flex flex-col flex-1">
                                <div className="flex items-center gap-2 text-xs text-gray-400 font-medium mb-3">
                                    <span>{item.date}</span>
                                    <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                                    <span>5 min read</span>
                                </div>

                                <h3 className="text-lg md:text-xl font-bold text-[#4d0e0e] mb-3 line-clamp-2 leading-tight group-hover:text-[#EB4724] transition-colors">
                                    {item.title}
                                </h3>

                                <p className="text-sm text-gray-600 mb-6 line-clamp-3 leading-relaxed">
                                    {item.summary}
                                </p>

                                <div className="mt-auto pt-6 border-t border-gray-50 flex items-center justify-between">
                                    <Link
                                        href="#"
                                        className="inline-flex items-center gap-2 text-sm font-bold text-[#EB4724] hover:gap-3 transition-all duration-300 group/link"
                                    >
                                        Read Article
                                        <ArrowRightIcon className="w-4 h-4" />
                                    </Link>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}
