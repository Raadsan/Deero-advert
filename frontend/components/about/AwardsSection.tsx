"use client";

import Image from "next/image";
import { motion } from "framer-motion";

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
        <section className="bg-white py-16 md:py-24 px-4">
            <div className="mx-auto max-w-7xl">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#651313] text-center mb-12 md:mb-20 italic">
                    Awards 
                </h2>
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                    variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.12 } } }}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12 max-w-6xl mx-auto"
                >
                    {awards.map((award, index) => (
                        <motion.div
                            key={index}
                            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } }}
                            whileHover={{ scale: 1.03 }}
                            className="group flex flex-col items-center justify-center transition-all duration-300"
                        >
                            {/* Fixed size image container */}
                            <div className="relative w-full h-[220px] sm:h-[250px] md:h-[280px] lg:h-[320px] mb-6">
                                <Image
                                    src={award.image}
                                    alt={award.title}
                                    fill
                                    sizes="(max-width: 640px) 280px, (max-width: 768px) 320px, (max-width: 1024px) 360px, 400px"
                                    className="object-contain transition-transform duration-500 group-hover:scale-110"
                                    priority={index < 3}
                                />

                                {/* Hover overlay effect */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg" />
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
                
                {/* Optional: Carousel navigation for mobile */}
                <div className="flex justify-center items-center mt-12 md:hidden">
                    <div className="flex space-x-2">
                        {awards.map((_, index) => (
                            <div 
                                key={index}
                                className="w-2 h-2 rounded-full bg-gray-300"
                            />
                        ))}
                    </div>
                </div>

            </div>
        </section>
    );
}
