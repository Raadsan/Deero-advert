"use client";

import Image from "next/image";
import { motion, Variants } from "framer-motion"; // Add Variants import
import { useState, useEffect } from "react";

import { getTeams } from "@/api-client/teamApi";
import { getImageUrl } from "@/utils/url";

export default function TeamSection({ view = "slider" }: { view?: "slider" | "grid" }) {
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

                // If no teams found, use mock data for design preview
                if (teamsData.length === 0) {
                    const allSocials = [
                        { platform: 'facebook', url: '#' },
                        { platform: 'linkedin', url: '#' },
                        { platform: 'instagram', url: '#' },
                        { platform: 'tiktok', url: '#' }
                    ];
                    teamsData = [
                        { _id: '1', name: 'Ahmed Ali', position: 'CEO & Founder', description: 'Visionary leader with over 10 years of experience in digital transformation and strategic business growth for global brands.', image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400', socials: allSocials },
                        { _id: '2', name: 'Sahra Hassan', position: 'Creative Director', description: 'Award-winning designer expert in brand identity, visual storytelling, and creating immersive user experiences for clients.', image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400', socials: allSocials },
                        { _id: '3', name: 'Mohamed Omar', position: 'Technical Lead', description: 'Full-stack developer specializing in building fast, scalable, and responsive web applications using modern technologies.', image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=400', socials: allSocials },
                        { _id: '4', name: 'Anisa Ahmed', position: 'UI/UX Designer', description: 'Passionate about creating user-centered designs that wow users and solve complex problems through simple, elegant solutions.', image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=400', socials: allSocials },
                        { _id: '5', name: 'Anisa Ahmed', position: 'UI/UX Designer', description: 'Passionate about creating user-centered designs that wow users and solve complex problems through simple, elegant solutions.', image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=400', socials: allSocials },
                        { _id: '6', name: 'Anisa Ahmed', position: 'UI/UX Designer', description: 'Passionate about creating user-centered designs that wow users and solve complex problems through simple, elegant solutions.', image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=400', socials: allSocials },
                        { _id: '7', name: 'Anisa Ahmed', position: 'UI/UX Designer', description: 'Passionate about creating user-centered designs that wow users and solve complex problems through simple, elegant solutions.', image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=400', socials: allSocials },
                    ];
                }

                const formattedTeams = teamsData.map((member: any) => ({
                    ...member,
                    image: member.image.startsWith('http') ? member.image : (getImageUrl(member.image) || "/home-images/placeholder.png"),
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
            <section className="bg-[#f8f9fa] py-24 px-4 sm:px-10 overflow-hidden text-center border-t border-gray-100">
                <p className="text-[#651313] font-medium animate-pulse">Loading our team members...</p>
            </section>
        );
    }

    return (
        <section id="team-section" className={`${view === 'slider' ? 'py-24' : 'py-16'} bg-[#f8f9fa] px-4 sm:px-10 overflow-hidden`}>
            <div className="mx-auto max-w-6xl xl:max-w-7xl">
                {/* Header */}
                <div className="text-center mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="mb-4"
                    >
                        <h2 className="text-2xl md:text-3xl font-bold text-[#651313] mb-4 tracking-tight">Our Team</h2>
                        <div className="w-20 h-1 bg-[#EB4724] mx-auto rounded-full"></div>
                    </motion.div>
                </div>

                {/* Content Container */}
                <div className="relative w-full">
                    {teams.length > 0 ? (
                        view === "slider" ? (
                            <InnerSlider items={teams} />
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                {teams.map((member, idx) => (
                                    <div key={member._id || member.id || idx} className="flex justify-center">
                                        <TeamMemberCard member={member} />
                                    </div>
                                ))}
                            </div>
                        )
                    ) : (
                        <div className="text-center py-10 text-gray-500">
                            No team members to display at the moment.
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}

function TeamMemberCard({ member }: { member: any }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white p-8 rounded-none shadow-[0_4px_20px_rgba(0,0,0,0.05)] text-center w-full group hover:shadow-xl transition-all duration-300 border-b-4 border-transparent hover:border-b-[#EB4724]"
        >
            {/* Circular Photo */}
            <div className="relative w-32 h-32 mx-auto mb-6">
                <div className="absolute inset-0 rounded-full border-2 border-[#EB4724] transform group-hover:scale-110 transition-transform duration-500"></div>
                <div className="absolute inset-1.5 rounded-full overflow-hidden bg-gray-100">
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
            </div>

            {/* Info */}
            <h3 className="text-xl font-bold text-gray-900 mb-1">{member.name}</h3>
            <p className="text-[#EB4724]/70 font-medium text-sm mb-4 tracking-wide uppercase">
                {member.title}
            </p>

            {member.description && (
                <p className="text-gray-500 text-sm leading-relaxed mb-8 px-2 line-clamp-3">
                    {member.description}
                </p>
            )}

            {/* Social Icons */}
            <div className="flex justify-center gap-3">
                {member.socials?.map((social: any, idx: number) => (
                    <a
                        key={idx}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-8 h-8 rounded-full bg-[#EB4724]/10 text-[#EB4724] flex items-center justify-center hover:bg-[#EB4724] hover:text-white transition-all duration-300"
                        title={social.platform}
                    >
                        {social.platform === "facebook" && <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>}
                        {social.platform === "linkedin" && <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>}
                        {social.platform === "instagram" && <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>}
                        {social.platform === "tiktok" && <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12.525.02c1.31-.036 2.612-.018 3.91-.018.03 1.223.15 2.446.412 3.64.862-.11 1.727-.127 2.591-.018.02 1.335.016 2.671-.012 4.007-.822.06-1.643.063-2.463-.03-.023 2.095-.034 4.19-.023 6.285-.015.637-.129 1.269-.341 1.865a4.847 4.847 0 01-3.328 3.208 4.93 4.93 0 01-3.361.025 4.84 4.84 0 01-1.928-1.077 4.917 4.917 0 01-1.21-1.894c-.171-.58-.238-1.183-.198-1.787.033-.64.192-1.27.467-1.852a4.87 4.87 0 013.256-2.82c.133-.041.273-.061.411-.082V14.12a2.307 2.307 0 00-1.61 1.272 2.32 2.32 0 00-.016 1.616c.102.4.32.763.623 1.044a2.3 2.3 0 001.285.57 2.32 2.32 0 001.603-.311 2.303 2.303 0 001.046-1.614c.108-.757.108-1.522 0-2.279V4.408c-.004-1.463-.004-2.925-.004-4.388z" /></svg>}
                    </a>
                ))}
            </div>
        </motion.div>
    );
}

function InnerSlider({ items }: { items: any[] }) {
    const [index, setIndex] = useState(0);
    const [visibleItems, setVisibleItems] = useState(4);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 640) setVisibleItems(1);
            else if (window.innerWidth < 1024) setVisibleItems(2);
            else setVisibleItems(4);
        };

        handleResize();
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
        }, 4000);
        return () => clearInterval(interval);
    }, [visibleItems, items.length]);

    return (
        <div className="relative w-full overflow-hidden">
            <div
                className="flex transition-transform duration-1000 cubic-bezier(0.4, 0, 0.2, 1) py-8"
                style={{
                    transform: `translateX(-${index * (100 / visibleItems)}%)`,
                }}
            >
                {items.map((member, idx) => (
                    <div
                        key={member._id || member.id || idx}
                        style={{ width: `${100 / visibleItems}%` }}
                        className="flex-shrink-0 px-3 flex justify-center"
                    >
                        <TeamMemberCard member={member} />
                    </div>
                ))}
            </div>

            {/* Slider Dots */}
            {items.length > visibleItems && (
                <div className="flex justify-center gap-2 mt-8">
                    {Array.from({ length: items.length - visibleItems + 1 }).map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setIndex(i)}
                            className={`h-1.5 rounded-full transition-all duration-300 ${index === i ? "w-8 bg-[#EB4724]" : "w-1.5 bg-gray-300 hover:bg-gray-400"}`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

