"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { EnvelopeIcon, CheckCircleIcon } from "@heroicons/react/24/outline";

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export default function NewsletterSection() {
    const [email, setEmail] = useState("");
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (email) {
            setIsSubmitted(true);
            // Here you would typically send the email to your backend
            setTimeout(() => {
                setIsSubmitted(false);
                setEmail("");
            }, 3000);
        }
    };

    return (
        <section className=" py-20 px-4 sm:px-10 overflow-hidden relative">
            {/* Decorative Background Elements */}
            <div className="absolute inset-0 opacity-10 pointer-events-none">
                <div className="absolute top-10 left-10 w-32 h-32 rounded-full border border-white/20"></div>
                <div className="absolute bottom-10 right-10 w-40 h-40 rounded-full border border-white/20"></div>
                <div className="absolute top-1/2 left-1/4 w-24 h-24 rounded-full border border-white/20"></div>
            </div>

            <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={containerVariants}
                className="mx-auto max-w-4xl relative z-10"
            >
                <div className="bg-gradient-to-br from-[#4d0e0e] via-[#651313] to-[#4d0e0e] backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-white/10 shadow-2xl">
                    <motion.div variants={itemVariants} className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#EB4724]/20 mb-6">
                            <EnvelopeIcon className="w-8 h-8 text-[#EB4724]" />
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                            Stay Updated with Our Newsletter
                        </h2>
                        <p className="text-white/80 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
                            Get the latest updates on our creative campaigns, industry insights, 
                            and exclusive offers delivered straight to your inbox.
                        </p>
                    </motion.div>

                    <motion.form
                        variants={itemVariants}
                        onSubmit={handleSubmit}
                        className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto"
                    >
                        <div className="flex-1 relative">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email address"
                                required
                                className="w-full px-6 py-4 pr-12 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-[#EB4724] focus:border-transparent transition-all duration-300"
                            />
                            <EnvelopeIcon className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                        </div>
                        <button
                            type="submit"
                            disabled={isSubmitted}
                            className="px-8 py-4 bg-[#EB4724] text-white font-bold rounded-xl hover:bg-[#d63d1f] active:scale-95 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed whitespace-nowrap flex items-center justify-center gap-2"
                        >
                            {isSubmitted ? (
                                <>
                                    <CheckCircleIcon className="w-5 h-5" />
                                    <span>Subscribed!</span>
                                </>
                            ) : (
                                <span>Subscribe Now</span>
                            )}
                        </button>
                    </motion.form>

                    {isSubmitted && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-6 text-center"
                        >
                            <p className="text-[#EB4724] font-medium text-sm">
                                Thank you for subscribing! Check your email for confirmation.
                            </p>
                        </motion.div>
                    )}

                    <motion.p
                        variants={itemVariants}
                        className="text-white/60 text-xs text-center mt-6"
                    >
                        We respect your privacy. Unsubscribe at any time.
                    </motion.p>
                </div>
            </motion.div>
        </section>
    );
}

