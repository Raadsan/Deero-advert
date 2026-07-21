"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { getActiveHeroAbout } from "@/api-client/heroAboutApi";
import { getActiveVisionMissions } from "@/api-client/visionMissionApi";
import { getImageUrl } from "@/utils/url";

const formatDescription = (desc: string): string => {
    if (!desc?.trim()) return "";
    if (/<[a-z][\s\S]*>/i.test(desc)) return desc;
    return desc
        .split(/(?:\r?\n){2,}/)
        .filter(p => p.trim())
        .map(p => `<p>${p.trim()}</p>`)
        .join("");
};

export default function AboutContent() {
    const [heroData, setHeroData] = useState<{ watermarkImage: string; description: string } | null>(null);
    const [vmItems, setVmItems] = useState<any[]>([]);

    useEffect(() => {
        const fetchHero = async () => {
            try {
                const res = await getActiveHeroAbout();
                if (res.success && res.data) {
                    setHeroData({
                        watermarkImage: res.data.watermarkImage
                            ? res.data.watermarkImage.startsWith("http") || res.data.watermarkImage.startsWith("/")
                                ? res.data.watermarkImage
                                : `http://localhost:5000/${res.data.watermarkImage}`
                            : "",
                        description: res.data.description
                    });
                }
            } catch (error) {
                console.error("Failed to fetch hero about", error);
            }
        };

        const fetchVM = async () => {
            try {
                const res = await getActiveVisionMissions();
                if (res.success && res.data?.length > 0) {
                    setVmItems(res.data.map((item: any) => ({
                        ...item,
                        icon: item.icon ? getImageUrl(item.icon) : (item.type === "vision" ? "/home-images/Vis-01.svg" : "/home-images/Mis-01.svg"),
                    })));
                }
            } catch (error) {
                console.error("Failed to fetch vision/mission", error);
            }
        };

        fetchHero();
        fetchVM();
    }, []);

    const imageSrc = heroData?.watermarkImage || "/home-images/about-01.svg";

    return (
        <section className="bg-white py-20 px-4 sm:px-10">
            <div className="mx-auto max-w-6xl xl:max-w-7xl">
                <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
                    <div className="w-full lg:w-1/2 flex justify-center">
                        <div className="relative w-full max-w-[450px] aspect-square">
                            <Image src={imageSrc} alt="About Deero Advert" fill className="object-contain" priority />
                        </div>
                    </div>

                    <div className="w-full lg:w-1/2 space-y-8 lg:pr-9 xl:pr-0">
                        <div>
                            <h2 className="text-4xl md:text-5xl font-bold text-[#1a1a1a] mb-8">About Us</h2>
                            {heroData?.description && heroData.description.trim().length > 0 && (
                                <div
                                    className="text-gray-600 leading-relaxed text-lg text-justify [&_p]:mb-6 [&_p:last-child]:mb-0"
                                    dangerouslySetInnerHTML={{ __html: formatDescription(heroData.description) }}
                                />
                            )}
                        </div>
                    </div>
                </div>

                {vmItems.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-24">
                        {vmItems.map((item) => (
                            <div key={item.id} className="group bg-[#4d0e0e] rounded-2xl p-10 md:p-12 text-center text-white flex flex-col items-center space-y-6 shadow-xl transition hover:-translate-y-2 hover:bg-[#F7B5A7] hover:text-[#1a1a1a] duration-300">
                                <div className="relative w-24 h-24 md:w-28 md:h-28">
                                    <Image src={item.icon} alt={item.type} fill unoptimized className="object-contain" />
                                </div>
                                <h3 className="text-2xl font-bold capitalize group-hover:text-[#1a1a1a]">{item.type}</h3>
                                <p className="text-white/80 leading-relaxed max-w-sm group-hover:text-[#1a1a1a]">{item.content}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
