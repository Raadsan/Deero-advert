"use client";

import { useState } from "react";
import { PaperAirplaneIcon } from "@heroicons/react/24/solid";
import { createContact } from "../../api/contactApi";

export default function ContactForm() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: ""
    });
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<{ type: 'success' | 'error' | null, message: string }>({ type: null, message: "" });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear status when user starts typing again
        if (status.type) setStatus({ type: null, message: "" });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setStatus({ type: null, message: "" });

        try {
            const response = await createContact(formData);
            if (response.data.success) {
                setStatus({ type: 'success', message: "Message sent successfully! We'll get back to you soon." });
                setFormData({
                    name: "",
                    email: "",
                    phone: "",
                    subject: "",
                    message: ""
                });
            } else {
                setStatus({ type: 'error', message: response.data.message || "Failed to send message" });
            }
        } catch (error: any) {
            console.error("Contact form error:", error);
            setStatus({ type: 'error', message: error.response?.data?.message || "Something went wrong. Please try again." });
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="bg-[#f5f5f7] py-16 sm:py-24 px-4">
            <div className="mx-auto max-w-4xl">
                {/* Title */}
                <div className="text-center mb-12">
                    <h2 className="text-4xl sm:text-5xl font-bold text-[#4d0e0e] mb-3">
                        Send us a message
                    </h2>
                    <p className="text-[#651313]/70 text-base sm:text-lg">
                        We'd love to hear from you. Fill out the form below and we'll get back to you soon.
                    </p>
                </div>

                {/* Form Card */}
                <div className="bg-white rounded-3xl shadow-2xl shadow-[#651313]/10 p-8 sm:p-12">
                    {/* Status Message */}
                    {status.type && (
                        <div className={`mb-8 p-4 rounded-xl text-center font-bold ${status.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                            }`}>
                            {status.message}
                        </div>
                    )}

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {/* Name and Email Row */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Name */}
                            <div>
                                <label className="block text-[#4d0e0e] font-bold text-sm mb-2">
                                    Name <span className="text-[#EB4724]">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Enter your name"
                                    className="w-full bg-[#f8f9fa] border-2 border-[#e0e0e0] rounded-xl px-5 py-3.5 text-[#4d0e0e] placeholder:text-gray-400 focus:outline-none focus:border-[#EB4724] focus:bg-white transition-all"
                                    required
                                />
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-[#4d0e0e] font-bold text-sm mb-2">
                                    Email <span className="text-[#EB4724]">*</span>
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="Enter your email"
                                    className="w-full bg-[#f8f9fa] border-2 border-[#e0e0e0] rounded-xl px-5 py-3.5 text-[#4d0e0e] placeholder:text-gray-400 focus:outline-none focus:border-[#EB4724] focus:bg-white transition-all"
                                    required
                                />
                            </div>
                        </div>

                        {/* Phone and Subject Row */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Phone */}
                            <div>
                                <label className="block text-[#4d0e0e] font-bold text-sm mb-2">
                                    Phone <span className="text-[#EB4724]">*</span>
                                </label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="Enter your phone"
                                    className="w-full bg-[#f8f9fa] border-2 border-[#e0e0e0] rounded-xl px-5 py-3.5 text-[#4d0e0e] placeholder:text-gray-400 focus:outline-none focus:border-[#EB4724] focus:bg-white transition-all"
                                    required
                                />
                            </div>

                            {/* Subject */}
                            <div>
                                <label className="block text-[#4d0e0e] font-bold text-sm mb-2">
                                    Subject <span className="text-[#EB4724]">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    placeholder="Enter subject"
                                    className="w-full bg-[#f8f9fa] border-2 border-[#e0e0e0] rounded-xl px-5 py-3.5 text-[#4d0e0e] placeholder:text-gray-400 focus:outline-none focus:border-[#EB4724] focus:bg-white transition-all"
                                    required
                                />
                            </div>
                        </div>

                        {/* Message */}
                        <div>
                            <label className="block text-[#4d0e0e] font-bold text-sm mb-2">
                                Message <span className="text-[#EB4724]">*</span>
                            </label>
                            <textarea
                                rows={6}
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                placeholder="Enter your message"
                                className="w-full bg-[#f8f9fa] border-2 border-[#e0e0e0] rounded-xl px-5 py-3.5 text-[#4d0e0e] placeholder:text-gray-400 focus:outline-none focus:border-[#EB4724] focus:bg-white transition-all resize-none"
                                required
                            ></textarea>
                        </div>

                        {/* Submit Button */}
                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full bg-gradient-to-r from-[#4d0e0e] via-[#651313] to-[#EB4724] text-white font-bold text-lg py-4 rounded-xl hover:shadow-2xl hover:shadow-[#EB4724]/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-3 group ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                            >
                                <span>{loading ? 'Sending...' : 'Submit'}</span>
                                {!loading && <PaperAirplaneIcon className="h-5 w-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    );
}
