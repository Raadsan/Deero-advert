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
      title: "WELCOME TO THE HOME OF CREATIVE EXCELLENCE.",
      subtitle: "Deero Advert President",
      content: "Greetings and welcome to the official website of Deero Advertising Agency. We are thrilled to be partnering with you as you participate in an exciting journey. Whether you are a returning client, fresh startup, or established brand, you will find unlimited opportunities to enjoy our services by learning, exploring, and engaging with others.\n\nFrom the very beginning, Deero Advertising Agency was envisioned as an institution whose sole purpose was serving the public. Over the last several years, we have relentlessly followed our valued public mission – through research, innovation, education, and activities that develop the decent of society.",
      presidentName: "Eng. Ayuub Mohamud",
      presidentTitle: "President",
      image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
  };

  const formattedContent = contentData.content.split('\n').filter((p: string) => p.trim() !== '');

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
        <div className="text-gray-600 text-sm md:text-base leading-relaxed text-justify">
          
          {/* Left Sidebar (Image & Socials) - Floated */}
          <div className="float-none lg:float-left w-full lg:w-auto flex flex-col items-center lg:items-end lg:pr-10 lg:mr-6 mb-10 lg:mb-4">
            <div className="relative flex flex-col items-center">
              {/* Subtle Accent Line */}
              {/* <div className="absolute -left-8 top-12 h-16 w-1 bg-[#EB4724] hidden lg:block rounded-full" /> */}
              
              {/* Profile Image Container */}
              <div className="relative w-52 h-52 md:w-60 md:h-60 rounded-full border-4 border-white shadow-[0_12px_40px_rgba(0,0,0,0.08)] bg-white z-10 overflow-hidden">
                <Image
                  src={data?.image ? getImageUrl(data.image) : contentData.image} 
                  alt={contentData.presidentName}
                  fill
                  unoptimized
                  className="object-cover"
                />
              </div>
              
              {/* Social Icons */}
              <div className="flex justify-center gap-4 relative z-20 mt-2">
                {(!data || data.facebook) && (
                    <a href={data?.facebook || "https://www.facebook.com/deeroadvert"} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-[#1877F2] text-white flex items-center justify-center hover:bg-[#1877F2]/90 hover:-translate-y-0.5 transition-all shadow-[0_4px_12px_rgba(24,119,242,0.35)]">
                    <Facebook size={18} fill="currentColor" strokeWidth={0} />
                    </a>
                )}
                {(!data || data.linkedin) && (
                    <a href={data?.linkedin || "https://so.linkedin.com/company/deero-advert"} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-[#0077B5] text-white flex items-center justify-center hover:bg-[#0077B5]/90 hover:-translate-y-0.5 transition-all shadow-[0_4px_12px_rgba(0,119,181,0.35)]">
                    <Linkedin size={18} fill="currentColor" strokeWidth={0} />
                    </a>
                )}
                {(!data || data.instagram) && (
                    <a href={data?.instagram || "https://www.instagram.com/deeroadvert/"} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#f09433] via-[#e6683c] to-[#bc1888] text-white flex items-center justify-center hover:opacity-90 hover:-translate-y-0.5 transition-all shadow-[0_4px_12px_rgba(225,48,108,0.35)]">
                    <Instagram size={18} strokeWidth={2.5} />
                    </a>
                )}
              </div>
            </div>
          </div>

          {/* Right Content / Wrapped Text */}
          <div className="pt-2 lg:pt-0">
            <h2 className="text-xl md:text-2xl font-bold text-[#651313] mb-2 uppercase tracking-wide">
              {contentData.title}
            </h2>
            <p className="text-[#EB4724] font-semibold mb-6">
              {contentData.subtitle}
            </p>

            <div className="space-y-6">
              {formattedContent.map((paragraph: string, index: number) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </div>

          <div className="mt-10 text-gray-800 clear-both">
            <p className="font-bold mb-0.5">Best wishes,</p>
            <p className="font-bold">{contentData.presidentName}</p>
            <p className="text-[#EB4724] font-bold mt-0.5">{contentData.presidentTitle}</p>
          </div>

        </div>
      </section>
      </main>
      <Footer />
    </div>
  );
}
