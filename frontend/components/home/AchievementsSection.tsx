"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, animate, useInView } from "framer-motion";
import { getAllAchievements, Achievement } from "../../api/achievementApi";

function Counter({ value, duration = 2 }: { value: number; duration?: number }) {
    const [count, setCount] = useState(0);
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.1 });

    useEffect(() => {
        if (isInView) {
            const controls = animate(0, value, {
                duration,
                onUpdate: (latest) => setCount(Math.floor(latest)),
                ease: "easeOut",
            });
            return () => controls.stop();
        }
    }, [isInView, value, duration]);

    return <span ref={ref}>{count.toLocaleString()}</span>;
}

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

export default function AchievementsSection() {
    const [dynamicAchievements, setDynamicAchievements] = useState<Achievement[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);
    const visibleCount = 4;

    const clients = Array.from({ length: 14 }, (_, i) => {
        const num = i + 1;
        const extension = num === 13 ? "jpg" : "png";
        return {
            id: num,
            image: `/home-images/${num}.${extension}`,
        };
    });

    const totalClients = clients.length;

    useEffect(() => {
        const fetchAchievements = async () => {
            try {
                const response = await getAllAchievements();
                if (response.data.success) {
                    setDynamicAchievements(response.data.data);
                }
            } catch (error) {
                console.error("Failed to fetch achievements:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAchievements();
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % (totalClients - visibleCount + 1));
        }, 3000);
        return () => clearInterval(interval);
    }, [totalClients]);

    return (
        <section className="overflow-hidden">
            {/* Achievements Part - Peach Background */}
            <div className=" py-20 px-4 sm:px-10">
                <div className="mx-auto max-w-6xl">
                    <div className="text-center">
                        <motion.h2
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, amount: 0.1 }}
                            variants={itemVariants}
                            className="text-2xl font-bold text-[#651313] mb-16 uppercase tracking-wider"
                        >
                            Our Achievements
                        </motion.h2>

                        {loading ? (
                            <div className="flex justify-center items-center py-10">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#EB4724]"></div>
                            </div>
                        ) : dynamicAchievements.length > 0 ? (
                            <motion.div
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true, amount: 0.1 }}
                                variants={containerVariants}
                                className="grid grid-cols-2 md:grid-cols-4 gap-12"
                            >
                                {dynamicAchievements.map((item) => {
                                    return (
                                        <motion.div key={item._id} variants={itemVariants} className="flex flex-col items-center group">
                                            <div className="relative w-28 h-28 flex items-center justify-center mb-6">
                                                <div className="absolute inset-0 border-2 border-[#EB4724] rounded-full group-hover:scale-110 transition-transform duration-300"></div>
                                                <div className="absolute top-1/2 -left-1.5 w-3 h-3 bg-[#651313] rounded-full -translate-y-1/2"></div>
                                                <div className="absolute top-1/2 -right-1.5 w-3 h-3 bg-[#651313] rounded-full -translate-y-1/2"></div>

                                                <div className="relative h-14 w-14">
                                                    <Image
                                                        src={`${(process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5000/api").replace("/api", "")}/uploads/${item.icon}`}
                                                        alt={item.title}
                                                        fill
                                                        unoptimized
                                                        className="object-contain"
                                                    />
                                                </div>
                                            </div>
                                            <h3 className="text-4xl font-semibold text-[#651313] mb-2">
                                                <Counter value={item.count} />+
                                            </h3>
                                            <p className="text-sm font-semibold text-[#651313]/60">{item.title}</p>
                                        </motion.div>
                                    );
                                })}
                            </motion.div>
                        ) : (
                            <p className="text-[#651313]/60 italic">No achievements found.</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Major Clients Part - White Background */}
            <div className="bg-white py-20 px-4 sm:px-10">
                <div className="mx-auto max-w-6xl">
                    <div className="text-center">
                        <motion.h2
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, amount: 0.1 }}
                            variants={itemVariants}
                            className="text-2xl font-bold text-[#651313] mb-16 uppercase tracking-wider"
                        >
                            Our Major Clients
                        </motion.h2>

                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, amount: 0.1 }}
                            variants={itemVariants}
                            className="relative overflow-hidden w-full max-w-5xl mx-auto py-2"
                        >
                            <div
                                className="flex transition-transform duration-700 ease-in-out"
                                style={{
                                    transform: `translateX(-${currentIndex * (100 / visibleCount)}%)`,
                                }}
                            >
                                {clients.map((client) => (
                                    <div
                                        key={client.id}
                                        className="flex-shrink-0 w-1/2 sm:w-1/4 px-4 flex justify-center items-center"
                                    >
                                        <div className="w-full h-36 sm:h-40 max-w-[220px] relative transition-all duration-300 transform hover:scale-110">
                                            <Image
                                                src={client.image}
                                                alt={`Client logo ${client.id}`}
                                                fill
                                                className="object-contain"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Navigation Dots */}
                        <motion.div variants={itemVariants} className="flex justify-center gap-2 mt-8">
                            {Array.from({ length: Math.max(0, totalClients - visibleCount + 1) }).map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setCurrentIndex(i)}
                                    className={`h-1.5 rounded-full transition-all duration-300 ${currentIndex === i ? "w-6 bg-[#EB4724]" : "w-1.5 bg-gray-300"
                                        }`}
                                    aria-label={`Go to slide ${i + 1}`}
                                />
                            ))}
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
}
