export const dynamic = 'force-static';
import HostingFeatures from "@/components/hosting/HostingFeatures";
import HostingHero from "@/components/hosting/HostingHero";
import HostingPackages from "@/components/home/HostingPackages";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HostingDomainSearch from "@/components/hosting/HostingDomainSearch";

export const metadata = {
    title: "Web Hosting | Deero Advert",
    description: "Reliable and fast web hosting services for your business.",
};

import { Suspense } from "react";

export default function HostingPage() {
    return (
        <div className="min-h-screen bg-white text-[#1a1a1a]">
            {/* Header is handled by the layout now, but keeping manual if layout doesn't have it. 
                Wait, I previously saw layout doesn't have header. So keeping it.
            */}
            <Header />
            <main className="pt-[170px]">
                <HostingHero />

                <Suspense fallback={<div className="py-16 text-center">Loading search...</div>}>
                    <HostingDomainSearch />
                </Suspense>

                {/* Hosting Plans Section with ID for anchor links */}
                <div id="plans">
                    <HostingPackages />
                </div>

                <HostingFeatures />
            </main>
            <Footer />
        </div>
    );
}
