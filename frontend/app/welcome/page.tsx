"use client";

import Image from "next/image";
import { Facebook, Linkedin, Instagram, User, AlertCircle } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useState, useEffect, useLayoutEffect, useRef } from "react";
import { getWelcomeMessage } from "@/api-client/welcomeApi";
import { getImageUrl } from "@/utils/url";

export default function WelcomePage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const pinWrapRef = useRef<HTMLDivElement>(null);
  const pinColRef = useRef<HTMLDivElement>(null);
  const pinInnerRef = useRef<HTMLDivElement>(null);

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

  useLayoutEffect(() => {
    const wrap = pinWrapRef.current;
    const col = pinColRef.current;
    const inner = pinInnerRef.current;
    if (!wrap || !col || !inner || loading || !data) return;

    const pinLeftColumn = () => {
      if (window.innerWidth < 1024) {
        inner.style.transform = "";
        return;
      }

      const header = document.querySelector("header");
      const headerBottom = header?.getBoundingClientRect().bottom ?? 131;
      const offset = Math.round(headerBottom + 24);
      const wrapTop = wrap.getBoundingClientRect().top + window.scrollY;
      const colHeight = inner.offsetHeight;
      const wrapHeight = wrap.offsetHeight;
      const maxShift = Math.max(0, wrapHeight - colHeight);
      const rawShift = window.scrollY + offset - wrapTop;
      const shift = Math.min(Math.max(0, rawShift), maxShift);
      inner.style.transform = `translateY(${shift}px)`;
    };

    pinLeftColumn();
    window.addEventListener("scroll", pinLeftColumn, { passive: true });
    window.addEventListener("resize", pinLeftColumn);
    return () => {
      window.removeEventListener("scroll", pinLeftColumn);
      window.removeEventListener("resize", pinLeftColumn);
    };
  }, [loading, data]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white text-[#1a1a1a] flex flex-col">
        <Header />
        <main className="flex-grow pt-[106px] md:pt-[131px]">
          <section className="relative w-full bg-gradient-to-r from-[#4d0e0e] via-[#651313] to-[#EB4724] py-20 lg:py-24 px-4 overflow-hidden">
            <div className="mx-auto max-w-6xl relative z-10 flex justify-center">
              <div className="h-10 w-64 rounded-lg bg-white/20 animate-pulse" />
            </div>
          </section>
          <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 md:py-24">
            <div className="flex flex-col lg:flex-row items-start gap-10 lg:gap-14">
              <div className="w-full lg:w-72 xl:w-80 shrink-0 flex flex-col items-center">
                <div className="w-52 h-52 md:w-60 md:h-60 rounded-full bg-gray-200 animate-pulse" />
                <div className="mt-6 w-full space-y-3">
                  <div className="h-5 w-40 mx-auto lg:mx-0 rounded bg-gray-200 animate-pulse" />
                  <div className="h-4 w-28 mx-auto lg:mx-0 rounded bg-gray-200 animate-pulse" />
                  <div className="h-16 w-full rounded-lg bg-gray-100 animate-pulse" />
                </div>
              </div>
              <div className="flex-1 w-full space-y-4 pt-2">
                <div className="h-8 w-3/4 rounded bg-gray-200 animate-pulse" />
                <div className="h-5 w-1/3 rounded bg-gray-200 animate-pulse" />
                <div className="h-4 w-full rounded bg-gray-100 animate-pulse" />
                <div className="h-4 w-full rounded bg-gray-100 animate-pulse" />
                <div className="h-4 w-5/6 rounded bg-gray-100 animate-pulse" />
                <div className="h-4 w-full rounded bg-gray-100 animate-pulse" />
                <div className="h-4 w-2/3 rounded bg-gray-100 animate-pulse" />
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    );
  }

  const hasBio = Boolean(data?.presidentBio && data.presidentBio.trim() !== "");
  const hasBackground1 = Boolean(data?.background1 && data.background1.trim() !== "");
  const hasBackground2 = Boolean(data?.background2 && data.background2.trim() !== "");
  const hasFacebook = Boolean(data?.facebook && data.facebook.trim() !== "");
  const hasLinkedin = Boolean(data?.linkedin && data.linkedin.trim() !== "");
  const hasInstagram = Boolean(data?.instagram && data.instagram.trim() !== "");
  const hasSocials = hasFacebook || hasLinkedin || hasInstagram;

  const imageUrl = getImageUrl(data?.image);

  const formattedContent = (data?.content || "")
    .split("\n")
    .map((p: string) => p.trim())
    .filter((p: string) => p.length > 0);

  return (
    <div className="min-h-screen bg-white text-[#1a1a1a] flex flex-col justify-between">
      <div>
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
              <h1 className="text-4xl md:text-5xl lg:text-5xl font-bold text-white text-center flex-grow uppercase">
                Welcome Message
              </h1>
            </div>
          </section>

          {/* Content Section */}
          <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 md:py-24">
            {!data ? (
              <div className="py-24 text-center max-w-lg mx-auto">
                <div className="w-16 h-16 mx-auto rounded-full bg-orange-50 border border-orange-100 flex items-center justify-center text-[#EB4724] mb-4">
                  <AlertCircle size={32} />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">No Welcome Message Available</h3>
                <p className="text-gray-500 text-sm">
                  There is currently no active welcome message published. Please check back later.
                </p>
              </div>
            ) : (
              <div
                ref={pinWrapRef}
                className="flex flex-col lg:flex-row items-start gap-10 lg:gap-14 relative"
              >
                {/* Left column stays in place while the message text scrolls, then they end together */}
                <div
                  ref={pinColRef}
                  className="w-full lg:w-72 xl:w-80 shrink-0 self-start z-20"
                >
                  <div
                    ref={pinInnerRef}
                    className="flex flex-col items-center will-change-transform"
                  >
                  {/* Profile Image Container - Crisp with no glowing shucaac */}
                  <div className="relative w-52 h-52 md:w-60 md:h-60 rounded-full border border-gray-200 bg-white z-10 overflow-hidden shadow-sm flex items-center justify-center">
                    {imageUrl ? (
                      <Image
                        src={imageUrl}
                        alt={data.presidentName || "Welcome Message"}
                        fill
                        unoptimized
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                        <User size={80} />
                      </div>
                    )}
                  </div>

                  {/* Social Icons - Render ONLY if provided in backend */}
                  {hasSocials && (
                    <div className="flex justify-center gap-3 relative z-20 mt-4">
                      {hasFacebook && (
                        <a
                          href={data.facebook.trim()}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-10 h-10 rounded-full bg-[#1877F2] text-white flex items-center justify-center hover:bg-[#1877F2]/90 hover:-translate-y-0.5 transition-all shadow-sm"
                          title="Facebook"
                        >
                          <Facebook size={18} fill="currentColor" strokeWidth={0} />
                        </a>
                      )}
                      {hasLinkedin && (
                        <a
                          href={data.linkedin.trim()}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-10 h-10 rounded-full bg-[#0077B5] text-white flex items-center justify-center hover:bg-[#0077B5]/90 hover:-translate-y-0.5 transition-all shadow-sm"
                          title="LinkedIn"
                        >
                          <Linkedin size={18} fill="currentColor" strokeWidth={0} />
                        </a>
                      )}
                      {hasInstagram && (
                        <a
                          href={data.instagram.trim()}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#f09433] via-[#e6683c] to-[#bc1888] text-white flex items-center justify-center hover:opacity-90 hover:-translate-y-0.5 transition-all shadow-sm"
                          title="Instagram"
                        >
                          <Instagram size={18} strokeWidth={2.5} />
                        </a>
                      )}
                    </div>
                  )}

                  {/* Profile Info, Backgrounds & Bio */}
                  <div className="mt-6 text-center lg:text-left w-full">
                    {data.presidentName && (
                      <p className="font-bold text-gray-900 text-base md:text-lg">
                        {data.presidentName}
                      </p>
                    )}
                    {data.presidentTitle && (
                      <p className="text-[#EB4724] font-semibold text-sm mt-0.5">
                        {data.presidentTitle}
                      </p>
                    )}

                    {/* 2 Optional Background Fields - Only if present in backend */}
                    {(hasBackground1 || hasBackground2) && (
                      <div className="mt-3.5 pt-3 border-t border-gray-100 space-y-2">
                        {hasBackground1 && (
                          <div className="flex items-start gap-2 text-xs text-gray-700 pl-2.5 ">
                         
                            <span className="leading-snug">{data.background1.trim()}</span>
                          </div>
                        )}
                        {hasBackground2 && (
                          <div className="flex items-start text-xs text-gray-700 pl-2.5 pt-2.5 ">
                           
                            <span className="leading-snug">{data.background2.trim()}</span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* President Bio - Only if present in backend */}
                    {hasBio && (
                      <div className="mt-3 pt-3 border-t border-gray-100">
                        <p className="text-gray-600 text-xs md:text-sm leading-relaxed">
                          {data.presidentBio.trim()}
                        </p>
                      </div>
                    )}
                  </div>
                  </div>
                </div>

                {/* Right Content / Scrolling Center Column */}
                <div className="flex-1 min-w-0 pt-2 lg:pt-0">
                  {data.title && (
                    <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-[#651313] mb-2 uppercase tracking-wide">
                      {data.title}
                    </h2>
                  )}
                  {data.subtitle && (
                    <p className="text-[#EB4724] font-semibold text-base mb-6">
                      {data.subtitle}
                    </p>
                  )}

                  <div className="space-y-6 text-gray-600 text-sm md:text-base leading-relaxed text-justify">
                    {formattedContent.map((paragraph: string, index: number) => {
                      const htmlContent = paragraph.replace(
                        /\*\*(.*?)\*\*/g,
                        '<strong class="font-bold text-gray-800">$1</strong>'
                      );
                      return (
                        <p key={index} dangerouslySetInnerHTML={{ __html: htmlContent }} />
                      );
                    })}
                  </div>

                  {/* Signature Block */}
                  {(data.presidentName || data.presidentTitle) && (
                    <div className="mt-8 text-left">
                      <p className="font-normal text-gray-700 text-sm md:text-base">Best wishes,</p>
                      {data.presidentName && (
                        <p className="font-bold text-[#651313] text-base md:text-lg mt-1">
                          {data.presidentName}
                        </p>
                      )}
                      {data.presidentTitle && (
                        <p className="text-[#EB4724] font-semibold text-sm mt-0.5">
                          {data.presidentTitle}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </section>
        </main>
      </div>
      <Footer />
    </div>
  );
}
