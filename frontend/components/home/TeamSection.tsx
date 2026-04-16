"use client";

import Image from "next/image";
import { motion, Variants } from "framer-motion"; // Add Variants import
import { useState, useEffect } from "react";

import { getTeams } from "@/api-client/teamApi";
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
                    description: member.description || "",
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
            <div className="mx-auto max-w-6xl xl:max-w-7xl">
                {/* Header */}
                <div className="text-center mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="mb-4"
                    >
                        <h2 className="text-2xl md:text-3xl font-bold text-[#651313] mb-4">Our Team</h2>
                        <div className="w-20 h-1.5 bg-[#EB4724] mx-auto rounded-full"></div>
                    </motion.div>
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
                                    src={member.image || "/logo deero-02 .svg"}
                                    alt={member.name || "Team Member"}
                                    fill
                                    unoptimized
                                    className="object-cover object-top transition-transform duration-500 group-hover:scale-110"
                                    onError={(e) => {
                                        const target = e.target as HTMLImageElement;
                                        target.src = "/logo deero-02 .svg";
                                    }}
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
                                        title="Facebook"
                                    >
                                        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
                                    </a>
                                )}
                                {member.socials?.find((s: any) => s.platform === "linkedin") && (
                                    <a
                                        href={member.socials.find((s: any) => s.platform === "linkedin")?.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-9 h-9 bg-white rounded-full flex items-center justify-center text-[#EB4724] shadow-md hover:scale-110 transition-transform"
                                        title="LinkedIn"
                                    >
                                        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                                    </a>
                                )}
                                {member.socials?.find((s: any) => s.platform === "tiktok") && (
                                    <a
                                        href={member.socials.find((s: any) => s.platform === "tiktok")?.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-9 h-9 bg-white rounded-full flex items-center justify-center text-[#EB4724] shadow-md hover:scale-110 transition-transform"
                                        title="TikTok"
                                    >
                                        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12.525.02c1.31-.036 2.612-.018 3.91-.018.03 1.223.15 2.446.412 3.64.862-.11 1.727-.127 2.591-.018.02 1.335.016 2.671-.012 4.007-.822.06-1.643.063-2.463-.03-.023 2.095-.034 4.19-.023 6.285-.015.637-.129 1.269-.341 1.865a4.847 4.847 0 01-3.328 3.208 4.93 4.93 0 01-3.361.025 4.84 4.84 0 01-1.928-1.077 4.917 4.917 0 01-1.21-1.894c-.171-.58-.238-1.183-.198-1.787.033-.64.192-1.27.467-1.852a4.87 4.87 0 013.256-2.82c.133-.041.273-.061.411-.082V14.12a2.307 2.307 0 00-1.61 1.272 2.32 2.32 0 00-.016 1.616c.102.4.32.763.623 1.044a2.3 2.3 0 001.285.57 2.32 2.32 0 001.603-.311 2.303 2.303 0 001.046-1.614c.108-.757.108-1.522 0-2.279V4.408c-.004-1.463-.004-2.925-.004-4.388z" /></svg>
                                    </a>
                                )}
                                {member.socials?.find((s: any) => s.platform === "instagram") && (
                                    <a
                                        href={member.socials.find((s: any) => s.platform === "instagram")?.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-9 h-9 bg-white rounded-full flex items-center justify-center text-[#EB4724] shadow-md hover:scale-110 transition-transform"
                                        title="Instagram"
                                    >
                                        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                                   </a>
                                )}
                            </div>
                        </div>

                        {/* Content */}
                        <div className="text-center relative z-10 w-full px-4 transition-all duration-500 group-hover:-translate-y-2 group-hover:scale-105">
                            <h3 className="text-lg font-bold text-[#651313] mb-1 whitespace-nowrap overflow-hidden text-ellipsis group-hover:text-[#EB4724] transition-colors duration-300">{member.name}</h3>
                            <p className="text-[#EB4724] font-medium text-sm tracking-wider group-hover:text-[#651313] transition-colors duration-300">{member.title}</p>
                            {member.description && (
                                <p className="mt-2 text-gray-500 text-xs max-w-[220px] mx-auto opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0 whitespace-pre-line">
                                    {member.description.length > 100 ? member.description.substring(0, 100) + "..." : member.description}
                                </p>
                            )}
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

