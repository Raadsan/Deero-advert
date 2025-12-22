"use client";

import Image from "next/image";
import Link from "next/link";

const services = [
    { name: "Graphic\nDesign", icon: "/home-images/d-1.svg" },
    { name: "Digital\nMarketing", icon: "/home-images/d-2.svg" },
    { name: "Web Solutions", icon: "/home-images/d-3.svg" },
    { name: "Motion\nGraphics", icon: "/home-images/d-4.svg" },
    { name: "Event\nBranding", icon: "/home-images/d-5.svg" },
    { name: "Digital\nConsulting", icon: "/home-images/d-6.svg" },
];

export default function ServicesSection() {
    return (
        <section className="bg-white py-16 px-4">
            <div className="mx-auto max-w-6xl text-center space-y-12">
                <h2 className="text-4xl font-bold text-[#651313]">Our Services</h2>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-8">
                    {services.map((service, index) => (
                        <div key={index} className="flex flex-col items-center gap-1">
                            <div className="relative w-28 h-28 md:w-32 md:h-32 shadow-lg rounded-full mb-3 flex items-center justify-center bg-white group cursor-pointer transition hover:-translate-y-1">
                                <Image
                                    src={service.icon}
                                    alt={service.name.replace("\n", " ")}
                                    width={128}
                                    height={128}
                                    className="w-full h-full object-contain"
                                />
                            </div>
                            <h3 className="text-[#651313] font-bold text-center whitespace-pre-line leading-tight">
                                {service.name}
                            </h3>
                        </div>
                    ))}
                </div>

                <div className="flex justify-center pt-8">
                    <Link
                        href="#services"
                        className="bg-[#EB4724] text-white px-8 py-3 rounded-full font-bold text-lg uppercase tracking-wide hover:opacity-90 transition shadow-lg"
                    >
                        VIEW MORE
                    </Link>
                </div>
            </div>
        </section>
    );
}
