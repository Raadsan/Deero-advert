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
                            Deero Advertising Agency delivers innovative digital services across Somalia, partnering with brands to craft impactful creative solutions.
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
                                { label: "Portfolio", href: "https://www.behance.net/deeroadvert" },
                                { label: "Contact", href: "/contact" },
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
                                { label: "Graphic Design", sectionId: "graphic-design" },
                                { label: "Digital Marketing", sectionId: "digital-marketing" },
                                { label: "Web Solutions", sectionId: "web-solutions" },
                                { label: "Motion Graphics", sectionId: "motion-graphics" },
                                { label: "Event Branding", sectionId: "event-branding" },
                                { label: "Digital Consulting", sectionId: "digital-consulting" },
                            ].map((item) => (
                                <li key={item.label}>
                                    {item.sectionId ? (
                                        <Link
                                            href={`/services#${item.sectionId}`}
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
                                    Icon: Twitter,
                                    href: "https://x.com/deeroadvert",
                                    label: "Twitter",
                                    icon: (
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
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
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M22 7h-7v-2h7v2zm1.726 10c-.442 1.297-2.029 3-5.101 3-3.074 0-5.564-1.729-5.564-5.675 0-3.91 2.325-5.92 5.466-5.92 3.082 0 4.542 1.711 4.542 3.466 0 2.085-1.719 2.919-3.487 2.919-2.508 0-3.388-1.448-3.388-2.583 0-1.127 1.169-1.495 3.006-1.495h.682v-2.02h-.844c-2.679-.001-4.844.809-4.844 3.807 0 2.18 1.537 3.948 3.946 3.948 1.98 0 3.374-.937 3.717-2.01h2.004zm-7.89 5.392c-1.009-.026-1.855-.702-2.032-1.378h1.557c.126.515.568.86 1.304.86 1.209 0 1.957-.666 1.957-1.803 0-1.021-.626-1.664-1.884-1.664-1.366 0-2.256.59-2.256 1.585 0 .973.816 1.57 2.05 1.57.493 0 .872-.08 1.304-.23v-1.351h-.684zm-13.836.392v-5.504c-.47-.515-1.302-1.002-2.05-1.002-.844 0-1.336.366-1.336 1.235 0 .884.492 1.322 1.336 1.322.748 0 1.58-.487 2.05-1.002v4.949h2.684zm-2.684-7.892c-.974 0-1.894.402-2.05 1.002h4.1c-.156-.6-1.076-1.002-2.05-1.002zm17.864-.892c-2.04 0-3.4 1.234-3.4 3.12 0 1.884 1.36 3.12 3.4 3.12 2.04 0 3.4-1.236 3.4-3.12 0-1.886-1.36-3.12-3.4-3.12zm.198 5.392c-1.099 0-1.992-.528-1.992-2.108v-.896c0-1.582.893-2.108 1.992-2.108 1.099 0 1.987.526 1.987 2.108v.896c0 1.582-.888 2.108-1.987 2.108z" />
                                        </svg>
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
                        Powered by Deero Advert.
                    </p>
                </div>
            </div>



        </footer>
    );
}
