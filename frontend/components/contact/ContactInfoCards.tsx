"use client";

import { PhoneIcon, EnvelopeIcon, MapPinIcon } from "@heroicons/react/24/solid";

const contactDetails = [
    {
        title: "Phone",
        details: ["+252 618 553566,", "+252 61 8553633"],
        icon: PhoneIcon,
    },
    {
        title: "Email Us",
        details: ["sales@advert.deero.so", "marketing@advert.deero.so", "info@advert.deero.so"],
        icon: EnvelopeIcon,
    },
    {
        title: "Address",
        details: ["HQ Digfeer, Hodan Mogadishu-Somalia", "Shaqaalaha Mogadishu-Somalia"],
        icon: MapPinIcon,
    },
];

export default function ContactInfoCards() {
    return (
        <section className="bg-[#fce5d8] py-24 px-4 -mt-12 group">
            <div className="mx-auto max-w-6xl">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {contactDetails.map((item, index) => (
                        <div
                            key={index}
                            className="bg-[#EB4724] rounded-2xl p-10 pt-16 relative shadow-2xl transition hover:-translate-y-2 duration-300"
                        >
                            {/* Icon Circle */}
                            <div className="absolute top-0 left-10 -translate-y-1/2 w-16 h-16 bg-[#4d0e0e] rounded-full flex items-center justify-center shadow-lg border-4 border-[#EB4724]">
                                <item.icon className="h-7 w-7 text-white" />
                            </div>

                            <h3 className="text-white text-2xl font-bold mb-6">{item.title}</h3>

                            <div className="space-y-2">
                                {item.details.map((detail, idx) => (
                                    <p key={idx} className="text-white/90 text-sm font-medium">
                                        {detail}
                                    </p>
                                ))}
                            </div>

                            {/* Decorative Line */}
                            <div className="mt-6 w-full h-px bg-white/20"></div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
