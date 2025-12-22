"use client";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ContactHero from "@/components/contact/ContactHero";
import ContactForm from "@/components/contact/ContactForm";

export default function ContactPage() {
    return (
        <div className="min-h-screen flex flex-col bg-white">
            <Header />
            <main className="flex-grow">
                <ContactHero />
                {/* Spacer section with peach background to catch the overlapping cards */}
                <div className="bg-[#fce5d8] h-32 lg:h-48"></div>
                <ContactForm />
            </main>
            <Footer />
        </div>
    );
}
