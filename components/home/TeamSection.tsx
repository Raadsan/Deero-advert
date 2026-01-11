"use client";

import Image from "next/image";
import { motion, Variants } from "framer-motion"; // Add Variants import
import { useState, useEffect } from "react";

import { getTeams } from "@/api/teamApi";
import { getImageUrl } from "@/utils/url";

export default function TeamSection() {
    const [teams, setTeams] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTeams = async () => {
            try {
                const response = await getTeams();

                let teamsData = [];
                if (response.data && response.data.success && Array.isArray(response.data.teams)) {
                    teamsData = response.data.teams;
                } else if (response.data && response.data.success && Array.isArray(response.data.data)) {
                    teamsData = response.data.data;
                } else if (Array.isArray(response.data)) {
                    teamsData = response.data;
                }

                const formattedTeams = teamsData.reverse().map((member: any) => ({
                    ...member,
                    image: getImageUrl(member.image) || "/home-images/placeholder.png",
                    name: member.name || member.fullname,
                    title: member.position || member.title,
                }));
                setTeams(formattedTeams);
            } catch (error) {
                console.error("Error fetching teams:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTeams();
    }, []);

    if (loading) {
        return (
            <section className="bg-white py-24 px-4 sm:px-10 overflow-hidden text-center border-t border-gray-100">
                <p className="text-[#651313] font-medium animate-pulse">Loading our team members...</p>
            </section>
        );
    }

    // No longer returning null, always show the section if it's supposed to be there
    return (
        <section id="team-section" className="bg-white py-24 px-4 sm:px-10 overflow-hidden border-t border-gray-100">
            <div className="mx-auto max-w-7xl">
                {/* Header */}
                <div className="text-center mb-20">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-5xl font-bold text-[#651313] mb-4"
                    >
                        Our Team
                    </motion.h2>
                    <motion.div
                        initial={{ scaleX: 0 }}
                        whileInView={{ scaleX: 1 }}
                        viewport={{ once: true }}
                        className="h-1 w-24 bg-[#EB4724] mx-auto rounded-full"
                    ></motion.div>
                </div>

                {/* Slider Container */}
                <div className="relative w-full overflow-hidden">
                    {teams.length > 0 ? (
                        <InnerSlider items={teams} />
                    ) : (
                        <div className="text-center py-10 text-gray-400">
                            No team members to display at the moment.
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}

// Separate component to handle window resizing safely if needed, or just keep it simple with CSS variables.
// Actually, let's keep it simple. We will use the layout logic where 1 "unit" of movement = 1 item width.
// We just need to know what 1 item width IS in %.
// Desktop: 25%. Mobile: 100%. 
// We can use a CSS variable `--slide-percentage` set by media query?
// Or we can just just accept that "Testimonial" logic had `visibleCount = 3` and `md:w-1/3`. 
// If they view on mobile, `w-full` (100%). moving `33%` would be broken.
// Let's see testimonial: `w-full md:w-1/3`. current index moves `100/3` %. 
// Yes, the testimonial slider is broken on mobile (moves 1/3 of a card).
// I will FIX this by making it responsive properly using a custom hook for visible items or standard breakpoints.

function InnerSlider({ items }: { items: any[] }) {
    const [index, setIndex] = useState(0);
    const [visibleItems, setVisibleItems] = useState(4); // default desktop

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 640) setVisibleItems(1);
            else if (window.innerWidth < 1024) setVisibleItems(2);
            else setVisibleItems(4);
        };

        handleResize(); // init
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        if (items.length <= visibleItems) {
            setIndex(0);
            return;
        }

        const interval = setInterval(() => {
            setIndex((prev) => (prev + 1) % (items.length - visibleItems + 1));
        }, 3000); // 3 seconds
        return () => clearInterval(interval);
    }, [visibleItems, items.length]);

    return (
        <div className="relative w-full">
            <div
                className="flex transition-transform duration-700 ease-in-out"
                style={{
                    transform: `translateX(-${index * (100 / visibleItems)}%)`,
                }}
            >
                {items.map((member, idx) => (
                    <div
                        key={member._id || member.id || idx}
                        style={{ width: `${100 / visibleItems}%` }} // Explicit width based on JS state matches the slide percentage
                        className="flex-shrink-0 px-4 flex flex-col items-center group"
                    >
                        {/* Blob Container */}
                        <div className="relative w-64 h-64 mb-6">
                            <div className="absolute inset-0 bg-[#EB4724] rounded-[60%_40%_30%_70%/60%_30%_70%_40%] group-hover:rounded-[40%_60%_70%_30%/40%_40%_60%_60%] transition-all duration-700 ease-in-out group-hover:bg-[#FBDAD3] shadow-lg"></div>

                            <div className="absolute inset-2 border-2 border-dashed border-white/30 rounded-[50%] group-hover:rotate-45 transition-transform duration-700"></div>

                            {/* Image */}
                            <div className="absolute inset-4 rounded-full overflow-hidden border-4 border-white shadow-sm bg-white">
                                <Image
                                    src={member.image}
                                    alt={member.name}
                                    fill
                                    unoptimized
                                    className="object-cover object-top transition-transform duration-500 group-hover:scale-110"
                                />
                            </div>

                            {/* Social Icons */}
                            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 flex items-center gap-3 opacity-0 group-hover:opacity-100 group-hover:-translate-y-2 transition-all duration-500 z-20">
                                {member.socials?.find((s: any) => s.platform === "facebook") && (
                                    <a
                                        href={member.socials.find((s: any) => s.platform === "facebook")?.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-9 h-9 bg-white rounded-full flex items-center justify-center text-[#EB4724] shadow-md hover:scale-110 transition-transform"
                                    >
                                        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
                                    </a>
                                )}
                                {member.socials?.find((s: any) => s.platform === "twitter") && (
                                    <a
                                        href={member.socials.find((s: any) => s.platform === "twitter")?.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-9 h-9 bg-white rounded-full flex items-center justify-center text-[#EB4724] shadow-md hover:scale-110 transition-transform"
                                    >
                                        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" /></svg>
                                    </a>
                                )}
                                {member.socials?.find((s: any) => s.platform === "linkedin") && (
                                    <a
                                        href={member.socials.find((s: any) => s.platform === "linkedin")?.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-9 h-9 bg-white rounded-full flex items-center justify-center text-[#EB4724] shadow-md hover:scale-110 transition-transform"
                                    >
                                        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
                                    </a>
                                )}
                            </div>
                        </div>

                        {/* Content */}
                        <div className="text-center relative z-10 w-full px-4 transition-all duration-500 group-hover:-translate-y-2 group-hover:scale-105">
                            <h3 className="text-lg font-bold text-[#651313] mb-1 whitespace-nowrap overflow-hidden text-ellipsis group-hover:text-[#EB4724] transition-colors duration-300">{member.name}</h3>
                            <p className="text-[#EB4724] font-medium text-sm uppercase tracking-wider group-hover:text-[#651313] transition-colors duration-300">{member.title}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Dots */}
            {items.length > visibleItems && (
                <div className="flex justify-center gap-2 mt-12">
                    {Array.from({ length: items.length - visibleItems + 1 }).map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setIndex(i)}
                            className={`h-1.5 rounded-full transition-all duration-300 ${index === i ? "w-6 bg-[#EB4724]" : "w-1.5 bg-gray-300 hover:bg-gray-400"}`}
                            aria-label={`Go to item ${i + 1}`}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}
