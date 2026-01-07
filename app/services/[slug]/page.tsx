"use client";

import { use } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ServicesHero from "@/components/services/ServicesHero";
import ServicesContent from "@/components/services/ServicesContent";

export default function ServiceSubPage({ params }: { params: Promise<{ slug: string }> }) {
    const resolvedParams = use(params);
    const slug = resolvedParams.slug;

    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow pt-[170px]">
                <ServicesHero />
                <ServicesContent
                    showTitle={false}
                    paddingClasses="py-20 px-4 sm:px-10"
                    filterSlug={slug}
                />
            </main>
            <Footer />
        </div>
    );
}
