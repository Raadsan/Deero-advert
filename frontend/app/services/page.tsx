"use client";

import { useEffect } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ServicesHero from "@/components/services/ServicesHero";
import ServicesContent from "@/components/services/ServicesContent";
import HostingPackages from "@/components/home/HostingPackages";
import MarketingPackages from "@/components/services/MarketingPackages";
import WebDevelopmentPackages from "@/components/services/WebDevelopmentPackages";
import GraphicDesignPackages from "@/components/services/GraphicDesignPackages";
import EventBrandingPackages from "@/components/services/EventBrandingPackages";
import CommercialContentCreationPackages from "@/components/services/CommercialContentCreationPackages";
import BusinessGrowthSolution from "@/components/services/BusinessGrowthSolution";
import Link from "next/link";
import { ChevronRightIcon } from "@heroicons/react/24/solid";

const HEADER_OFFSET = 170;

const scrollToSection = (sectionId: string | null) => {
    if (!sectionId) return;
    const element = document.getElementById(sectionId);
    if (!element) return;

    const rect = element.getBoundingClientRect();
    const scrollTop = window.scrollY || window.pageYOffset;
    const targetY = rect.top + scrollTop - HEADER_OFFSET;

    window.scrollTo({
        top: targetY,
        behavior: "smooth",
    });
};

export default function ServicesPage() {
    useEffect(() => {
        // Handle hash navigation on page load
        if (window.location.hash) {
            const hash = window.location.hash.substring(1);
            setTimeout(() => {
                scrollToSection(hash);
            }, 300);
        }
    }, []);

    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow pt-[170px]">
                <ServicesHero />

                <ServicesContent showTitle={false} paddingClasses="py-20 px-4 sm:px-10" />

                <MarketingPackages />

                <BusinessGrowthSolution />

                <WebDevelopmentPackages />

                <GraphicDesignPackages />

                <EventBrandingPackages />

                <CommercialContentCreationPackages />

                <HostingPackages />
            </main>
            <Footer />
        </div>
    );
}
