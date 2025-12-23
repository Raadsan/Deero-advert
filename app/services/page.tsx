"use client";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
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

export default function ServicesPage() {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow">
                <section className="bg-[#f2f2f2] py-14 px-4 sm:px-10">
                    <div className="mx-auto max-w-6xl text-center">
                        <h1 className="text-4xl font-bold text-[#EB4724]">
                            Services
                        </h1>
                    </div>
                </section>

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
