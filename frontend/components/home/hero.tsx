"use client";

import Image from "next/image";
import { Calendar, CheckCircle2, Award, Headset } from "lucide-react";

const WhatsAppIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984 0 1.758.459 3.474 1.33 4.982l-1.413 5.161 5.283-1.386c1.455.794 3.097 1.213 4.787 1.214h.003c5.507 0 9.99-4.478 9.99-9.985 0-2.667-1.039-5.176-2.924-7.062a9.923 9.923 0 0 0-7.066-2.928zm5.626 14.162c-.234.658-1.157 1.205-1.879 1.261-.497.039-1.144.184-3.328-.72-2.793-1.156-4.595-4.004-4.735-4.188-.139-.184-1.129-1.503-1.129-2.868 0-1.364.714-2.036.969-2.316.255-.28.558-.35.744-.35.186 0 .372.002.535.01.173.008.406-.065.635.485.234.561.792 1.932.861 2.073.069.14.116.304.023.49-.093.185-.139.302-.278.465-.139.163-.292.365-.418.49-.139.14-.284.292-.122.57.162.278.72 1.189 1.547 1.926 1.063.948 1.96 1.242 2.238 1.381.278.139.441.116.604-.07.162-.186.697-.813.882-1.092.185-.278.371-.232.627-.139.255.093 1.626.766 1.905.905.278.14.464.21.534.325.069.117.069.674-.165 1.332z" />
  </svg>
);

export default function Hero() {

  const handleFreeConsultation = () => {
    window.dispatchEvent(new Event("openConsultationModal"));
  };

  const handleWhatsApp = () => {
    const message = encodeURIComponent("Asc Deero Advert, waxaan doonayaa tashiga bilaashka ah.");
    window.open(`https://wa.me/252618553839?text=${message}`, "_blank", "noopener,noreferrer");
  };

  return (
    <section className="relative w-full bg-white overflow-hidden pt-2 pb-6 lg:pt-3 lg:pb-8">

      <div className="relative w-full max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-14 z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 xl:gap-16 items-center justify-between">

          {/* Left Content — Pushed left with clean spacing */}
          <div className="lg:col-span-6 flex flex-col justify-center space-y-4 text-left max-w-xl">

            <h1
              className="text-3xl sm:text-4xl lg:text-[38px] xl:text-[42px] font-extrabold text-[#111111] leading-[1.18] tracking-tight"
              style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
            >
              Your Key to Business <br className="hidden sm:inline" />
              <span className="text-[#EB4724]">Growth and Success.</span>
            </h1>

            <p className="text-gray-900 font-normal text-lg sm:text-xl leading-snug">
              Your One-Stop Partner for Business Growth and Success.
            </p>

            <div className="w-24 h-[3px] bg-[#EB4724] rounded-full my-0.5" />

            <p className="text-gray-700 font-medium text-base sm:text-lg max-w-xl leading-relaxed">
              "Everything you need to grow and succeed in your business in a one-stop agency: Creative, Digital Marketing, and Advertising Services."
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 sm:gap-4 pt-1">

              {/* Book Consultation — Secondary Color (#651313) */}
              <button
                onClick={handleFreeConsultation}
                className="inline-flex items-center justify-center gap-3 rounded-xl bg-[#651313] hover:bg-[#4d0e0e] px-6 py-3.5 text-base font-bold text-white shadow-lg shadow-[#651313]/25 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] whitespace-nowrap"
              >
                <Calendar className="w-5 h-5 text-white shrink-0" />
                <span>Book a Free Consultation</span>
              </button>

              {/* WhatsApp Button — Primary Color (#EB4724) */}
              <button
                onClick={handleWhatsApp}
                className="inline-flex items-center justify-center gap-3 rounded-xl bg-[#EB4724] hover:bg-[#d63d1f] px-6 py-3.5 text-base font-bold text-white shadow-lg shadow-[#EB4724]/25 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] whitespace-nowrap"
              >
                <WhatsAppIcon className="w-5 h-5 text-white shrink-0" />
                <span>Chat on WhatsApp</span>
              </button>

            </div>

          </div>

          {/* Right Image Section — Compact height and clean fit */}
          <div className="lg:col-span-6 flex items-center justify-center lg:justify-end relative">
            <div className="relative w-full aspect-[4/3] max-w-[720px] xl:max-w-[780px] h-[360px] sm:h-[480px] lg:h-[540px] xl:h-[580px] lg:scale-105 lg:origin-right">
              <Image
                src="/home-images/right-image-2.png"
                alt="Deero Advertising Agency Showcase"
                fill
                className="object-contain object-center lg:object-right drop-shadow-2xl"
                priority
              />
            </div>
          </div>

        </div>
      </div>

    </section>
  );
}
