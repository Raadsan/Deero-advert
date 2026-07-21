"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { getActiveCoreValues } from "@/api-client/coreValueApi";
import { getImageUrl } from "@/utils/url";

export default function CoreValues() {
    const [coreValues, setCoreValues] = useState<any[]>([]);

    useEffect(() => {
        const fetch = async () => {
            try {
                const res = await getActiveCoreValues();
                if (res.success && res.data?.length > 0) {
                    setCoreValues(res.data.map((v: any) => ({
                        ...v,
                        icon: v.icon ? getImageUrl(v.icon) : "",
                    })));
                }
            } catch (e) {
                console.error("Failed to fetch core values", e);
            }
        };
        fetch();
    }, []);

    if (coreValues.length === 0) return null;

    return (
        <section className="bg-[#fce5d8] py-20 px-4">
            <div className="mx-auto max-w-6xl xl:max-w-7xl">
                <h2 className="text-3xl md:text-4xl font-bold text-[#651313] text-center mb-16 italic">Core Values</h2>
                <motion.div
                    initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }}
                    variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.12 } } }}
                    className="grid grid-cols-2 md:grid-cols-5 gap-6 md:gap-8 lg:gap-12"
                >
                    {coreValues.map((value) => (
                        <motion.div
                            key={value.id}
                            variants={{ hidden: { opacity: 0, x: -30 }, visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } } }}
                            whileHover={{ scale: 1.03, x: 6 }}
                            className="bg-white rounded-xl border-2 border-[#fdb494] p-8 flex flex-col items-center justify-center space-y-4 shadow-sm hover:shadow-md hover:bg-[#fff5f0] transition-shadow transition-colors duration-300"
                        >
                            {value.icon && (
                                <div className="relative w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24">
                                    <Image src={value.icon} alt={value.title} fill unoptimized className="object-contain" />
                                </div>
                            )}
                            <h3 className="text-[#651313] font-bold text-center text-sm md:text-base lg:text-lg leading-snug">{value.title}</h3>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
