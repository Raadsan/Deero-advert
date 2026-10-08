import Header from "@/components/layout/Header";
import Hero from "@/components/home/hero";
import MobileDownload from "@/components/home/MobileDownload";
import ServicesSection from "@/components/home/ServicesSection";
import PortfolioSection from "@/components/home/PortfolioSection";
import HostingPackages from "@/components/home/HostingPackages";
import AchievementsSection from "@/components/home/AchievementsSection";
import RecentBlogs from "@/components/home/RecentBlogs";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import NewsletterSection from "@/components/home/NewsletterSection";
import Footer from "@/components/layout/Footer";

export default function FreeBookingPage() {
  return (
    <div className="min-h-screen bg-white text-[#1a1a1a]">
      <Header />
      <main className="pt-[106px] md:pt-[131px]">
        <Hero />
        <MobileDownload />
        <ServicesSection />
        <PortfolioSection limit={2} />
        <HostingPackages />
        <AchievementsSection />
        <RecentBlogs />
        <TestimonialsSection />
        <NewsletterSection />
        <Footer />
      </main>
    </div>
  );
}
