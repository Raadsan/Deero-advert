"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { getActiveApproaches } from "@/api-client/approachApi";
import { getImageUrl } from "@/utils/url";

export default function OurApproaches() {
    const [approaches, setApproaches] = useState<any[]>([]);

    useEffect(() => {
        const fetch = async () => {
            try {
                const res = await getActiveApproaches();
                if (res.success && res.data?.length > 0) {
                    setApproaches(res.data.map((a: any) => ({
                        ...a,
                        icon: a.icon ? getImageUrl(a.icon) : "",
                    })));
                }
            } catch (e) {
                console.error("Failed to fetch approaches", e);
            }
        };
        fetch();
    }, []);

    if (approaches.length === 0) return null;

    return (
        <section className="bg-white py-20 px-4">
            <div className="mx-auto max-w-7xl">
                <h2 className="text-3xl md:text-4xl font-bold text-[#651313] text-center mb-16 italic">Our Approaches</h2>
                <motion.div
                    initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }}
                    variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.12 } } }}
                    className="flex flex-wrap items-center justify-center gap-8 md:gap-12 lg:gap-16"
                >
                    {approaches.map((item) => (
                        <motion.div
                            key={item.id}
                            variants={{ hidden: { opacity: 0, x: -30 }, visible: { opacity: 1, x: 0, transition: { duration: 0.6 } } }}
                            className="flex flex-col items-center space-y-4"
                        >
                            <div className="relative w-24 h-24 md:w-32 md:h-32 transition-transform duration-300">
                                <motion.div whileHover={{ scale: 1.08 }} className="w-full h-full relative">
                                    {item.icon && <Image src={item.icon} alt={item.title} fill unoptimized className="object-contain" />}
                                </motion.div>
                            </div>
                            <span className="text-[#651313] font-semibold text-lg md:text-xl">{item.title}</span>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
