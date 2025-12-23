"use client";

import Image from "next/image";

export default function AboutContent() {
    return (
        <section className="bg-white py-20 px-4">
            <div className="mx-auto max-w-6xl">
                <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
                    {/* Left side: Illustration */}
                    <div className="w-full lg:w-1/2 flex justify-center">
                        <div className="relative w-full max-w-[450px] aspect-square">
                            <Image
                                src="/home-images/about-01.svg"
                                alt="About Deero Advert"
                                fill
                                className="object-contain"
                                priority
                            />
                        </div>
                    </div>

                    {/* Right side: Text content */}
                    <div className="w-full lg:w-1/2 space-y-8">
                        <div>
                            <h2 className="text-4xl md:text-5xl font-bold text-[#1a1a1a] mb-8">
                                About Us
                            </h2>
                            <p className="text-gray-600 leading-relaxed text-lg mb-6">
                                Deero Advertising Agency is one of the innovative digital service providers in Somalia,
                                founded in 2019 to offer a wide range of digital creative services. deero Advert is the first
                                advertising company that provides a wide variety of one-stop digital creative services
                                (1-stop agency: marketing, creative, web, and video) in Somalia.
                            </p>
                            <p className="text-gray-600 leading-relaxed text-lg">
                                Deero always aims to exceed expectations and deliver results that are based on our clients
                                marketing objectives while overall enhancing their brands. Deero helps businesses keep
                                up with the digital transformation and capitalize on new markets and opportunities.
                                We are pleased with our capacity to combine creativity and efficiency to provide our
                                clients with top-notch services.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Vision & Mission Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-24">
                    {/* Vision Card */}
                    <div className="bg-[#4d0e0e] rounded-2xl p-10 md:p-12 text-center text-white flex flex-col items-center space-y-6 shadow-xl transition hover:-translate-y-2 duration-300">
                        <div className="relative w-24 h-24 md:w-28 md:h-28">
                            <Image
                                src="/home-images/Vis-01.svg"
                                alt="Vision Icon"
                                fill
                                className="object-contain"
                            />
                        </div>
                        <h3 className="text-2xl font-bold">Vision</h3>
                        <p className="text-white/80 leading-relaxed max-w-sm">
                            To provide quality, innovative & high-value service to customers locally and worldwide.
                        </p>
                    </div>

                    {/* Mission Card */}
                    <div className="bg-[#4d0e0e] rounded-2xl p-10 md:p-12 text-center text-white flex flex-col items-center space-y-6 shadow-xl transition hover:-translate-y-2 duration-300">
                        <div className="relative w-24 h-24 md:w-28 md:h-28">
                            <Image
                                src="/home-images/Mis-01.svg"
                                alt="Mission Icon"
                                fill
                                className="object-contain"
                            />
                        </div>
                        <h3 className="text-2xl font-bold">Mission</h3>
                        <p className="text-white/80 leading-relaxed max-w-sm">
                            To provide quality services that exceeds the expectations of our esteemed customers
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
