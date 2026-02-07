"use client";

import { useEffect } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ServicesHero from "@/components/services/ServicesHero";
import ServicesContent from "@/components/services/ServicesContent";

export default function ServicesPage() {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow pt-[170px]">
                <ServicesHero />
                <ServicesContent showTitle={false} paddingClasses="py-20 px-4 sm:px-10" />
            </main>
            <Footer />
        </div>
    );
}
