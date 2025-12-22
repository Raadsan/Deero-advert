import Header from "@/components/layout/Header";
import Hero from "@/components/home/hero";
import DomainSearch from "@/components/home/DomainSearch";
import ServicesSection from "@/components/home/ServicesSection";
import PortfolioSection from "@/components/home/PortfolioSection";
import HostingPackages from "@/components/home/HostingPackages";
import AchievementsSection from "@/components/home/AchievementsSection";
import RecentBlogs from "@/components/home/RecentBlogs";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import Footer from "@/components/layout/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-[#1a1a1a]">
      <Header />
      <main>
        <Hero />
        <DomainSearch />
        <ServicesSection />
        <PortfolioSection />
        <HostingPackages />
        <AchievementsSection />
        <RecentBlogs />
        <TestimonialsSection />
        <Footer />
      </main>
    </div>
  );
}
