"use client";

import { ChevronRightIcon } from "@heroicons/react/24/solid";

export default function ContactForm() {
    return (
        <section className="bg-[#fce5d8] py-20 px-4">
            <div className="mx-auto max-w-4xl">
                {/* Title */}
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-[#651313] leading-tight">
                        We're Ready To Help You<br />
                        Send Us Message
                    </h2>
                </div>

                {/* Form */}
                <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10">
                        {/* Name */}
                        <div className="relative">
                            <label className="absolute -top-3 left-4 bg-white px-2 py-0.5 text-[#651313] text-xs font-bold rounded shadow-sm z-10">
                                Name
                            </label>
                            <input
                                type="text"
                                placeholder="Your Name"
                                className="w-full bg-white border border-transparent rounded-lg px-6 py-4 text-sm text-[#651313] focus:outline-none focus:border-[#EB4724] transition-colors shadow-sm"
                            />
                        </div>

                        {/* Email */}
                        <div className="relative">
                            <label className="absolute -top-3 left-4 bg-white px-2 py-0.5 text-[#651313] text-xs font-bold rounded shadow-sm z-10">
                                Email
                            </label>
                            <input
                                type="email"
                                placeholder="Enter Email"
                                className="w-full bg-white border border-transparent rounded-lg px-6 py-4 text-sm text-[#651313] focus:outline-none focus:border-[#EB4724] transition-colors shadow-sm"
                            />
                        </div>

                        {/* Phone */}
                        <div className="relative">
                            <label className="absolute -top-3 left-4 bg-white px-2 py-0.5 text-[#651313] text-xs font-bold rounded shadow-sm z-10">
                                Phone
                            </label>
                            <input
                                type="tel"
                                placeholder="Enter phone"
                                className="w-full bg-white border border-transparent rounded-lg px-6 py-4 text-sm text-[#651313] focus:outline-none focus:border-[#EB4724] transition-colors shadow-sm"
                            />
                        </div>

                        {/* Subject */}
                        <div className="relative">
                            <label className="absolute -top-3 left-4 bg-white px-2 py-0.5 text-[#651313] text-xs font-bold rounded shadow-sm z-10">
                                Subject
                            </label>
                            <input
                                type="text"
                                placeholder="Enter Subject"
                                className="w-full bg-white border border-transparent rounded-lg px-6 py-4 text-sm text-[#651313] focus:outline-none focus:border-[#EB4724] transition-colors shadow-sm"
                            />
                        </div>
                    </div>

                    {/* Message */}
                    <div className="relative">
                        <label className="absolute -top-3 left-4 bg-white px-2 py-0.5 text-[#651313] text-xs font-bold rounded shadow-sm z-10">
                            Message
                        </label>
                        <textarea
                            rows={6}
                            placeholder="Write Message"
                            className="w-full bg-white border border-transparent rounded-lg px-6 py-4 text-sm text-[#651313] focus:outline-none focus:border-[#EB4724] transition-colors shadow-sm resize-none"
                        ></textarea>
                    </div>

                    {/* Submit */}
                    <div className="flex justify-center pt-4">
                        <button className="bg-[#4d0e0e] text-white px-10 py-3.5 rounded-full font-bold flex items-center gap-2 hover:bg-[#651313] transition-colors group shadow-lg">
                            Send Message
                            <ChevronRightIcon className="h-4 w-4 text-white group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </form>
            </div>
        </section>
    );
}
