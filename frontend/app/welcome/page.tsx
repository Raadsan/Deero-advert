"use client";

import Image from "next/image";
import Link from "next/link";
import { Facebook, Linkedin, Instagram } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useState, useEffect } from "react";
import { getWelcomeMessage } from "@/api-client/welcomeApi";
import { getImageUrl } from "@/utils/url";

export default function WelcomePage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
      const fetchMessage = async () => {
          try {
              const response = await getWelcomeMessage();
              setData(response.data?.data || null);
          } catch (error) {
              console.error("Failed to fetch welcome message", error);
          } finally {
              setLoading(false);
          }
      };
      fetchMessage();
  }, []);

  if (loading) {
      return (
          <div className="min-h-screen bg-white text-[#1a1a1a] flex flex-col">
              <Header />
              <main className="flex-grow flex items-center justify-center pt-[106px] md:pt-[131px]">
                  <div className="w-8 h-8 border-4 border-[#EB4724] border-t-transparent rounded-full animate-spin"></div>
              </main>
              <Footer />
          </div>
      );
  }

  // Fallback data if none exists in backend
  const contentData = data || {
      title: "A MESSAGE FROM THE CO-FOUNDER",
      subtitle: "Deero Enterprise",
      content: " across creative services, marketing strategies, digital technology, AI-powered solutions, and professional skills development.\n\nWith over **7 years of experience**, we have helped businesses across Somalia build strong brands, strengthen their digital presence, reach the right audiences, adopt innovative technology solutions, improve operational efficiency, simplify business processes, accelerate digital transformation, and achieve sustainable growth through integrated creative, marketing, technology, and business solutions.\n\nOver the years, we have expanded our operations through specialized subsidiaries, each focused on delivering value and addressing diverse market needs. Today, our portfolio includes Deero Advert, established in 2019; Deero Institute, established in 2020; and Raadsan Technology, established in 2025. Together, our businesses serve a diverse range of clients across various sectors, including small, medium, and large enterprises, government institutions, political parties, NGOs, educational institutions, technology and telecommunications companies, healthcare organizations, and other private-sector entities.\n\nThrough our businesses and partnerships, we are committed to empowering organizations, supporting entrepreneurship, developing talent, and contributing to Somalia's growing digital and business ecosystem. Our success is built on innovation, professionalism, collaboration, and a commitment to continuous improvement. As we look ahead, we remain focused on expanding our capabilities, embracing emerging technologies, building strategic partnerships, and creating sustainable value for the communities and businesses we serve.\n\nI sincerely appreciate our clients, partners, employees, and stakeholders for their continued trust and for being part of our journey. Their support motivates us to keep improving, delivering excellence, and pursuing greater achievements.\n\n**Our ambition is not simply to grow as a business, but to build an enterprise that creates lasting value and meaningful impact.**",
      presidentName: "Eng. Ayub Mohamud Abdikarim",
      presidentTitle: "Co-Founder & Portfolio Manager",
      image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
  };

  const formattedContent = (contentData.content || '').split('\n').filter((p: string) => p.trim() !== '');

  return (
    <div className="min-h-screen bg-white text-[#1a1a1a]">
      <Header />
      <main className="pt-[106px] md:pt-[131px]">
      {/* Hero Banner */}
      <section className="relative w-full bg-gradient-to-r from-[#4d0e0e] via-[#651313] to-[#EB4724] py-20 lg:py-24 px-4 overflow-hidden">
        {/* Watermark Pattern - Single Row */}
        <div className="absolute inset-0 flex items-center justify-between opacity-10 pointer-events-none select-none px-4">
            {Array.from({ length: 7 }).map((_, i) => (
                <div key={i} className="w-24 h-24 md:w-32 md:h-32 relative shrink-0">
                    <img
                        src="/home-images/about-01.svg"
                        alt=""
                        className="w-full h-full object-contain grayscale brightness-0 invert opacity-30"
                    />
                </div>
            ))}
        </div>

        <div className="mx-auto max-w-6xl relative z-10 flex flex-col md:flex-row items-center justify-center">
            {/* Title - Centered */}
            <h1 className="text-4xl md:text-5xl lg:text-5xl font-bold text-white text-center flex-grow uppercase">
                Welcome Message
            </h1>
        </div>
      </section>

      {/* Content Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="flex flex-col lg:flex-row items-center lg:items-start gap-10 lg:gap-14">
          
          {/* Left Sidebar (Image, Socials & Signature) */}
          <div className="w-full lg:w-72 xl:w-80 shrink-0 flex flex-col items-center">
            {/* Profile Image Container - Clean & Crisp (No blur/shadow shucaac) */}
            <div className="relative w-52 h-52 md:w-60 md:h-60 rounded-full border border-gray-200 bg-white z-10 overflow-hidden">
              <Image
                src={data?.image ? getImageUrl(data.image) : contentData.image} 
                alt={contentData.presidentName || "Eng. Ayub Mohamud Abdikarim"}
                fill
                unoptimized
                className="object-cover"
              />
            </div>
            
            {/* Social Icons - Clean without glow */}
            <div className="flex justify-center gap-3 relative z-20 mt-4">
              {(!data || data.facebook) && (
                  <a href={data?.facebook || "https://www.facebook.com/deeroadvert"} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-[#1877F2] text-white flex items-center justify-center hover:bg-[#1877F2]/90 hover:-translate-y-0.5 transition-all shadow-sm">
                  <Facebook size={18} fill="currentColor" strokeWidth={0} />
                  </a>
              )}
              {(!data || data.linkedin) && (
                  <a href={data?.linkedin || "https://so.linkedin.com/company/deero-advert"} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-[#0077B5] text-white flex items-center justify-center hover:bg-[#0077B5]/90 hover:-translate-y-0.5 transition-all shadow-sm">
                  <Linkedin size={18} fill="currentColor" strokeWidth={0} />
                  </a>
              )}
              {(!data || data.instagram) && (
                  <a href={data?.instagram || "https://www.instagram.com/deeroadvert/"} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#f09433] via-[#e6683c] to-[#bc1888] text-white flex items-center justify-center hover:opacity-90 hover:-translate-y-0.5 transition-all shadow-sm">
                  <Instagram size={18} strokeWidth={2.5} />
                  </a>
              )}
            </div>

            {/* Left Signature Block (Under Social Media) */}
            <div className="mt-8 text-left">
              <p className="font-bold text-gray-900 text-base md:text-lg mt-1">
                {contentData.presidentName || "Eng. Ayub Mohamud Abdikarim"}
              </p>
              <p className="text-[#EB4724] font-semibold text-sm mt-0.5">
                {contentData.presidentTitle || "Co-Founder & Portfolio Manager"}
              </p>
            </div>
          </div>

          {/* Right Content / Continuous Non-wrapping Column */}
          <div className="flex-1 min-w-0 pt-2 lg:pt-0">
            <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-[#651313] mb-2 uppercase tracking-wide">
              {contentData.title}
            </h2>
            <p className="text-[#EB4724] font-semibold text-base mb-6">
              {contentData.subtitle}
            </p>

            <div className="space-y-6 text-gray-600 text-sm md:text-base leading-relaxed text-justify">
              {formattedContent.map((paragraph: string, index: number) => {
                const htmlContent = paragraph.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-gray-800">$1</strong>');
                return (
                  <p key={index} dangerouslySetInnerHTML={{ __html: htmlContent }} />
                );
              })}
            </div>

            {/* Left Signature Block (Under Social Media) */}
            <div className="mt-8 text-left">
              <p className="font-normal text-gray-700 text-sm md:text-base">Best wishes,</p>
              <p className="font-bold text-[#651313] text-base md:text-lg mt-1">
                {contentData.presidentName || "Eng. Ayub Mohamud Abdikarim"}
              </p>
              <p className="text-[#EB4724]  font-semibold text-sm mt-0.5">
                {contentData.presidentTitle || "Co-Founder & Portfolio Manager"}
              </p>
            </div>
          </div>

        </div>
      </section>
      </main>
      <Footer />
    </div>
  );
}
