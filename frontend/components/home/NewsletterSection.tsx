"use client";

import { motion } from "framer-motion";

const WhatsAppIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984 0 1.758.459 3.474 1.33 4.982l-1.413 5.161 5.283-1.386c1.455.794 3.097 1.213 4.787 1.214h.003c5.507 0 9.99-4.478 9.99-9.985 0-2.667-1.039-5.176-2.924-7.062a9.923 9.923 0 0 0-7.066-2.928zm5.626 14.162c-.234.658-1.157 1.205-1.879 1.261-.497.039-1.144.184-3.328-.72-2.793-1.156-4.595-4.004-4.735-4.188-.139-.184-1.129-1.503-1.129-2.868 0-1.364.714-2.036.969-2.316.255-.28.558-.35.744-.35.186 0 .372.002.535.01.173.008.406-.065.635.485.234.561.792 1.932.861 2.073.069.14.116.304.023.49-.093.185-.139.302-.278.465-.139.163-.292.365-.418.49-.139.14-.284.292-.122.57.162.278.72 1.189 1.547 1.926 1.063.948 1.96 1.242 2.238 1.381.278.139.441.116.604-.07.162-.186.697-.813.882-1.092.185-.278.371-.232.627-.139.255.093 1.626.766 1.905.905.278.14.464.21.534.325.069.117.069.674-.165 1.332z"/>
  </svg>
);

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function NewsletterSection() {
    const handleWhatsApp = () => {
        window.open("https://wa.me/252618553839", "_blank", "noopener,noreferrer");
    };

    return (
        <section className="py-8 px-4 sm:px-10 overflow-hidden relative">
            <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={containerVariants}
                className="mx-auto max-w-4xl relative z-10"
            >
                <div className="bg-gradient-to-br from-[#4A0D13] via-[#651313] to-[#4A0D13] rounded-3xl p-6 sm:p-8 md:p-9 border border-white/10 shadow-2xl flex flex-col items-center justify-center text-center">
                    
                    {/* Top White Badge with Dark Icon */}
                    <motion.div variants={itemVariants} className="mb-4">
                        <div className="w-11 h-11 sm:w-12 sm:h-12 bg-white rounded-xl flex items-center justify-center shadow-md">
                            <WhatsAppIcon className="w-6 h-6 sm:w-7 sm:h-7 text-[#4A0D13]" />
                        </div>
                    </motion.div>

                    {/* Title */}
                    <motion.h2
                        variants={itemVariants}
                        className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white mb-2 tracking-tight leading-tight max-w-xl"
                    >
                        Ready to start your journey?
                    </motion.h2>

                    {/* Subtitle */}
                    <motion.p
                        variants={itemVariants}
                        className="text-white/80 text-sm sm:text-base md:text-lg max-w-lg mb-5 leading-relaxed font-medium"
                    >
                        Let's work together to make your brand stand out.
                    </motion.p>

                    {/* Button */}
                    <motion.div variants={itemVariants}>
                        <button
                            type="button"
                            onClick={handleWhatsApp}
                            className="px-9 py-3.5 sm:px-10 sm:py-3.5 bg-[#EB4724] hover:bg-[#d63d1f] text-white font-bold text-base sm:text-lg rounded-2xl transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 inline-flex items-center gap-3"
                        >
                            <span>Contact Us Now</span>
                        </button>
                    </motion.div>

                </div>
            </motion.div>
        </section>
    );
}
