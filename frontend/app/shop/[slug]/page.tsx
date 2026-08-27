"use client";

export const dynamic = "force-static";

import { use } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ServicesHero from "@/components/services/ServicesHero";
import ServicesContent from "@/components/services/ServicesContent";

export default function ShopServicePage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = use(params);

    return (
        <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-grow pt-[106px] md:pt-[131px]">
                <ServicesHero title="Packages" />
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
