"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { UserGroupIcon, HandRaisedIcon, UsersIcon, TrophyIcon } from "@heroicons/react/24/outline";

const achievements = [
    {
        id: 1,
        count: "750+",
        label: "Happy Clients",
        icon: UserGroupIcon,
    },
    {
        id: 2,
        count: "1,027+",
        label: "Completed Projects",
        icon: HandRaisedIcon,
    },
    {
        id: 3,
        count: "11+",
        label: "Profesional Team",
        icon: UsersIcon,
    },
    {
        id: 4,
        count: "7+",
        label: "Awards Won",
        icon: TrophyIcon,
    },
];

const clients = Array.from({ length: 14 }, (_, i) => {
    const num = i + 1;
    const extension = num === 13 ? "jpg" : "png";
    return {
        id: num,
        image: `/home-images/${num}.${extension}`,
    };
});

export default function AchievementsSection() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const visibleCount = 4;
    const totalClients = clients.length;

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % (totalClients - visibleCount + 1));
        }, 3000);
        return () => clearInterval(interval);
    }, [totalClients]);

    return (
        <section className="overflow-hidden">
            {/* Achievements Part - Peach Background */}
            <div className="bg-[#fce5d8] py-20 px-4">
                <div className="mx-auto max-w-6xl">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-[#651313] mb-16 uppercase tracking-wider">Our Achievements</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
                            {achievements.map((item) => (
                                <div key={item.id} className="flex flex-col items-center group">
                                    <div className="relative w-28 h-28 flex items-center justify-center mb-6">
                                        <div className="absolute inset-0 border-2 border-[#EB4724] rounded-full group-hover:scale-110 transition-transform duration-300"></div>
                                        <div className="absolute top-1/2 -left-1.5 w-3 h-3 bg-[#651313] rounded-full -translate-y-1/2"></div>
                                        <div className="absolute top-1/2 -right-1.5 w-3 h-3 bg-[#651313] rounded-full -translate-y-1/2"></div>
                                        <item.icon className="h-10 w-10 text-[#651313] group-hover:text-[#EB4724] transition-colors duration-300" />
                                    </div>
                                    <h3 className="text-4xl font-bold text-[#651313] mb-2">{item.count}</h3>
                                    <p className="text-sm font-medium text-[#651313]/60">{item.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Major Clients Part - White Background */}
            <div className="bg-white py-20 px-4">
                <div className="mx-auto max-w-6xl">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-[#651313] mb-16 uppercase tracking-wider">Our Major Clients</h2>

                        <div className="relative overflow-hidden w-full max-w-5xl mx-auto py-2">
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
                                        <div className="w-full h-24 relative transition-all duration-300 transform hover:scale-110">
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
                        </div>

                        {/* Navigation Dots */}
                        <div className="flex justify-center gap-2 mt-8">
                            {Array.from({ length: Math.max(0, totalClients - visibleCount + 1) }).map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setCurrentIndex(i)}
                                    className={`h-1.5 rounded-full transition-all duration-300 ${currentIndex === i ? "w-6 bg-[#EB4724]" : "w-1.5 bg-gray-300"
                                        }`}
                                    aria-label={`Go to slide ${i + 1}`}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
