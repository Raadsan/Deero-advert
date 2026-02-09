export const dynamic = 'force-static';
import Header from "@/components/layout/Header";
import Hero from "@/components/home/hero";
import DomainSearch from "@/components/home/DomainSearch";
import ServicesSection from "@/components/home/ServicesSection";
import PortfolioSection from "@/components/home/PortfolioSection";
import HostingPackages from "@/components/home/HostingPackages";
import AchievementsSection from "@/components/home/AchievementsSection";
import RecentBlogs from "@/components/home/RecentBlogs";
import TeamSection from "@/components/home/TeamSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import NewsletterSection from "@/components/home/NewsletterSection";
import Footer from "@/components/layout/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-[#1a1a1a]">
      <Header />
      <main className="pt-[150px] xl:pt-[170px]">
        <Hero />
        <DomainSearch />
        <ServicesSection />
        <PortfolioSection limit={1} />
        <HostingPackages />
        <AchievementsSection />
        <RecentBlogs />
        <TeamSection />
        <TestimonialsSection />
        <NewsletterSection />
        <Footer />
      </main>
    </div>
  );
}

