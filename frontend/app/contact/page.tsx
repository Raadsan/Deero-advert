"use client";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ContactHero from "@/components/contact/ContactHero";
import ContactForm from "@/components/contact/ContactForm";

export default function ContactPage() {
    return (
        <div className="min-h-screen flex flex-col bg-white">
            <Header />
            <main className="flex-grow pt-[170px]">
                <ContactHero />
                {/* Spacer section with light grey background to catch the overlapping cards */}
                <div className="bg-[#f5f5f7] h-32 lg:h-48"></div>
                <ContactForm />
            </main>
            <Footer />
        </div>
    );
}
