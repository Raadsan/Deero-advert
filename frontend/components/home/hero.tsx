"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { motion, AnimatePresence } from "framer-motion";
import { getActiveHeroHomes } from "@/api-client/heroHomeApi";
import { getAllServices, Service } from "@/api-client/serviceApi";
import { getImageUrl } from "@/utils/url";
import { fetchApplicableDiscounts, matchesDiscountTarget } from "@/utils/discounts";

type Slide = {
  id: string | number;
  title: string;
  description: string;
  image: string;
  href?: string;
  isOffer?: boolean;
};

const getServiceSlug = (title: string) =>
  (title || "service").trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");

const parseServices = (response: any): Service[] => {
  if (Array.isArray(response?.data?.data)) return response.data.data;
  if (Array.isArray(response?.data)) return response.data;
  if (Array.isArray(response?.data?.services)) return response.data.services;
  return [];
};

export default function Hero() {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [active, setActive] = useState(0);
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [firstLoad, setFirstLoad] = useState(true);

  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const [heroResponse, servicesResponse, discounts] = await Promise.all([
          getActiveHeroHomes(),
          getAllServices(),
          fetchApplicableDiscounts(),
        ]);

        const now = new Date();
        const offerSlides: Slide[] = [];

        parseServices(servicesResponse).forEach((service) => {
          const serviceId = service._id || service.id;

          (service.packages || []).forEach((pkg) => {
            const packageId = pkg._id || pkg.id;
            let bestPercentage = 0;

            discounts.forEach((discount: any) => {
              const matchesTarget = matchesDiscountTarget(
                discount,
                "service",
                [serviceId, packageId]
              );
              const isActive = discount.status === "active" &&
                (!discount.startDate || new Date(discount.startDate) <= now) &&
                (!discount.endDate || new Date(discount.endDate) >= now);

              if (!matchesTarget || !isActive || !pkg.price) return;

              const percentage = discount.discountType === "percentage"
                ? Number(discount.discountValue)
                : (Number(discount.discountValue) / Number(pkg.price)) * 100;
              bestPercentage = Math.max(bestPercentage, Math.min(100, percentage));
            });

            if (bestPercentage > 0 && service.serviceIcon) {
              offerSlides.push({
                id: `offer-${serviceId}-${packageId}`,
                title: `${Math.round(bestPercentage)}% OFF`,
                description: pkg.packageTitle,
                image: getImageUrl(service.serviceIcon) || service.serviceIcon,
                href: `/services#${getServiceSlug(service.serviceTitle)}`,
                isOffer: true,
              });
            }
          });
        });

        if (offerSlides.length > 0) {
          setSlides(offerSlides);
        } else if (heroResponse.success && heroResponse.data.length > 0) {
          setSlides(heroResponse.data);
        }
      } catch (error) {
        console.error("Failed to fetch hero homes", error);
      }
    };
    fetchSlides();
  }, []);

  const total = useMemo(() => slides.length, [slides]);

  useEffect(() => {
    setIsMounted(true);
    if (total === 0) return;
    const id = setInterval(() => {
      setFirstLoad(false);
      setActive((prev) => (prev + 1) % total);
    }, 5500);
    return () => clearInterval(id);
  }, [total]);

  if (slides.length === 0) return <div className="min-h-[500px] bg-[linear-gradient(to_right,#651313_0%,#651313_60%,#EB4724_100%)]"></div>;

  const slide = slides[active];

  const goTo = (idx: number) => {
    setFirstLoad(false);
    setActive(idx);
  };
  const next = () => {
    setFirstLoad(false);
    setActive((prev) => (prev + 1) % total);
  };
  const prev = () => {
    setFirstLoad(false);
    setActive((prev) => (prev - 1 + total) % total);
  };

  const handleSeeMore = () => {
    if (slide.href) {
      router.push(slide.href);
    } else if (slide.title === "Digital Consulting") {
      router.push("/services#business-growth");
    } else {
      router.push("/services");
    }
  };

  return (
    <section className="relative overflow-hidden bg-[linear-gradient(to_right,#651313_0%,#651313_60%,#EB4724_100%)] text-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-12 px-4 py-14 sm:px-10 lg:flex-row lg:items-center lg:py-10 2xl:py-20 min-h-[500px] lg:min-h-[400px] 2xl:min-h-[600px]">
        {total > 1 && (
          <button
            type="button"
            aria-label="Previous slide"
            onClick={prev}
            className="absolute left-5 top-1/2 -translate-y-1/2 text-white/70 transition-all hover:text-white hover:scale-110 hidden lg:flex z-20"
          >
            <ChevronLeftIcon className="h-10 w-10" />
          </button>
        )}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between w-full gap-10 ">
          <div className="space-y-6 lg:w-1/2 w-full flex flex-col justify-center min-h-[350px] sm:min-h-[400px] lg:h-[450px]">
            <AnimatePresence mode="popLayout">
              <motion.div
                key={active}
                initial={isMounted && !firstLoad ? { opacity: 0, x: 500 } : false}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -500 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="space-y-6 w-full min-h-[250px] flex flex-col justify-center"
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
                    {slide.isOffer ? "View Package" : "See More"}
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="relative lg:w-1/2 flex justify-center items-center w-full min-h-[350px] sm:min-h-[450px] lg:h-[450px]">
            <AnimatePresence mode="popLayout">
              <motion.div
                key={active}
                initial={isMounted && !firstLoad ? { opacity: 0, x: 500 } : false}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -500 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="relative z-10 w-full flex justify-center"
              >
                <Image
                  src={slide.image.startsWith("http") || slide.image.startsWith("/") ? slide.image : `http://localhost:5000/${slide.image}`}
                  alt={slide.title}
                  width={620}
                  height={400}
                  className={`h-auto w-full max-w-[620px] object-contain lg:max-w-[500px] 2xl:max-w-none lg:scale-95 transition-all duration-500 ${slide.isOffer ? "cursor-pointer" : ""}`}
                  onClick={slide.isOffer ? handleSeeMore : undefined}
                  priority
                />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {total > 1 && (
          <button
            type="button"
            aria-label="Next slide"
            onClick={next}
            className="absolute right-5 top-1/2 -translate-y-1/2 text-white/70 transition-all hover:text-white hover:scale-110 hidden lg:flex z-20"
          >
            <ChevronRightIcon className="h-10 w-10" />
          </button>
        )}
      </div>

      {total > 1 && (
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
      )}
    </section>
  );
}
