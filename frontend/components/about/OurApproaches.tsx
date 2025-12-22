"use client";

import Image from "next/image";

const approaches = [
    { title: "Listen", icon: "/home-images/d-1.svg" },
    { title: "Present", icon: "/home-images/d-2.svg" },
    { title: "Develop", icon: "/home-images/d-3.svg" },
    { title: "Feedback", icon: "/home-images/d-4.svg" },
    { title: "Deliver", icon: "/home-images/d-5.svg" },
];

export default function OurApproaches() {
    return (
        <section className="bg-white py-20 px-4">
            <div className="mx-auto max-w-7xl">
                <h2 className="text-3xl md:text-4xl font-bold text-[#651313] text-center mb-16 italic">
                    Our Approaches
                </h2>

                <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12 lg:gap-16">
                    {approaches.map((item, index) => (
                        <div key={index} className="flex flex-col items-center space-y-4">
                            {/* Icon Container with specific branding shape */}
                            <div className="relative w-24 h-24 md:w-32 md:h-32 transition hover:scale-110 duration-300">
                                <Image
                                    src={item.icon}
                                    alt={item.title}
                                    fill
                                    className="object-contain"
                                />
                            </div>
                            <span className="text-[#651313] font-semibold text-lg md:text-xl">
                                {item.title}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
