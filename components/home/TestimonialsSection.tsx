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
    },
    {
        id: 2,
        text: "Deero Advert played a key role in the success of SIMAD University's 20th Anniversary. Their creativity and collaboration significantly boosted the branding and visibility of the event. We truly value their professionalism.",
        name: "Eng. Mohamed Mohamud",
        role: "SIMAD University",
        image: "/home-images/t-2.png",
    },
    {
        id: 3,
        text: "I'm deeply impressed by Deero Advert's dedication and results-driven work. Their professionalism, skill, and attention to detail truly exceeded my expectations. It was a pleasure working with such a talented team.",
        name: "ABDIRAHMAN H. DHIBLAWE",
        role: "Director SIMAD Institute",
        image: "/home-images/t-3.png",
    },
    {
        id: 4,
        text: "Deero Advert consistently delivers high-quality work and great communication. Their team helped us refine our message and deliver polished creative assets.",
        name: "Hodan A.",
        role: "Marketing Lead",
        image: "/home-images/t-4.png",
    },
    {
        id: 5,
        text: "Working with Deero Advert was seamless — creative ideas and measurable results. Highly recommended!",
        name: "Yusuf M.",
        role: "Founder",
        image: "/home-images/t-5.png",
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
        }, 4000);
        return () => clearInterval(interval);
    }, []);
    return (
        <>
            {/* Top Ratings Bar Section - White Background */}
            <section className="bg-white py-12 px-4 sm:px-10 overflow-hidden">
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
                                className="bg-[#f0e9e7] rounded-xl p-10 flex items-center justify-between shadow-sm hover:shadow-md transition-all duration-300"
                            >
                                <div className="flex flex-col gap-3">
                                    <div className="h-10 relative w-32">
                                        <img src={item.logo} alt={item.platform} className="h-full object-contain object-left" />
                                    </div>
                                    <div className="flex gap-1">
                                        {[...Array(item.stars)].map((_, i) => (
                                            <StarIcon key={i} className="w-6 h-6 text-orange-400" />
                                        ))}
                                    </div>
                                </div>
                                <div className="text-4xl font-bold text-[#651313]">{item.rating}</div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </section>

            {/* Testimonials Content Section - Grey Background */}
            <section className="bg-[#f8f8f8] py-20 px-4 sm:px-10 overflow-hidden">
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                    variants={containerVariants}
                    className="mx-auto max-w-6xl"
                >
                    {/* Section Title */}
                    <motion.h2 variants={itemVariants} className="text-3xl font-bold text-[#651313] text-center mb-16">Testimonials</motion.h2>

                    {/* Testimonial Slider */}
                    <div className="relative overflow-hidden w-full">
                        <motion.div variants={containerVariants} className="flex transition-transform duration-700 ease-in-out"
                            style={{ transform: `translateX(-${currentIndex * (100 / visibleCount)}%)` }}>
                            {testimonials.map((item) => (
                                <motion.div
                                    key={item.id}
                                    variants={itemVariants}
                                    whileHover={{ y: -8 }}
                                    className="flex-shrink-0 w-full md:w-1/3 px-3"
                                >
                                    <div className="p-8 md:p-12 flex flex-col items-center text-center bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 h-full">
                                        <p className="text-gray-500 text-[13px] leading-relaxed mb-8 italic">
                                            "{item.text}"
                                        </p>

                                        <div className="mt-auto flex flex-col items-center">
                                            <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-[#EB4724] mb-4">
                                                <Image
                                                    src={item.image}
                                                    alt={item.name}
                                                    width={56}
                                                    height={56}
                                                    className="object-cover"
                                                />
                                            </div>
                                            <h4 className="text-[#651313] font-bold text-sm uppercase tracking-wide mb-1">{item.name}</h4>
                                            <p className="text-gray-400 text-[10px] font-medium uppercase">{item.role}</p>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>

                        {/* Navigation Dots */}
                        <div className="flex justify-center gap-2 mt-6">
                            {Array.from({ length: Math.max(1, testimonials.length - visibleCount + 1) }).map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setCurrentIndex(i)}
                                    className={`h-1.5 rounded-full transition-all duration-300 ${currentIndex === i ? "w-6 bg-[#EB4724]" : "w-1.5 bg-gray-300"}`}
                                    aria-label={`Go to testimonial ${i + 1}`}
                                />
                            ))}
                        </div>
                    </div>
                </motion.div>
            </section>
        </>
    );
}
