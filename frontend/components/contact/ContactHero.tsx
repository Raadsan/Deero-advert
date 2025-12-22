"use client";

import Image from "next/image";
import { ChatBubbleLeftRightIcon, PhoneIcon, EnvelopeIcon, MapPinIcon } from "@heroicons/react/24/solid";

const contactDetails = [
    {
        title: "Phone",
        details: ["+252 618 553566,", "+252 61 8553633"],
        icon: PhoneIcon,
    },
    {
        title: "Email Us",
        details: ["sales@advert.deero.so", "marketing@advert.deero.so", "info@advert.deero.so"],
        icon: EnvelopeIcon,
    },
    {
        title: "Address",
        details: ["HQ Digfeer, Hodan Mogadishu-Somalia", "Shaqaalaha Mogadishu-Somalia"],
        icon: MapPinIcon,
    },
];

export default function ContactHero() {
    return (
        <section className="relative w-full bg-gradient-to-r from-[#4d0e0e] via-[#651313] to-[#EB4724] py-9 lg:py-[60px] px-4 overflow-visible">
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4 blur-3xl pointer-events-none"></div>

            <div className="mx-auto max-w-6xl relative z-10">
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

                        <button className="bg-white/20 backdrop-blur-md border border-white/30 text-white px-8 py-3 rounded-full flex items-center gap-3 hover:bg-white/30 transition-all font-bold group mx-auto md:mx-0">
                            <ChatBubbleLeftRightIcon className="h-5 w-5 text-white group-hover:scale-110 transition-transform" />
                            Live Chat
                        </button>
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
                <div className="absolute left-4 right-4 -bottom-16 lg:-bottom-24 translate-y-1/2 grid grid-cols-1 md:grid-cols-3 gap-8 pointer-events-auto">
                    {contactDetails.map((item, index) => (
                        <div
                            key={index}
                            className="bg-[#EB4724] rounded-2xl p-10 pt-16 relative shadow-[0_20px_50px_rgba(0,0,0,0.3)] transition hover:-translate-y-2 duration-300"
                        >
                            {/* Icon Circle */}
                            <div className="absolute top-0 left-10 -translate-y-1/2 w-16 h-16 bg-[#4d0e0e] rounded-full flex items-center justify-center shadow-lg border-4 border-[#EB4724]">
                                <item.icon className="h-6 w-6 text-white" />
                            </div>

                            <h3 className="text-white text-2xl font-bold mb-4">{item.title}</h3>

                            <div className="space-y-1">
                                {item.details.map((detail, idx) => (
                                    <p key={idx} className="text-white/90 text-[13px] font-medium leading-relaxed">
                                        {detail}
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
        </section>
    );
}
