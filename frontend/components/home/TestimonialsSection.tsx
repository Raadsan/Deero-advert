"use client";

import Image from "next/image";
import { StarIcon } from "@heroicons/react/24/solid";

const ratings = [
    {
        platform: "Google",
        logo: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg",
        rating: "5/5",
        stars: 5,
    },
    {
        platform: "facebook",
        logo: "https://upload.wikimedia.org/wikipedia/commons/0/05/Facebook_Logo_2023.png",
        rating: "5/5",
        stars: 5,
    },
];

const testimonials = [
    {
        id: 1,
        text: "We owe our business growth to Deero Advert's outstanding web, graphics design, and digital marketing services. Their team's understanding of our needs and industry helped us reach our goals with tailored, effective solutions.",
        name: "ABDIWAHAB A. ELMI",
        role: "Managing Director of Brawa",
        image: "/home-images/t-1.png",
    },
    {
        id: 2,
        text: "Deero Advert played a key role in the success of SIMAD University's 20th Anniversary. Their creativity and collaboration significantly boosted the branding and visibility of the event. We truly value their professionalism.",
        name: "Eng. Mohamed Mohamud",
        role: "SIMAD University",
        image: "/home-images/t-2.png",
    },
    {
        id: 3,
        text: "I'm deeply impressed by Deero Advert's dedication and results-driven work. Their professionalism, skill, and attention to detail truly exceeded my expectations. It was a pleasure working with such a talented team.",
        name: "ABDIRAHMAN H. DHIBLAWE",
        role: "Director SIMAD Institute",
        image: "/home-images/t-3.png",
    },
];

export default function TestimonialsSection() {
    return (
        <section className="bg-[#f8f8f8] py-20 px-4">
            <div className="mx-auto max-w-6xl">
                {/* Top Ratings Bar */}
                <div className="flex flex-wrap justify-center gap-8 mb-24">
                    {ratings.map((item, index) => (
                        <div key={index} className="bg-[#f0e9e7] rounded-xl p-6 flex items-center justify-between w-full md:w-[480px] shadow-sm hover:shadow-md transition duration-300">
                            <div className="flex flex-col gap-2">
                                <div className="h-6 relative w-24">
                                    <img src={item.logo} alt={item.platform} className="h-full object-contain object-left" />
                                </div>
                                <div className="flex gap-1">
                                    {[...Array(item.stars)].map((_, i) => (
                                        <StarIcon key={i} className="w-4 h-4 text-orange-400" />
                                    ))}
                                </div>
                            </div>
                            <div className="text-2xl font-bold text-[#651313]">{item.rating}</div>
                        </div>
                    ))}
                </div>

                {/* Section Title */}
                <h2 className="text-2xl font-bold text-[#651313] text-center mb-16 uppercase tracking-wider">Testimonials</h2>

                {/* Testimonial Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-0 relative">
                    {testimonials.map((item, index) => (
                        <div
                            key={item.id}
                            className={`p-10 flex flex-col items-center text-center bg-transparent relative
                                ${index !== 2 ? "md:border-r border-gray-200" : ""}
                            `}
                        >
                            <p className="text-gray-500 text-sm leading-relaxed mb-12 italic">
                                "{item.text}"
                            </p>

                            <div className="mt-auto flex flex-col items-center">
                                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#EB4724] mb-4">
                                    <Image
                                        src={item.image}
                                        alt={item.name}
                                        width={64}
                                        height={64}
                                        className="object-cover"
                                    />
                                </div>
                                <h4 className="text-[#651313] font-bold text-sm uppercase tracking-wide mb-1">{item.name}</h4>
                                <p className="text-gray-400 text-[10px] font-medium uppercase">{item.role}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
