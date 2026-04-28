export const dynamic = 'force-static';
import Header from "@/components/layout/Header";
import Hero from "@/components/home/hero";
import MobileDownload from "@/components/home/MobileDownload";
import ServicesSection from "@/components/home/ServicesSection";
import PortfolioSection from "@/components/home/PortfolioSection";
import HostingPackages from "@/components/home/HostingPackages";
import AchievementsSection from "@/components/home/AchievementsSection";
import RecentBlogs from "@/components/home/RecentBlogs";
import TeamSection from "@/components/home/TeamSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import NewsletterSection from "@/components/home/NewsletterSection";
import Footer from "@/components/layout/Footer";

import SuccessNotification from "@/components/shared/SuccessNotification";
import { Suspense } from "react";

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-[#1a1a1a]">
      <Suspense fallback={null}>
        <SuccessNotification />
      </Suspense>
      <Header />
      <main className="pt-[130px] md:pt-[120px]">
        <Hero />
        <MobileDownload />
        <ServicesSection />
        <PortfolioSection limit={1} />
        <HostingPackages />
        <AchievementsSection />
        <RecentBlogs />
        {/* <TeamSection /> */}
        <TestimonialsSection />
        <NewsletterSection />
        <Footer />
      </main>
    </div>
  );
}

