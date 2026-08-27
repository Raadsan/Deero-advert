export const dynamic = 'force-static';
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import AboutHero from "@/components/about/AboutHero";
import AboutContent from "@/components/about/AboutContent";
import CoreValues from "@/components/about/CoreValues";
import OurApproaches from "@/components/about/OurApproaches";
import AwardsSection from "@/components/about/AwardsSection";
import AchievementsSection from "@/components/home/AchievementsSection";
import WhyChooseUs from "@/components/about/WhyChooseUs";
import NewsletterSection from "@/components/home/NewsletterSection";

export default function AboutPage() {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow pt-[106px] md:pt-[131px]">
                <AboutHero />
                <AboutContent />
                <WhyChooseUs />
                {/* <CoreValues /> */}
                <OurApproaches />
                <AwardsSection />
                <AchievementsSection />
                <NewsletterSection />
            </main>
            <Footer />
        </div>
    );
}

