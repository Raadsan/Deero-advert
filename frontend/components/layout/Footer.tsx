"use client";

import Link from "next/link";
import Image from "next/image";
import { MessageCircle, Phone, Facebook, Linkedin, Instagram, Twitter } from "lucide-react";

export default function Footer() {

    return (
        <footer className="relative w-full bg-[#4d0e0e] text-white">
            {/* Main Footer Content */}
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 items-start">
                    {/* Deero Advert Section */}
                    <div className="lg:col-span-1 flex flex-col items-start gap-4 md:pr-10 lg:pr-14">
                        <Image
                            src="/4 (2).png"
                            alt="Deero Advert"
                            width={300}
                            height={120}
                            priority
                            className="w-[180px] md:w-[210px] lg:w-[230px] h-auto object-contain self-start"
                        />
                        <p className="text-white/80 text-sm leading-relaxed max-w-[320px]">
                            Deero Advertising Agency is one of the innovative digital service providers in Somalia, founded in 2019 to offer a wide range of digital creative services
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-white font-bold text-lg mb-6">Quick Links</h3>
                        <ul className="space-y-3">
                            {[
                                { label: "Home", href: "/" },
                                { label: "About", href: "/about" },
                                { label: "Services", href: "/services" },
                                { label: "Portfolio", href: "/portfolio" },
                                { label: "Contact", href: "/contact" },
                                { label: "News", href: "/news" },
                            ].map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-white/90 hover:text-[#EB4724] transition-colors text-sm"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Services */}
                    <div>
                        <h3 className="text-white font-bold text-lg mb-6">Services</h3>
                        <ul className="space-y-3">
                            {[
                                { label: "Graphic Design", slug: "graphic-design" },
                                { label: "Digital Marketing", slug: "digital-marketing" },
                                { label: "Web Solutions", slug: "website-design-and-development" },
                                { label: "Motion Graphics", slug: "motion-graphics" },
                                { label: "Event Branding", slug: "event-branding" },
                                { label: "Digital Consulting", slug: "digital-consulting" },
                            ].map((item) => (
                                <li key={item.label}>
                                    {item.slug ? (
                                        <Link
                                            href={`/services/${item.slug}`}
                                            className="text-white/90 hover:text-[#EB4724] transition-colors text-sm"
                                        >
                                            {item.label}
                                        </Link>
                                    ) : (
                                        <span className="text-white/60 text-sm">
                                            {item.label}
                                        </span>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="text-white font-bold text-lg mb-6">Contact</h3>
                        <ul className="space-y-4 text-sm text-white/90">
                            <li className="flex items-start gap-3">
                                <Phone size={18} className="mt-0.5 shrink-0" />
                                <a href="tel:+252618553566" className="hover:text-[#EB4724] transition-colors">
                                    +252 61 8553566
                                </a>
                            </li>
                            <li className="flex items-start gap-3">
                                <MessageCircle size={18} className="mt-0.5 shrink-0" />
                                <a href="mailto:info@advert.deero.so" className="hover:text-[#EB4724] transition-colors break-all">
                                    info@advert.deero.so
                                </a>
                            </li>
                            <li className="flex items-start gap-3">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mt-0.5 shrink-0">
                                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                                    <circle cx="12" cy="10" r="3"></circle>
                                </svg>
                                <span>HQ Digfeer, Mogadishu - Somalia</span>
                            </li>
                        </ul>
                        <div className="flex gap-3 pt-10">
                            {[
                                {
                                    Icon: Facebook,
                                    href: "https://www.facebook.com/deeroadvert",
                                    label: "Facebook",
                                    icon: (
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                        </svg>
                                    )
                                },
                                {
                                    Icon: null,
                                    href: "https://www.tiktok.com/@deeroadverts?_r=1&_t=ZS-950PzD1Xrjp",
                                    label: "TikTok",
                                    icon: (
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 2.23-1.07 4.41-2.73 5.91-1.66 1.48-3.9 2.21-6.15 2.05-2.26-.14-4.4-1.22-5.74-3.04-1.34-1.81-1.8-4.2-1.22-6.39.57-2.18 2.07-4.04 4.09-4.99 2.02-.95 4.39-1.05 6.47-.28l-.01 4.15c-1.14-.58-2.52-.73-3.76-.36-1.25.37-2.28 1.25-2.79 2.45-.52 1.2-.41 2.62.29 3.73.69 1.12 1.95 1.84 3.25 1.92 1.3.08 2.62-.35 3.55-1.23.94-.88 1.45-2.16 1.43-3.46-.03-5.69-.01-11.39-.02-17.08z" />
                                        </svg>
                                    )
                                },
                                {
                                    Icon: Instagram,
                                    href: "https://www.instagram.com/deeroadvert/",
                                    label: "Instagram",
                                    icon: (
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                                        </svg>
                                    )
                                },
                                {
                                    Icon: Linkedin,
                                    href: "https://so.linkedin.com/company/deero-advert",
                                    label: "LinkedIn",
                                    icon: (
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                                        </svg>
                                    )
                                },
                                {
                                    Icon: null,
                                    href: "https://www.behance.net/deeroadvert",
                                    label: "Behance",
                                    icon: (
                                        <img
                                            src="/home-images/behance.png"
                                            alt="Behance"
                                            className="w-5 h-5 object-contain invert brightness-0 grayscale"
                                        />
                                    )
                                },
                            ].map((social) => (
                                <Link
                                    key={social.label}
                                    href={social.href}
                                    aria-label={social.label}
                                    className="w-10 h-10 rounded-full bg-[#651313] flex items-center justify-center hover:bg-[#EB4724] transition-all duration-300 text-white"
                                >
                                    {social.icon}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-white/10  py-4 px-4">
                <div className="mx-auto max-w-7xl flex flex-col md:flex-row justify-between items-center text-xs text-white/90">
                    <p className="mb-2 md:mb-0">
                        Copyright © {new Date().getFullYear()} Deero Advert. All rights reserved.
                    </p>
                    <p className="text-white/80">
                        Powered by Raadsan Teach.
                    </p>
                </div>
            </div>



        </footer>
    );
}

