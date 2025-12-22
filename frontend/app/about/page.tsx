import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import AboutHero from "@/components/about/AboutHero";
import AboutContent from "@/components/about/AboutContent";
import CoreValues from "@/components/about/CoreValues";
import OurApproaches from "@/components/about/OurApproaches";
import AwardsSection from "@/components/about/AwardsSection";
import AchievementsSection from "@/components/home/AchievementsSection";

export default function AboutPage() {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow">
                <AboutHero />
                <AboutContent />
                <CoreValues />
                <OurApproaches />
                <AwardsSection />
                <AchievementsSection />
            </main>
            <Footer />
        </div>
    );
}
