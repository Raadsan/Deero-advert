"use client";

import Link from "next/link";

const newsItems = [
    {
        category: "Campaign",
        title: "Deero Advert launches integrated digital campaign for leading Somali brand",
        date: "Nov 2025",
        summary:
            "A 360° campaign across social, outdoor and motion graphics that boosted engagement and brand awareness across Mogadishu.",
    },
    {
        category: "Insight",
        title: "5 creative trends shaping digital advertising in Somalia",
        date: "Oct 2025",
        summary:
            "From short-form video to localized storytelling – how brands can stay relevant and connect with young audiences.",
    },
    {
        category: "Update",
        title: "Deero Advert expands creative team and opens new studio space",
        date: "Sep 2025",
        summary:
            "Stronger motion graphics, content creation and web teams to support growing demand from businesses and organizations.",
    },
];

export default function NewsList() {
    return (
        <section className="bg-[#f2f2f2] py-16 px-4 sm:px-10">
            <div className="max-w-6xl mx-auto space-y-10">
                <div className="space-y-2">
                    <h2 className="text-2xl md:text-3xl font-bold text-[#4d0e0e]">
                        Latest from Deero Advert
                    </h2>
                    <p className="text-sm md:text-base text-[#651313]/80">
                        Stories, case studies and announcements from our creative studio.
                    </p>
                </div>

                <div className="grid gap-6 md:gap-8 md:grid-cols-3">
                    {newsItems.map((item) => (
                        <article
                            key={item.title}
                            className="bg-white rounded-2xl shadow-sm border border-[#f4c6aa] px-6 py-6 flex flex-col h-full"
                        >
                            <span className="inline-block text-xs font-semibold uppercase tracking-wide text-[#EB4724] mb-2">
                                {item.category}
                            </span>
                            <h3 className="text-lg md:text-xl font-bold text-[#4d0e0e] mb-3">
                                {item.title}
                            </h3>
                            <p className="text-xs text-[#651313]/70 mb-4">{item.date}</p>
                            <p className="text-sm text-[#4d0e0e]/80 flex-1">{item.summary}</p>
                            <Link
                                href="#"
                                className="mt-4 inline-flex items-center text-sm font-semibold text-[#EB4724] hover:underline"
                            >
                                Read more
                            </Link>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}


