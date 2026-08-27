export const dynamic = 'force-static';

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ServicesHero from "@/components/services/ServicesHero";
import BusinessServices from "@/components/services/BusinessServices";
import AwardsSection from "@/components/about/AwardsSection";
import AchievementsSection from "@/components/home/AchievementsSection";

export default function ServicesPage() {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow pt-[106px] md:pt-[131px]">
                <ServicesHero subtitle="Deero Advertising Agency provides a comprehensive range of one-stop creative, digital marketing, and advertising services, including:" />
                <BusinessServices />
                <AwardsSection />
                <AchievementsSection />
            </main>
            <Footer />
        </div>
    );
}
