"use client";

import Image from "next/image";
import { CheckIcon } from "@heroicons/react/24/outline";
import { Service } from "@/api-client/serviceApi";
import { getUser, isAdminOrManager } from "@/utils/auth";

interface DigitalConsultingSectionProps {
    service: Service;
    onPurchase: (pkg: any, service: Service) => void;
}

export default function DigitalConsultingSection({ service, onPurchase }: DigitalConsultingSectionProps) {
    const pkg = service.packages?.[0]; // Show the first package for this featured design

    const getDiscountedPrice = (p: any, s: Service) => {
        const user = getUser();
        const basePrice = p?.price || 0;

        if (!user || !user.discounts) {
            return { finalPrice: basePrice, discount: 0, hasDiscount: false };
        }

        const serviceId = s._id || (s as any).id;
        const packageId = p._id || p.id;

        const applicableDiscounts = user.discounts.filter((d: any) => {
            const isTargetMatch = d.targetType === "service" &&
                (String(d.targetId) === String(serviceId) || String(d.targetId) === String(packageId) || d.targetId === "all");

            const now = new Date();
            const isDateValid = (!d.startDate || new Date(d.startDate) <= now) &&
                (!d.endDate || new Date(d.endDate) >= now);

            return isTargetMatch && isDateValid && d.status === "active";
        });

        if (applicableDiscounts.length === 0) return { finalPrice: basePrice, discount: 0, hasDiscount: false };

        let bestPrice = basePrice;
        let appliedDiscount = 0;

        applicableDiscounts.forEach((d: any) => {
            let currentDiscount = 0;
            if (d.discountType === "percentage") {
                currentDiscount = basePrice * (d.discountValue / 100);
            } else if (d.discountType === "fixed") {
                currentDiscount = d.discountValue;
            }
            const currentPrice = basePrice - currentDiscount;
            if (currentPrice < bestPrice) {
                bestPrice = currentPrice;
                appliedDiscount = currentDiscount;
            }
        });

        return {
            finalPrice: bestPrice > 0 ? bestPrice : 0,
            discount: appliedDiscount,
            hasDiscount: appliedDiscount > 0
        };
    };

    const { finalPrice, discount, hasDiscount } = getDiscountedPrice(pkg, service);

    // In case there's no diagnostic package, but ideally there should be
    if (!pkg) return null;

    return (
        <section id="digital-consulting" className="bg-[#fcd7c3] py-20 px-4 md:px-8 lg:px-16 overflow-hidden">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
                    {/* Left Side: Image Only */}
                    <div className="relative w-full max-w-[420px] flex items-center justify-center">
                        <div className="relative w-full aspect-square">
                            <Image
                                src="/home-images/digital-consulting.png"
                                alt="Digital Consulting"
                                fill
                                className="object-contain"
                            />
                        </div>
                    </div>

                    {/* Right Side: Content */}
                    <div className="flex-1 text-[#4d0e0e] text-left">
                        <div className="mb-4">
                            <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-[#4d0e0e] flex flex-wrap items-center gap-x-3 gap-y-2">
                                <span>{pkg.packageTitle}</span>
                                <div className="flex items-center gap-2">
                                    {hasDiscount && (
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-bold text-gray-400 line-through">
                                                ${pkg.price.toFixed(2)}
                                            </span>
                                            <span className="bg-[#EB4724]/10 text-[#EB4724] text-[10px] font-bold px-2 py-0.5 rounded-full">
                                                -{((discount / pkg.price) * 100).toFixed(0)}% OFF
                                            </span>
                                        </div>
                                    )}
                                    <span className="text-[#EB4724] text-3xl sm:text-4xl font-black">${finalPrice.toFixed(2)}</span>
                                </div>
                            </h3>
                        </div>

                        <ul className="space-y-4 mb-12">
                            {pkg.features.map((feature, index) => (
                                <li key={index} className="flex items-start gap-4">
                                    <CheckIcon className="w-5 h-5 text-[#4d0e0e] stroke-[3] mt-0.5 shrink-0" />
                                    <p className="text-base font-bold leading-snug">
                                        {feature}
                                    </p>
                                </li>
                            ))}
                        </ul>

                        <button
                            onClick={() => onPurchase(pkg, service)}
                            className="w-full sm:w-auto py-4 px-10 rounded-xl bg-[#651313] text-white font-bold text-sm uppercase tracking-widest hover:brightness-110 active:scale-95 transition-all shadow-lg border-none"
                        >
                            Purchase Plan
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}

