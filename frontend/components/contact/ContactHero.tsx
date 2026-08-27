"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { ChatBubbleLeftRightIcon, PhoneIcon, EnvelopeIcon, MapPinIcon } from "@heroicons/react/24/solid";
import { getCompanyContacts } from "@/api-client/companyContactApi";

const iconMap: Record<string, any> = {
    phone: PhoneIcon,
    email: EnvelopeIcon,
    address: MapPinIcon,
};

const titleMap: Record<string, string> = {
    phone: "Phone",
    email: "Email Us",
    address: "Address",
};

export default function ContactHero() {
    const [contacts, setContacts] = useState<{ title: string; details: string[]; icon: any; type: string }[]>([]);

    useEffect(() => {
        const fetchContacts = async () => {
            try {
                const res = await getCompanyContacts();
                if (res.success && res.data && res.data.length > 0) {
                    const dynamicData = res.data;

                    // Group by type, preserving order: phone, email, address
                    const typeOrder = ["phone", "email", "address"];
                    const grouped = typeOrder
                        .map((type) => {
                            const items = dynamicData.filter((c: any) => c.type === type);
                            if (items.length === 0) return null;
                            return {
                                title: titleMap[type] || type,
                                details: items.map((c: any) => c.value),
                                icon: iconMap[type] || PhoneIcon,
                                type,
                            };
                        })
                        .filter(Boolean) as { title: string; details: string[]; icon: any; type: string }[];

                    setContacts(grouped);
                }
            } catch (err) {
                console.error("Failed to fetch contact info:", err);
            }
        };
        fetchContacts();
    }, []);

    return (
        <section className="relative w-full bg-gradient-to-r from-[#4d0e0e] via-[#651313] to-[#EB4724] py-9 lg:py-[60px] px-4 overflow-x-clip">
            {/* Background Decoration */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4 blur-3xl"></div>
            </div>

            <div className="mx-auto max-w-6xl relative z-10 w-full">
                <div className="flex flex-col md:flex-row items-center justify-between mb-12">
                    {/* Left Content */}
                    <div className="w-full md:w-1/2 text-white space-y-6 text-center md:text-left mb-12 md:mb-0">
                        <h1 className="text-5xl md:text-6xl font-bold leading-tight">
                            Contact us,<br />
                            <span className="text-white/90">Feel free to contact</span>
                        </h1>
                        <p className="text-white/80 text-sm md:text-base max-w-md leading-relaxed">
                            Easily accessible customer service is crucial in today's 24-hour, online business environment. Hostim's experienced team Members.
                        </p>

                        <a
                            href="https://wa.me/252618553839"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block"
                        >
                            <button className="bg-white/20 backdrop-blur-md border border-white/30 text-white px-8 py-3 rounded-full flex items-center gap-3 hover:bg-white/30 transition-all font-bold group">
                                <ChatBubbleLeftRightIcon className="h-5 w-5 text-white group-hover:scale-110 transition-transform" />
                                Live Chat
                            </button>
                        </a>
                    </div>

                    {/* Right Content - Illustration */}
                    <div className="w-full md:w-1/2 flex justify-center items-center">
                        <div className="relative w-[300px] h-[300px] md:w-[450px] md:h-[450px]">
                            <Image
                                src="/home-images/Contact-Us.svg"
                                alt="Contact Illustration"
                                fill
                                className="object-contain"
                                priority
                            />


                        </div>
                    </div>
                </div>

                {/* Overlapping Info Cards */}
                <div className="relative lg:absolute left-0 right-0 lg:-bottom-24 lg:translate-y-1/2 px-4 mt-16 lg:mt-0 -mb-16 lg:mb-0 pointer-events-auto z-20">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-y-14 lg:gap-8 max-w-5xl mx-auto">
                        {contacts.map((item, index) => (
                            <div
                                key={index}
                                className="bg-[#EB4724] rounded-2xl p-10 pt-16 relative shadow-[0_20px_50px_rgba(0,0,0,0.3)] transition hover:-translate-y-2 duration-300 min-h-[220px]"
                            >
                                {/* Icon Circle */}
                                <div className="absolute top-0 left-10 -translate-y-1/2 w-16 h-16 bg-[#4d0e0e] rounded-full flex items-center justify-center shadow-lg border-4 border-[#EB4724]">
                                    <item.icon className="h-6 w-6 text-white" />
                                </div>

                                <h3 className="text-white text-2xl font-bold mb-4">{item.title}</h3>

                                <div className="space-y-1">
                                    {(item.type === "phone" || item.type === "email"
                                        ? item.details.flatMap((detail) =>
                                            detail.split(",").map(v => v.trim()).filter(v => v !== "")
                                          )
                                        : item.details
                                    ).map((line, idx) => (
                                        <p key={idx} className="text-white/90 text-[13px] font-medium leading-relaxed">
                                            {line}
                                        </p>
                                    ))}
                                </div>

                                {/* Decorative Line (Only for Address as in image) */}
                                {item.title === "Address" && (
                                    <div className="mt-4 w-full h-px bg-white/30"></div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}


