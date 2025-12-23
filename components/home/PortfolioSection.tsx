"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

const portfolioItems = [
    {
        id: 1,
        image: "/home-images/p-1.png",
        title: "Graphic Design & Branding",
        count: "539+",
        label: "Branding",
    },
    {
        id: 2,
        image: "/home-images/p-2.png",
        title: "Event Branding",
        count: "10+",
        label: "Event",
    },
    {
        id: 3,
        image: "/home-images/p-3.png",
        title: "Digital Marketing",
        count: "237+",
        label: "Social",
    },
    {
        id: 4,
        image: "/home-images/p-4.png",
        title: "Web Solutions",
        count: "37+",
        label: "Website",
    },
    {
        id: 5,
        image: "/home-images/p-5.png",
        title: "Motion Graphics",
        count: "259+",
        label: "Motion",
    },
    {
        id: 6,
        image: "/home-images/p-6.png",
        title: "Digital Consulting",
        count: "155+",
        label: "Digital",
    },
];

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
    hidden: { opacity: 0, scale: 0.9, y: 30 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.5 } },
};

export default function PortfolioSection() {
    return (
        <section className="bg-[#fcd7c3] py-20 px-4 sm:px-10">
            <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.1 }}
                variants={containerVariants}
                className="mx-auto max-w-6xl"
            >
                {/* Header Area */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
                    <motion.div variants={itemVariants}>
                        <h2 className="text-4xl font-bold text-[#651313] mb-4">Our Portfolios</h2>
                        <p className="text-[#651313] max-w-md">
                            Our portfolios speaks for itself, <br />
                            Check out all project and see for yourself!
                        </p>
                    </motion.div>
                    <motion.div variants={itemVariants}>
                        <Link
                            href="https://www.behance.net/deeroadvert"
                            target="_blank"
                            className="bg-[#EB4724] text-white px-10 py-3 rounded-full font-bold hover:bg-[#d13d1d] hover:scale-105 active:scale-95 transition-all uppercase tracking-wider text-sm shadow-md inline-block"
                        >
                            View More
                        </Link>
                    </motion.div>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {portfolioItems.map((item) => (
                        <motion.div
                            key={item.id}
                            variants={itemVariants}
                            whileHover={{ y: -8 }}
                            className="group relative bg-white rounded-xl overflow-hidden shadow-lg transition-all duration-300"
                        >
                            {/* Image Container */}
                            <div className="relative aspect-[4/3] overflow-hidden">
                                <Image
                                    src={item.image}
                                    alt={item.title}
                                    fill
                                    className="object-cover transition duration-500 group-hover:scale-110"
                                />
                                {/* Overlay / Decorative Ring Badge */}
                                <div className="absolute inset-0 flex items-center justify-center p-4">
                                    <div className="relative w-24 h-24 flex items-center justify-center">
                                        {/* Outer Ring */}
                                        <div className="absolute inset-0 border-2 border-[#EB4724] rounded-full"></div>
                                        {/* Inner Circle */}
                                        <div className="w-20 h-20 bg-[#651313]/90 rounded-full flex flex-col items-center justify-center text-white p-2">
                                            <span className="text-xs font-bold leading-tight">{item.count}</span>
                                            <span className="text-[10px] uppercase tracking-tighter opacity-80">{item.label}</span>
                                        </div>
                                        {/* Connecting Dots (Decorative) */}
                                        <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#EB4724] rounded-full"></div>
                                        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#EB4724] rounded-full"></div>
                                    </div>
                                </div>
                            </div>

                            {/* Title/Footer */}
                            <div className="p-6 text-center border-t border-gray-100">
                                <h3 className="text-[#EB4724] font-bold text-lg">{item.title}</h3>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </section>
    );
}
