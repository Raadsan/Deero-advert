"use client";

import Image from "next/image";
import Link from "next/link";
import { Facebook, Twitter, Instagram, Linkedin, Globe } from "lucide-react";

export default function Footer() {
    return (
        <footer className="w-full">
            {/* Branding Section */}
            <div className="bg-[#fce5d8] py-16 px-4">
                <div className="mx-auto max-w-4xl text-center flex flex-col items-center">
                    {/* Logo */}
                    <div className="relative w-32 h-32 mb-8">
                        <Image
                            src="/home-images/Deero Logo.png"
                            alt="Deero Logo"
                            fill
                            className="object-contain"
                        />
                    </div>

                    {/* Description */}
                    <p className="text-[#651313] text-lg md:text-xl font-medium leading-relaxed italic mb-8 max-w-3xl">
                        Deero Advertising Agency is one of the innovative digital service providers in Somalia, founded in 2019 to offer a wide range of digital creative services
                    </p>

                    {/* Follow Us */}
                    <div className="space-y-6">
                        <h4 className="text-[#EB4724] font-bold text-lg italic">Follow us on</h4>
                        <div className="flex gap-4">
                            {[
                                { Icon: Facebook, href: "#" },
                                { Icon: Twitter, href: "#" },
                                { Icon: Instagram, href: "#" },
                                { Icon: Linkedin, href: "#" },
                                { Icon: Globe, href: "#" }, // Using Globe for Behance/Other
                            ].map((social, index) => (
                                <Link
                                    key={index}
                                    href={social.href}
                                    className="w-10 h-10 bg-[#4d0e0e] text-white rounded-full flex items-center justify-center hover:bg-[#EB4724] transition-colors duration-300"
                                >
                                    <social.Icon size={20} />
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Copyright Bar */}
            <div className="bg-[#4d0e0e] text-white py-4 px-4 overflow-hidden">
                <div className="mx-auto max-w-6xl flex flex-col md:flex-row justify-between items-center text-xs font-medium tracking-wide">
                    <p className="mb-4 md:mb-0">
                        Copyright 2025 @ Deero Advert. All Rights Reserved.
                    </p>
                    <div className="flex gap-8">
                        <Link href="#" className="hover:text-[#EB4724] transition-colors">Terms & Conditions</Link>
                        <Link href="#" className="hover:text-[#EB4724] transition-colors text-right md:text-left">Privacy Policy</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
