"use client";

import { useEffect, useState } from "react";
import NextImage from "next/image";
import { StarIcon } from "@heroicons/react/24/solid";
import { motion } from "framer-motion";
import { getTestimonials, Testimonial } from "../../api/testimonialApi";

const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") || "http://localhost:5000";

const ratings = [
    {
        platform: "Google",
        logo: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg",
        rating: "5/5",
        stars: 5,
    },
    {
        platform: "facebook",
        logo: "https://www.vectorlogo.zone/logos/facebook/facebook-official.svg",
        rating: "5/5",
        stars: 5,
    },
];



const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.6 } },
};

export default function TestimonialsSection() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [dynamicTestimonials, setDynamicTestimonials] = useState<Testimonial[]>([]);
    const [loading, setLoading] = useState(true);
    const visibleCount = 3;

    useEffect(() => {
        const fetch = async () => {
            try {
                const data = await getTestimonials();
                if (data && data.length > 0) {
                    setDynamicTestimonials(data);
                }
            } catch (err) {
                console.error("Failed to fetch testimonials", err);
            } finally {
                setLoading(false);
            }
        };
        fetch();

        // Poll for new testimonials every 60 seconds
        const pollInterval = setInterval(fetch, 60000);
        return () => clearInterval(pollInterval);
    }, []);

    const testimonialsToDisplay = dynamicTestimonials;

    useEffect(() => {
        if (testimonialsToDisplay.length <= visibleCount) {
            setCurrentIndex(0);
            return;
        }

        const total = testimonialsToDisplay.length - visibleCount + 1;
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % total);
        }, 5000);
        return () => clearInterval(interval);
    }, [testimonialsToDisplay]);

    return (
        <>
            {/* Top Ratings Bar Section - White Background */}
            <section className="bg-white py-12 px-4 sm:px-10 overflow-hidden relative border-b border-gray-100">
                <div className="mx-auto max-w-6xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {ratings.map((item, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: index === 0 ? -50 : 50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.6 }}
                                viewport={{ once: true }}
                                whileHover={{ scale: 1.02 }}
                                className="bg-white border border-gray-100 rounded-2xl p-8 flex items-center justify-between shadow-sm hover:shadow-lg transition-all duration-300 group"
                            >
                                <div className="flex flex-col gap-3">
                                    <div className="h-10 flex items-center">
                                        <span className="text-2xl font-bold text-[#651313] uppercase tracking-tight group-hover:text-[#EB4724] transition-colors duration-300">
                                            {item.platform}
                                        </span>
                                    </div>
                                    <div className="flex gap-1">
                                        {[...Array(item.stars)].map((_, i) => (
                                            <StarIcon key={i} className="w-5 h-5 text-[#EB4724]" />
                                        ))}
                                    </div>
                                </div>
                                <div className="flex flex-col items-end">
                                    <span className="text-4xl font-extrabold text-gray-900">{item.rating}</span>
                                    <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">Average Rating</span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials Content Section - Grey Background */}
            <section className="bg-[#f8f9fa] py-24 px-4 sm:px-10 overflow-hidden min-h-[600px]">
                <div className="mx-auto max-w-7xl">
                    {/* Section Title */}
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.2 }}
                        variants={containerVariants}
                        className="text-center mb-16"
                    >
                        <motion.h2 variants={itemVariants} className="text-3xl md:text-4xl font-bold text-[#651313] mb-4">
                            What Our Clients Say
                        </motion.h2>
                        <motion.div variants={itemVariants} className="w-20 h-1.5 bg-[#EB4724] mx-auto rounded-full"></motion.div>
                    </motion.div>

                    {/* Testimonial Slider */}
                    <div className="relative w-full px-2 py-4">
                        {loading && (
                            <div className="flex justify-center items-center py-20">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#EB4724]"></div>
                            </div>
                        )}

                        {!loading && testimonialsToDisplay.length === 0 && (
                            <div className="text-center py-20 text-gray-500 font-medium">
                                No testimonials found.
                            </div>
                        )}

                        {!loading && testimonialsToDisplay.length > 0 && (
                            <div className="overflow-hidden">
                                <motion.div
                                    initial="hidden"
                                    whileInView="visible"
                                    viewport={{ once: true, amount: 0.1 }}
                                    variants={containerVariants}
                                    className={`flex transition-transform duration-700 ease-in-out ${testimonialsToDisplay.length < visibleCount ? 'justify-center' : ''}`}
                                    style={{
                                        transform: testimonialsToDisplay.length > visibleCount ? `translateX(-${currentIndex * (100 / visibleCount)}%)` : 'none'
                                    }}
                                >
                                    {testimonialsToDisplay.map((item) => (
                                        <motion.div
                                            key={item._id}
                                            variants={itemVariants}
                                            className="flex-shrink-0 w-full md:w-1/3 px-4"
                                        >
                                            <div className="bg-white rounded-3xl p-8 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)] hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.15)] transition-all duration-300 h-full flex flex-col relative border border-gray-50 group">
                                                {/* Quote Icon */}
                                                <div className="absolute top-6 right-8 text-[#EB4724]/10 group-hover:text-[#EB4724]/20 transition-colors duration-300 text-3xl font-serif">
                                                    "
                                                </div>

                                                {/* Rating */}
                                                <div className="flex gap-1 mb-6">
                                                    {[...Array(item.rating || 5)].map((_, i) => (
                                                        <StarIcon key={i} className="w-5 h-5 text-[#EB4724]" />
                                                    ))}
                                                </div>

                                                {/* Text */}
                                                <p className="text-gray-600 text-[15px] leading-relaxed mb-8 flex-grow font-medium italic">
                                                    "{item.message}"
                                                </p>

                                                {/* User Info */}
                                                <div className="mt-auto flex items-center gap-4 pt-6 border-t border-gray-100">
                                                    <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-white shadow-md flex-shrink-0 bg-gray-50">
                                                        <NextImage
                                                            src={item.clientImage ? (item.clientImage.startsWith('http') || item.clientImage.startsWith('/') ? item.clientImage : `${API_URL}/uploads/${item.clientImage}`) : "/home-images/placeholder.png"}
                                                            alt={item.clientName}
                                                            width={56}
                                                            height={56}
                                                            className="w-full h-full object-cover"
                                                            unoptimized // helpful to avoid local next/image path issues for now
                                                        />
                                                    </div>
                                                    <div>
                                                        <h4 className="text-[#EB4724] font-bold text-sm uppercase tracking-wide leading-tight mb-1">
                                                            {item.clientName}
                                                        </h4>
                                                        <p className="text-[#2B5A8E] text-[10px] font-bold uppercase tracking-wider">
                                                            {item.clientTitle}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </motion.div>
                            </div>
                        )}

                        {/* Navigation Dots */}
                        {testimonialsToDisplay.length > visibleCount && (
                            <div className="flex justify-center gap-2 mt-12">
                                {Array.from({ length: testimonialsToDisplay.length - visibleCount + 1 }).map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setCurrentIndex(i)}
                                        className={`h-2 rounded-full transition-all duration-300 ${currentIndex === i ? "w-8 bg-[#EB4724]" : "w-2 bg-gray-300 hover:bg-gray-400"}`}
                                        aria-label={`Go to testimonial group ${i + 1}`}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </>
    );
}
