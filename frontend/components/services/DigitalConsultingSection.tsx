"use client";

import Image from "next/image";
import { CheckIcon } from "@heroicons/react/24/outline";
import { Service } from "@/api/serviceApi";

interface DigitalConsultingSectionProps {
    service: Service;
    onPurchase: (pkg: any, service: Service) => void;
}

export default function DigitalConsultingSection({ service, onPurchase }: DigitalConsultingSectionProps) {
    const pkg = service.packages?.[0]; // Show the first package for this featured design

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
                                src="/home-images/digital consulting.png"
                                alt="Digital Consulting"
                                fill
                                className="object-contain"
                            />
                        </div>
                    </div>

                    {/* Right Side: Content */}
                    <div className="flex-1 text-[#4d0e0e] text-left">
                        <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-8 text-[#4d0e0e] whitespace-nowrap">
                            {pkg.packageTitle} <span className="text-[#EB4724]">${pkg.price}</span>
                        </h3>

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
                            className="px-10 py-4 rounded-xl bg-[#616b7a] text-white font-bold text-xl border-2 border-white hover:bg-[#4a5361] active:scale-95 transition-all shadow-xl"
                        >
                            Purchase Plan
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}
