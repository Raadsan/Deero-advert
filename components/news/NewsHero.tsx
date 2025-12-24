"use client";

export default function NewsHero() {
    return (
        <section className="relative w-full bg-gradient-to-r from-[#4d0e0e] via-[#651313] to-[#EB4724] py-16 lg:py-20 px-4 overflow-hidden">
            {/* Subtle watermark row */}
            <div className="absolute inset-0 opacity-10 pointer-events-none select-none">
                <div className="max-w-6xl mx-auto h-full flex items-center justify-between">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div
                            key={i}
                            className="w-20 h-20 md:w-24 md:h-24 rounded-full border border-white/20"
                        />
                    ))}
                </div>
            </div>

            <div className="relative z-10 max-w-6xl mx-auto flex flex-col gap-4">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white">
                    News & Updates
                </h1>
                <p className="text-white/90 max-w-2xl text-sm md:text-base">
                    Stay up to date with Deero Advert – latest campaigns, brand launches,
                    industry insights and stories from our creative team.
                </p>
            </div>
        </section>
    );
}


