"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import ServiceCard from "./ServiceCard";

const services = [
    { name: "Graphic\nDesign", icon: "/home-images/d-1.svg" },
    { name: "Digital\nMarketing", icon: "/home-images/d-2.svg" },
    { name: "Web Solutions", icon: "/home-images/d-3.svg" },
    { name: "Motion\nGraphics", icon: "/home-images/d-4.svg" },
    { name: "Event\nBranding", icon: "/home-images/d-5.svg" },
    { name: "Digital\nConsulting", icon: "/home-images/d-6.svg" },
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
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

interface ServicesContentProps {
    showTitle?: boolean;
    showViewMore?: boolean;
    paddingClasses?: string;
}

export default function ServicesContent({
    showTitle = true,
    showViewMore = false,
    paddingClasses = "py-16 px-4 sm:px-10"
}: ServicesContentProps) {
    return (
        <section className={`bg-[#f2f2f2] overflow-hidden ${paddingClasses}`}>
            <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                variants={containerVariants}
                className="mx-auto max-w-6xl text-center space-y-12"
            >
                {showTitle && (
                    <motion.h2 variants={itemVariants} className="text-4xl font-bold text-[#651313]">
                        Our Services
                    </motion.h2>
                )}

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-y-12 gap-x-8">
                    {services.map((service, index) => (
                        <ServiceCard
                            key={index}
                            name={service.name}
                            icon={service.icon}
                            index={index}
                            itemVariants={itemVariants}
                        />
                    ))}
                </div>

                {showViewMore && (
                    <motion.div variants={itemVariants} className="flex justify-center pt-8">
                        <Link
                            href="/services"
                            className="bg-[#651313] text-white px-8 py-3 rounded-full font-bold text-lg uppercase tracking-wide hover:bg-[#EB4724] hover:scale-105 active:scale-95 transition-all shadow-lg"
                        >
                            VIEW MORE
                        </Link>
                    </motion.div>
                )}
            </motion.div>
        </section>
    );
}
