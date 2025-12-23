"use client";

import Image from "next/image";

const awards = [
    {
        image: "/home-images/a-1.png",
        title: "SOMALI BUSINESS AWARDS",
    },
    {
        image: "/home-images/a-2.png",
        title: "SOUTHWEST STATE AWARDS",
    },
    {
        image: "/home-images/a-3.png",
        title: "INCISION SOMALIA",
    },
    {
        image: "/home-images/a-4.png",
        title: "ABRAR UNIVERSITY",
    },
    {
        image: "/home-images/a-5.png",
        title: "SAMALE INSTITUTE",
    },
    {
        image: "/home-images/a-6.png",
        title: "SOMNOG FOUR",
    },
];

export default function AwardsSection() {
    return (
        <section className="bg-white py-20 px-4">
            <div className="mx-auto max-w-7xl">
                <h2 className="text-3xl md:text-4xl font-bold text-[#651313] text-center mb-16 italic">
                    Awards
                </h2>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-8 max-w-4xl mx-auto">
                    {awards.map((award, index) => (
                        <div
                            key={index}
                            className="flex flex-col items-center justify-center transition-transform hover:scale-105 duration-300"
                        >
                            <div className="relative w-full aspect-square max-w-[220px]">
                                <Image
                                    src={award.image}
                                    alt="Award Trophy"
                                    fill
                                    className="object-contain"
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
