"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { StarIcon } from "@heroicons/react/24/solid";
import { motion } from "framer-motion";

const ratings = [
    {
        platform: "Google",
        logo: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg",
        rating: "5/5",
        stars: 5,
    },
    {
        platform: "facebook",
        logo: "https://upload.wikimedia.org/wikipedia/commons/0/05/Facebook_Logo_2023.png",
        rating: "5/5",
        stars: 5,
    },
];

const testimonials = [
    {
        id: 1,
        text: "We owe our business growth to Deero Advert's outstanding web, graphics design, and digital marketing services. Their team's understanding of our needs and industry helped us reach our goals with tailored, effective solutions.",
        name: "ABDIWAHAB A. ELMI",
        role: "Managing Director of Brawa",
        image: "/home-images/t-1.png",
        rating: 5,
    },
    {
        id: 2,
        text: "Deero Advert played a key role in the success of SIMAD University's 20th Anniversary. Their creativity and collaboration significantly boosted the branding and visibility of the event. We truly value their professionalism.",
        name: "Eng. Mohamed Mohamud",
        role: "SIMAD University",
        image: "/home-images/t-2.png",
        rating: 5,
    },
    {
        id: 3,
        text: "I'm deeply impressed by Deero Advert's dedication and results-driven work. Their professionalism, skill, and attention to detail truly exceeded my expectations. It was a pleasure working with such a talented team.",
        name: "ABDIRAHMAN H. DHIBLAWE",
        role: "Director SIMAD Institute",
        image: "/home-images/t-3.png",
        rating: 5,
    },
    {
        id: 4,
        text: "Deero Advert consistently delivers high-quality work and great communication. Their team helped us refine our message and deliver polished creative assets.",
        name: "Hodan A.",
        role: "Marketing Lead",
        image: "/home-images/t-4.png",
        rating: 5,
    },
    {
        id: 5,
        text: "Working with Deero Advert was seamless — creative ideas and measurable results. Highly recommended!",
        name: "Yusuf M.",
        role: "Founder",
        image: "/home-images/t-5.png",
        rating: 5,
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
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export default function TestimonialsSection() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const visibleCount = 3; // number of testimonials visible at once on md+

    useEffect(() => {
        const total = Math.max(1, testimonials.length - visibleCount + 1);
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % total);
        }, 5000); // 5 seconds
        return () => clearInterval(interval);
    }, []);

    return (
        <>
            {/* Top Ratings Bar Section - White Background */}
            <section className="bg-white py-12 px-4 sm:px-10 overflow-hidden relative border-b border-gray-100">
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.5 }}
                    variants={containerVariants}
                    className="mx-auto max-w-6xl"
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {ratings.map((item, index) => (
                            <motion.div
                                key={index}
                                variants={{
                                    hidden: { opacity: 0, x: index === 0 ? -50 : 50 },
                                    visible: { opacity: 1, x: 0, transition: { duration: 0.6 } }
                                }}
                                whileHover={{ scale: 1.02 }}
                                className="bg-white border border-gray-100 rounded-2xl p-8 flex items-center justify-between shadow-sm hover:shadow-lg transition-all duration-300 group"
                            >
                                <div className="flex flex-col gap-3">
                                    <div className="h-10 relative w-32 grayscale group-hover:grayscale-0 transition-all duration-300">
                                        <img src={item.logo} alt={item.platform} className="h-full object-contain object-left" />
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
                </motion.div>
            </section>

            {/* Testimonials Content Section - Grey Background */}
            <section className="bg-[#f8f9fa] py-24 px-4 sm:px-10 overflow-hidden">
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                    variants={containerVariants}
                    className="mx-auto max-w-7xl"
                >
                    {/* Section Title */}
                    <div className="text-center mb-16">
                        <motion.h2 variants={itemVariants} className="text-3xl md:text-4xl font-bold text-[#651313] mb-4">
                            What Our Clients Say
                        </motion.h2>
                        <motion.div variants={itemVariants} className="w-20 h-1.5 bg-[#EB4724] mx-auto rounded-full"></motion.div>
                    </div>

                    {/* Testimonial Slider */}
                    <div className="relative overflow-hidden w-full px-2 py-4">
                        <motion.div
                            variants={containerVariants}
                            className="flex transition-transform duration-700 ease-in-out"
                            style={{ transform: `translateX(-${currentIndex * (100 / visibleCount)}%)` }}
                        >
                            {testimonials.map((item) => (
                                <motion.div
                                    key={item.id}
                                    variants={itemVariants}
                                    className="flex-shrink-0 w-full md:w-1/3 px-4"
                                >
                                    <div className="bg-white rounded-3xl p-8 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)] hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.15)] transition-all duration-300 h-full flex flex-col relative border border-gray-50 group">

                                        {/* Quote Icon */}
                                        <div className="absolute top-6 right-8 text-[#EB4724]/10 group-hover:text-[#EB4724]/20 transition-colors duration-300">
                                            <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M14.017 21L14.017 18C14.017 16.0547 15.3739 14.7919 16.6661 14.1576L16.5161 14.1204C16.8961 14.0254 17.5144 13.8706 17.5144 12.9248V10.2977H14.017V6H19V12.9248C19 18.068 15.3614 20.3129 14.017 21ZM5 21L5 18C5 16.0547 6.35695 14.7919 7.64917 14.1576L7.49914 14.1204C7.87914 14.0254 8.49751 13.8706 8.49751 12.9248V10.2977H5V6H9.98299V12.9248C9.98299 18.068 6.34437 20.3129 5 21Z" />
                                            </svg>
                                        </div>

                                        {/* Rating */}
                                        <div className="flex gap-1 mb-6">
                                            {[...Array(item.rating)].map((_, i) => (
                                                <StarIcon key={i} className="w-5 h-5 text-[#EB4724]" />
                                            ))}
                                        </div>

                                        {/* Text */}
                                        <p className="text-gray-600 text-[15px] leading-relaxed mb-8 flex-grow font-medium">
                                            "{item.text}"
                                        </p>

                                        {/* User Info */}
                                        <div className="mt-auto flex items-center gap-4 pt-6 border-t border-gray-100">
                                            <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-white shadow-md flex-shrink-0">
                                                <Image
                                                    src={item.image}
                                                    alt={item.name}
                                                    width={56}
                                                    height={56}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div>
                                                <h4 className="text-[#651313] font-bold text-sm uppercase tracking-wide leading-tight mb-1">
                                                    {item.name}
                                                </h4>
                                                <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider">
                                                    {item.role}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>

                        {/* Navigation Dots */}
                        <div className="flex justify-center gap-2 mt-12">
                            {Array.from({ length: Math.max(1, testimonials.length - visibleCount + 1) }).map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setCurrentIndex(i)}
                                    className={`h-2 rounded-full transition-all duration-300 ${currentIndex === i ? "w-8 bg-[#EB4724]" : "w-2 bg-gray-300 hover:bg-gray-400"}`}
                                    aria-label={`Go to testimonial group ${i + 1}`}
                                />
                            ))}
                        </div>
                    </div>
                </motion.div>
            </section>
        </>
    );
}
