import Link from "next/link";
import {
    CalendarCheck,
    Clapperboard,
    Globe2,
    Megaphone,
    Palette,
    Target,
    Check,
    ArrowRight
} from "lucide-react";

// Slugs must match API serviceTitle → /Packages/[slug] (same as ServicesContent getServiceSlug)
const businessServices = [
    {
        title: "Marketing and Campaign Strategy",
        intro: "We provide comprehensive marketing and campaign strategy services.",
        outro: "We help businesses develop effective marketing strategies that increase brand awareness, engage customers, and drive business growth.",
        slug: "marketing-and-strategy",
        includes: [
            "Market Research", "Marketing Planning",
            "Brand Development", "Campaign Planning",
            "Audience Targeting", "Content Strategy",
            "Digital Marketing", "Digital Presence"
        ],
        icon: Target,
    },
    {
        title: "Graphic Design and Branding",
        intro: "We offer comprehensive graphic design and branding services.",
        outro: "We help businesses build strong, memorable brands that stand out, inspire trust, and connect effectively with target audiences.",
        slug: "graphic-design-and-branding",
        includes: [
            "Brand Development", "Logo Design",
            "Printing Materials", "Packaging Design",
            "Corporate Identity Creation", "Marketing & Advertising Materials"
        ],
        icon: Palette,
    },
    {
        title: "Digital Marketing",
        intro: "We provide comprehensive digital marketing services.",
        outro: "We help businesses increase brand visibility, attract customers, and achieve sustainable growth in the digital marketplace.",
        slug: "digital-marketing",
        includes: [
            "Digital Strategy", "Social Media Marketing",
            "Search Engine Optimization (SEO)", "Content Marketing",
            "Email Marketing", "Digital Advertising",
            "Campaign Management"
        ],
        icon: Megaphone,
    },
    {
        title: "Web Services",
        intro: "We provide comprehensive web services.",
        outro: "We create modern, responsive, and secure websites that help businesses strengthen their online presence and achieve digital goals.",
        slug: "web-services",
        includes: [
            "Business Website Development", "E-commerce Website Development",
            "Domain Registration", "Web Hosting",
            "Search Engine Optimization (SEO)", "Professional Email Accounts",
            "SSL Certificates"
        ],
        icon: Globe2,
    },
    {
        title: "Video Production & Motion Graphics",
        intro: "We provide professional video production and motion graphics services.",
        outro: "We create engaging visual content that strengthens brands, enhances audience engagement, and supports sustainable business growth.",
        slug: "video-and-motion-graphics",
        includes: [
            "Corporate Videos", "Motion Graphics",
            "Infographic Videos", "Animated Explainer Videos",
            "Character Animation", "Commercial Advertisements",
            "Video Editing", "Social Media Content"
        ],
        icon: Clapperboard,
    },
    {
        title: "Event Branding and Promotion",
        intro: "We provide comprehensive event branding and promotion services.",
        outro: "We help clients plan, promote, and manage successful events through professional consultation, creative solutions, and seamless execution.",
        slug: "event-branding",
        includes: [
            "Event Identity & Brand Design", "Event Digital Strategy",
            "Social Media Branding", "Marketing Campaigns",
            "Event Materials Design", "Content Development",
            "Video Production", "Event Website Development"
        ],
        icon: CalendarCheck,
    },
];

export default function BusinessServices() {
    return (
        <section className="bg-[#fff8f5]/40 px-4 py-20 sm:px-10">
            <div className="mx-auto max-w-[1400px]">
                <div className="mx-auto mb-16 max-w-3xl text-center">
                    <h2 className="text-4xl font-bold text-[#4d0e0e] md:text-5xl">Business Services</h2>
                    <div className="mx-auto my-6 h-1.5 w-24 rounded-full bg-[#EB4724]" />
                </div>

                <div className="grid grid-cols-1 gap-7 md:grid-cols-2 lg:grid-cols-3">
                    {businessServices.map((service, index) => {
                        const Icon = service.icon;
                        const isEven = index % 2 === 0;
                        const iconBg = isEven ? "bg-[#651313]" : "bg-[#EB4724]";

                        return (
                            <Link
                                key={service.title}
                                href={`/Packages/${service.slug}`}
                                className="group rounded-[1.5rem] border border-[#fdb494]/30 bg-white p-7 md:p-9 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-[#EB4724]/40 flex flex-col"
                            >
                                {/* Header */}
                                <div className="flex items-start justify-between mb-5">
                                    <div className="flex items-center gap-4">
                                        <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-[1rem] ${iconBg} text-white shadow-sm transition-transform duration-300 group-hover:scale-105`}>
                                            <Icon size={26} strokeWidth={1.8} aria-hidden="true" />
                                        </div>
                                        <h3 className="text-lg md:text-[19px] font-bold leading-tight text-[#2b0808] max-w-[200px]">
                                            {service.title}
                                        </h3>
                                    </div>

                                </div>
                                
                                {/* Intro */}
                                <p className="text-[13px] md:text-[14px] leading-relaxed text-gray-600 mb-6">
                                    {service.intro}
                                </p>

                                {/* Includes */}
                                <div className="flex-grow">
                                    <h4 className="text-[12px] font-bold text-[#EB4724] mb-4">Includes:</h4>
                                    <div className="flex flex-col gap-1">
                                        {Array.from({ length: Math.ceil(service.includes.length / 2) }).map((_, rowIndex) => {
                                            const item1 = service.includes[rowIndex * 2];
                                            const item2 = service.includes[rowIndex * 2 + 1];
                                            
                                            return (
                                                <div 
                                                    key={rowIndex} 
                                                    className="grid grid-cols-2 gap-3 py-1.5"
                                                >
                                                    {item1 && (
                                                        <div className="flex items-center gap-2.5">
                                                            <div className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#EB4724] text-white">
                                                                <Check size={11} strokeWidth={3.5} />
                                                            </div>
                                                            <span className="text-[11px] md:text-[12px] font-medium text-[#4d0e0e] leading-tight">{item1}</span>
                                                        </div>
                                                    )}
                                                    {item2 && (
                                                        <div className="flex items-center gap-2.5">
                                                            <div className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#EB4724] text-white">
                                                                <Check size={11} strokeWidth={3.5} />
                                                            </div>
                                                            <span className="text-[11px] md:text-[12px] font-medium text-[#4d0e0e] leading-tight">{item2}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Outro */}
                                <p className="text-[13px] md:text-[14px] leading-relaxed text-gray-500 mt-5 pt-5 border-t border-[#fdb494]/20 italic">
                                    {service.outro}
                                </p>

                                {/* CTA Button */}
                                <span
                                    className="mt-5 flex items-center justify-center gap-2 rounded-xl bg-[#651313] px-5 py-2.5 text-[13px] font-semibold text-white transition-all duration-300 group-hover:bg-[#EB4724] group-hover:gap-3"
                                >
                                    View
                                    <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-1" />
                                </span>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
