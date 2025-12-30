"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import ServiceCard from "./ServiceCard";
import { getAllServices, Service } from "@/api/serviceApi";
import { CheckIcon, ChevronDownIcon } from "@heroicons/react/24/outline";

const HEADER_OFFSET = 170; // match fixed header height
const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") || "http://localhost:5000";

const scrollToSection = (sectionId: string | null) => {
    if (!sectionId) return;
    const element = document.getElementById(sectionId);
    if (!element) return;

    const rect = element.getBoundingClientRect();
    const scrollTop = window.scrollY || window.pageYOffset;
    const targetY = rect.top + scrollTop - HEADER_OFFSET;

    window.scrollTo({
        top: targetY,
        behavior: "smooth"
    });
};

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const getServiceSlug = (title: string) =>
    (title || "service").trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');

interface ServicesContentProps {
    showTitle?: boolean;
    showViewMore?: boolean;
    paddingClasses?: string;
}

export default function ServicesContent({
    showTitle = true,
    showViewMore = false,
    paddingClasses = "py-16 px-4 sm:px-10"
}: ServicesContentProps) {
    const pathname = usePathname();
    const router = useRouter();
    const isServicesPage = pathname === "/services";

    const [groupedServices, setGroupedServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [expandedPackages, setExpandedPackages] = useState<Record<string, boolean>>({});

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const res: any = await getAllServices();
                const servicesData = Array.isArray(res.data) ? res.data : (res.data?.data || res);
                let rawResults: Service[] = Array.isArray(servicesData) ? servicesData : [];

                // Group by title and merge packages
                const groupedMap = new Map<string, Service>();

                rawResults.forEach(service => {
                    const title = (service.serviceTitle || "Service").trim();
                    const key = title.toLowerCase();

                    if (groupedMap.has(key)) {
                        const existing = groupedMap.get(key)!;
                        // Merge packages
                        if (service.packages) {
                            existing.packages = [...(existing.packages || []), ...service.packages];
                        }
                        // Favor entry with an icon
                        if (!existing.serviceIcon && service.serviceIcon) {
                            existing.serviceIcon = service.serviceIcon;
                        }
                    } else {
                        // Create deep copy to avoid mutating original state
                        groupedMap.set(key, { ...service, packages: [...(service.packages || [])] });
                    }
                });

                let results = Array.from(groupedMap.values());

                // Sort to put "Graphic Design" first
                results.sort((a, b) => {
                    const titleA = (a.serviceTitle || "").toLowerCase();
                    const titleB = (b.serviceTitle || "").toLowerCase();
                    if (titleA === "graphic design") return -1;
                    if (titleB === "graphic design") return 1;
                    return 0;
                });

                setGroupedServices(results);
            } catch (err) {
                console.error("Error fetching services:", err);
                setError("Failed to load services");
            } finally {
                setLoading(false);
            }
        };

        fetchServices();
    }, []);

    // Handle scroll after navigation from hash - wait for loading to finish
    useEffect(() => {
        if (isServicesPage && !loading && window.location.hash) {
            const hash = window.location.hash.substring(1);

            // Function to perform the actual scroll
            const performScroll = () => {
                const element = document.getElementById(hash);
                if (element) {
                    scrollToSection(hash);
                }
            };

            // First attempt
            const timer1 = setTimeout(performScroll, 300);

            // Second attempt (in case images shifted things)
            const timer2 = setTimeout(performScroll, 800);

            return () => {
                clearTimeout(timer1);
                clearTimeout(timer2);
            };
        }
    }, [isServicesPage, loading]);

    const handleServiceClick = (service: Service) => {
        const slug = getServiceSlug(service.serviceTitle || "service");
        if (isServicesPage) {
            scrollToSection(slug);
        } else {
            // On homepage, navigate to the services page with hash
            router.push(`/services#${slug}`);
        }
    };

    return (
        <section className={`bg-[#f2f2f2] overflow-hidden ${paddingClasses}`}>
            <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                variants={containerVariants}
                className="mx-auto max-w-6xl text-center space-y-12"
            >
                {showTitle && (
                    <motion.h2 variants={itemVariants} className="text-4xl font-bold text-[#651313]">
                        Our Services
                    </motion.h2>
                )}

                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#651313]"></div>
                    </div>
                ) : error ? (
                    <div className="text-red-500 py-10">{error}</div>
                ) : (
                    <>
                        {/* Icon Navigation Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-y-12 gap-x-8 mb-24">
                            {groupedServices.map((service, index) => (
                                <ServiceCard
                                    key={service._id}
                                    name={service.serviceTitle || "Service"}
                                    icon={service.serviceIcon ? (service.serviceIcon.startsWith("http") ? service.serviceIcon : `${API_URL}/${(service.serviceIcon.startsWith("/") ? service.serviceIcon.substring(1) : service.serviceIcon).replace(/\\/g, '/')}`) : "/logo deero-02 .svg"}
                                    index={index}
                                    active={false}
                                    itemVariants={itemVariants}
                                    onClick={() => handleServiceClick(service)}
                                />
                            ))}
                        </div>

                        {/* All Services Sections - ONLY ON SERVICES PAGE */}
                        {isServicesPage && groupedServices
                            .map((service) => (
                                service.packages && service.packages.length > 0 && (
                                    <motion.div
                                        key={service._id}
                                        initial="hidden"
                                        whileInView="visible"
                                        viewport={{ once: true, amount: 0.1 }}
                                        variants={containerVariants}
                                        id={getServiceSlug(service.serviceTitle || "service")}
                                        className="pt-16 pb-24 border-t border-gray-200/50"
                                    >
                                        <h3 className="text-3xl md:text-4xl font-bold text-[#EB4724] mb-12 text-center">
                                            {service.serviceTitle} Packages
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 justify-center items-stretch">
                                            {service.packages.map((pkg: any, idx: number) => {
                                                const packageId = `${service._id}-${idx}`;
                                                const isExpanded = expandedPackages[packageId];
                                                const initialFeaturesCount = 4;
                                                const hasMoreFeatures = pkg.features?.length > initialFeaturesCount;
                                                const displayedFeatures = isExpanded ? pkg.features : (pkg.features?.slice(0, initialFeaturesCount) || []);

                                                return (
                                                    <motion.div
                                                        key={idx}
                                                        variants={itemVariants}
                                                        whileHover={{ scale: 1.02 }}
                                                        className="bg-[#fcd7c3] p-8 rounded-2xl shadow-sm border-none flex flex-col transition-all duration-300 relative overflow-hidden group min-h-[480px] text-left"
                                                    >
                                                        {/* Most Popular Ribbon logic */}
                                                        {idx === 1 && (
                                                            <div className="absolute top-6 -right-8 w-40 h-8">
                                                                <div className="bg-[#651313] w-full h-full rotate-45 flex items-center justify-center shadow-md">
                                                                    <span className="text-white text-[10px] font-bold uppercase tracking-widest translate-y-[1px]">Most Popular</span>
                                                                </div>
                                                            </div>
                                                        )}

                                                        <h4 className="text-2xl font-bold text-[#4d0e0e] mb-4 pr-8 leading-tight">{pkg.packageTitle}</h4>

                                                        <div className="flex items-baseline mb-8">
                                                            <span className="text-5xl font-bold text-[#EB4724]">${pkg.price}</span>
                                                        </div>

                                                        <div className="flex-1">
                                                            <ul className="space-y-4 mb-6">
                                                                {displayedFeatures.map((feature: string, fIdx: number) => (
                                                                    <motion.li
                                                                        initial={{ opacity: 0, x: -10 }}
                                                                        animate={{ opacity: 1, x: 0 }}
                                                                        transition={{ delay: fIdx * 0.05 }}
                                                                        key={fIdx}
                                                                        className="flex items-start gap-3"
                                                                    >
                                                                        <CheckIcon className="h-4 w-4 shrink-0 stroke-[4] text-[#EB4724] mt-1" />
                                                                        <span className="text-base text-[#4d0e0e] font-medium leading-tight">{feature}</span>
                                                                    </motion.li>
                                                                ))}
                                                            </ul>

                                                            {hasMoreFeatures && (
                                                                <button
                                                                    onClick={() => setExpandedPackages(prev => ({ ...prev, [packageId]: !isExpanded }))}
                                                                    className="flex items-center gap-2 text-[#651313] font-bold text-sm mb-8 hover:text-[#EB4724] transition-colors"
                                                                >
                                                                    <div className={`w-6 h-6 rounded-full bg-white flex items-center justify-center shadow-sm transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
                                                                        <ChevronDownIcon className="h-4 w-4" />
                                                                    </div>
                                                                    {isExpanded ? 'Collapse Feature' : 'Expand Feature'}
                                                                </button>
                                                            )}
                                                        </div>

                                                        <button className="w-full py-4 px-6 rounded-xl bg-[#651313] text-white font-bold text-sm uppercase tracking-widest hover:brightness-110 active:scale-95 transition-all shadow-lg">
                                                            Get Started
                                                        </button>
                                                    </motion.div>
                                                );
                                            })}
                                        </div>
                                    </motion.div>
                                )
                            ))}
                    </>
                )}

                {showViewMore && (
                    <motion.div variants={itemVariants} className="flex justify-center pt-8">
                        <Link
                            href="/services"
                            className="bg-[#651313] text-white px-8 py-3 rounded-full font-bold text-lg uppercase tracking-wide hover:bg-[#EB4724] hover:scale-105 active:scale-95 transition-all shadow-lg"
                        >
                            VIEW MORE
                        </Link>
                    </motion.div>
                )}
            </motion.div>
        </section>
    );
}
