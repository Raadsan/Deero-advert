"use client";

export default function CareerHero() {
    return (
        <section className="relative w-full bg-gradient-to-r from-[#4d0e0e] via-[#651313] to-[#EB4724] py-16 lg:py-20 px-4 overflow-hidden">
            <div className="absolute inset-0 opacity-10 pointer-events-none select-none">
                <div className="max-w-6xl mx-auto h-full flex items-center justify-between">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <div
                            key={i}
                            className="w-24 h-24 md:w-28 md:h-28 rounded-full border border-white/25"
                        />
                    ))}
                </div>
            </div>

            <div className="relative z-10 max-w-6xl mx-auto space-y-4">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white">
                    Career at Deero Advert
                </h1>
                <p className="text-white/90 max-w-2xl text-sm md:text-base">
                    Join a collaborative team of designers, strategists and storytellers
                    helping brands grow with bold digital experiences.
                </p>
            </div>
        </section>
    );
}


