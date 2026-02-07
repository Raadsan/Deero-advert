"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { motion, AnimatePresence } from "framer-motion";

type Slide = {
  title: string;
  description: string;
  image: string;
};

const slides: Slide[] = [
  {
    title: "Graphic Design",
    description:
      "We offer range of graphic design services encompasses logo design, UI design, event branding, and brand identity. With our expertise, we create captivating and memorable brands that resonate with the public, leaving a lasting impression.",
    image: "/home-images/graphic design.png",
  },
  {
    title: "Digital Marketing",
    description:
      "We offer complete digital marketing services, including social media marketing strategy, social media analytics, branding, content writing and social media management. The strategy team understands business cases and how to align digital marketing activities to ensure they deliver on your objectives.",
    image: "/home-images/digital-marketing.png",
  },
  {
    title: "Web Solutions",
    description:
      "We offer complete web services, including web design, domain registration, domain transfer, SSL certificates, and web hosting. We create responsive websites that look wonderful on any device, including smartphones, tablets, and desktop computers.",
    image: "/home-images/web solution.png",
  },
  {
    title: "Event Branding",
    description:
      "Full suite of event branding and consulting, from digital strategy and social media to on-site branding and highlight videos.",
    image: "/home-images/event branding.png",
  },
  {
    title: "Digital Consulting",
    description:
      "We offer a full suite of digital consulting services, including digital marketing, branding consulting, event consulting, assisting with content creation, digital media, and communication consulting.",
    image: "/home-images/digital consulting.png",
  },
];

export default function Hero() {
  const [active, setActive] = useState(0);
  const total = useMemo(() => slides.length, []);
  const router = useRouter();

  useEffect(() => {
    const id = setInterval(() => {
      setActive((prev) => (prev + 1) % total);
    }, 5500);
    return () => clearInterval(id);
  }, [total]);

  const slide = slides[active];

  const goTo = (idx: number) => setActive(idx);
  const next = () => setActive((prev) => (prev + 1) % total);
  const prev = () => setActive((prev) => (prev - 1 + total) % total);

  const handleSeeMore = () => {
    if (slide.title === "Digital Consulting") {
      router.push("/services#business-growth");
    } else {
      router.push("/services");
    }
  };

  return (
    <section className="relative overflow-hidden bg-[linear-gradient(to_right,#651313_0%,#651313_60%,#EB4724_100%)] text-white h-[600px] sm:h-[650px] lg:h-[700px] flex flex-col justify-center">
      <div className="mx-auto flex max-w-6xl flex-col gap-12 px-4 py-14 sm:px-10 lg:flex-row lg:items-center lg:py-20 ">
        <button
          type="button"
          aria-label="Previous slide"
          onClick={prev}
          className="absolute left-3 top-1/2 hidden -translate-y-1/2 text-white transition hover:scale-110 lg:inline-flex z-20"
        >
          <ChevronLeftIcon className="h-8 w-8" />
        </button>
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between w-full gap-10 ">
          <div className="space-y-6 lg:w-1/2">
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.8 }}
                className="space-y-6"
              >
                <h1 className="text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
                  {slide.title}
                </h1>
                <p className="max-w-2xl text-lg leading-8 text-white/90">
                  {slide.description}
                </p>
                <div className="flex items-center gap-4">
                  <button
                    onClick={handleSeeMore}
                    className="rounded-md bg-[#c88a66] px-10 py-3 pl-8 text-base font-semibold text-white shadow transition hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                  >
                    See More
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="relative lg:w-1/2 flex justify-center items-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.8 }}
                className="relative z-10"
              >
                <Image
                  src={slide.image}
                  alt={slide.title}
                  width={620}
                  height={420}
                  className="h-auto w-full max-w-[520px] object-contain"
                  priority
                  loading="eager"
                  unoptimized={false}
                />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>


        <button
          type="button"
          aria-label="Next slide"
          onClick={next}
          className="absolute right-3 top-1/2 hidden -translate-y-1/2 text-white transition hover:scale-110 lg:inline-flex z-20"
        >
          <ChevronRightIcon className="h-8 w-8" />
        </button>
      </div>

      <div className="flex items-center justify-center gap-3 pb-8">
        {slides.map((_, idx) => (
          <button
            key={idx}
            type="button"
            aria-label={`Go to slide ${idx + 1}`}
            onClick={() => goTo(idx)}
            className={`h-2 rounded-full transition-all duration-300 ${active === idx ? "w-6 bg-white" : "w-2 bg-white/60 hover:bg-white"
              }`}
          />
        ))}
      </div>
    </section>
  );
}

