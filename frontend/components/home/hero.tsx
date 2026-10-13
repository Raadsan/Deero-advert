"use client";

import Link from "next/link";

export default function Hero() {

  const handleWhatsApp = () => {
    const message = encodeURIComponent("Asc Deero Advert, waxaan doonayaa tashiga bilaashka ah.");
    window.open(`https://wa.me/252618553839?text=${message}`, "_blank", "noopener,noreferrer");
  };

  return (
    <section className="relative w-full bg-white pt-28 pb-0 sm:pt-32 sm:pb-2.5 lg:pt-36 lg:pb-[26px] overflow-hidden">
      <div className="relative w-full mx-auto max-w-6xl xl:max-w-7xl px-4 sm:px-6 z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 xl:gap-20 items-start min-h-[440px] sm:min-h-[500px] lg:min-h-[560px]">

          {/* Left Content */}
          <div
            className="relative z-20 lg:col-span-5 flex flex-col justify-start space-y-7 lg:space-y-8 text-left max-w-xl bg-white lg:pr-8 xl:pr-12 pt-[30px] sm:pt-[38px] lg:pt-[54px]"
            style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
          >
            <h1 className="text-2xl sm:text-3xl lg:text-[32px] xl:text-[36px] font-extrabold text-[#111111] leading-[1.3] tracking-[0.02em]">
              Your Key to Business <br />
              <span className="text-[#EB4724]">Growth and Success.</span>
            </h1>

            <p
              className="text-gray-600 text-base leading-relaxed max-w-xl font-normal"
              style={{ fontFamily: "Arial, Helvetica, sans-serif" }}
            >
              Your one-stop partner for business growth,
              providing Creative, Digital Marketing, and
              Advertising Services designed to help your business grow,
              stand out, and succeed.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 pt-3">
              <Link
                href="/free-booking"
                className="inline-flex items-center justify-center rounded-full border-2 border-[#EB4724] bg-white px-7 py-3 text-sm sm:text-base font-semibold text-[#333333] transition-all duration-300 hover:bg-[#EB4724]/5 active:scale-[0.98] whitespace-nowrap"
              >
                Book a Free Consultation
              </Link>

              <button
                onClick={handleWhatsApp}
                className="inline-flex items-center justify-center rounded-full px-7 py-3 text-sm sm:text-base font-semibold text-white shadow-md transition-all duration-300 hover:opacity-95 active:scale-[0.98] whitespace-nowrap"
                style={{ background: "linear-gradient(90deg, #EB4724 0%, #651313 100%)" }}
              >
                Chat on WhatsApp
              </button>
            </div>
          </div>

          {/* Right Image */}
          <div className="relative z-10 lg:col-span-7 flex items-start justify-end min-w-0 overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/home-images/12.png"
              alt="Deero Advertising Agency Showcase"
              width={2940}
              height={2140}
              decoding="async"
              fetchPriority="high"
              className="w-[95%] h-auto max-w-[95%] object-contain object-right"
              draggable={false}
            />
          </div>

        </div>
      </div>
    </section>
  );
}
