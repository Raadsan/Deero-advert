"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, animate, useInView } from "framer-motion";
import { getAllAchievements, Achievement } from "../../api/achievementApi";
import { getMajorClients } from "../../api/majorClientApi";
import { getImageUrl } from "@/utils/url";

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
    const [achievements, setAchievements] = useState<Achievement[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);
    const visibleCount = 4;

    const [majorClients, setMajorClients] = useState<any[]>([]);
    const [clientsLoading, setClientsLoading] = useState(true);

    const totalClients = majorClients.length;

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch Achievements
                const { data: achievementsRes } = await getAllAchievements();
                if (achievementsRes.success) {
                    setAchievements(achievementsRes.data);
                }

                // Fetch Major Clients
                const clientsData = await getMajorClients();
                const fetchedClients = clientsData.clients || clientsData.data || [];

                // Extract all images from all clients (flattening the array if multiple images per client)
                const allimages = fetchedClients.flatMap((client: any) =>
                    client.images.map((img: string, idx: number) => {
                        const imageUrl = getImageUrl(img);

                        return {
                            id: `${client._id}-${idx}`,
                            image: imageUrl || "/logo deero-02 .svg",
                            title: client.description
                        };
                    })
                );

                setMajorClients(allimages);
            } catch (error) {
                console.error("Failed to fetch data:", error);
            } finally {
                setLoading(false);
                setClientsLoading(false);
            }
        };

        fetchData();
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
            <div className="pt-16 pb-0 px-4 sm:px-10">
                <div className="mx-auto max-w-6xl">
                    <div className="text-center mb-16">
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, amount: 0.1 }}
                            variants={itemVariants}
                            className="mb-14"
                        >
                            <h2 className="text-2xl md:text-3xl font-bold text-[#651313] mb-4 tracking-wider">
                                Our Achievements
                            </h2>
                            <div className="w-20 h-1.5 bg-[#EB4724] mx-auto rounded-full"></div>
                        </motion.div>

                        {loading ? (
                            <div className="flex justify-center items-center py-10">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#EB4724]"></div>
                            </div>
                        ) : achievements.length > 0 ? (
                            <motion.div
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true, amount: 0.1 }}
                                variants={containerVariants}
                                className="grid grid-cols-2 md:grid-cols-4 gap-12"
                            >
                                {achievements.map((item) => {
                                    return (
                                        <motion.div key={item._id} variants={itemVariants} className="flex flex-col items-center group">
                                            <div className="relative w-24 h-24 flex items-center justify-center mb-6">
                                                <div className="relative h-18 w-18">
                                                    <Image
                                                        src={getImageUrl(item.icon) || "/logo deero-02 .svg"}
                                                        alt={item.title || "Achievement Icon"}
                                                        fill
                                                        unoptimized
                                                        className="object-contain group-hover:scale-110 transition-transform duration-300"
                                                        onError={(e) => {
                                                            const target = e.target as HTMLImageElement;
                                                            target.src = "/logo deero-02 .svg";
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                            <h3 className="text-4xl font-semibold text-[#651313] mb-2">
                                                <Counter value={Number(item.count)} />+
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
            <div className="bg-white pt-8 pb-16 px-4 sm:px-10">
                <div className="mx-auto max-w-6xl">
                    <div className="text-center mb-16">
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, amount: 0.1 }}
                            variants={itemVariants}
                            className="mb-8"
                        >
                            <h2 className="text-2xl md:text-3xl font-bold text-[#651313] mb-4 tracking-wider">
                                Our Major Clients
                            </h2>
                            <div className="w-20 h-1.5 bg-[#EB4724] mx-auto rounded-full"></div>
                        </motion.div>

                        {clientsLoading ? (
                            <div className="flex justify-center items-center py-10">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#EB4724]"></div>
                            </div>
                        ) : majorClients.length > 0 ? (
                            <>
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
                                            transform: `translateX(-${currentIndex * (100 / Math.min(visibleCount, totalClients || 1))}%)`,
                                        }}
                                    >
                                        {majorClients.map((client) => (
                                            <div
                                                key={client.id}
                                                className="flex-shrink-0 w-1/2 sm:w-1/4 px-4 flex justify-center items-center"
                                            >
                                                <div className="w-full h-36 sm:h-40 max-w-[220px] relative transition-all duration-300 transform hover:scale-110">
                                                    <Image
                                                        src={client.image}
                                                        alt="Client Logo"
                                                        unoptimized
                                                        fill
                                                        className="object-contain"
                                                        onError={(e) => {
                                                            const target = e.target as HTMLImageElement;
                                                            target.src = "/logo deero-02 .svg";
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>

                                {/* Navigation Dots */}
                                {totalClients > visibleCount && (
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
                                )}
                            </>
                        ) : (
                            <p className="text-[#651313]/60 italic">No clients found.</p>
                        )}
                    </div>
                </div>
            </div >
        </section >
    );
}
