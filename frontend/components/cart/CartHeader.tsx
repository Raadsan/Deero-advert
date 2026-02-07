"use client";

import { motion } from "framer-motion";

export default function CartHeader({ currentStep = 1 }: { currentStep?: number }) {
    return (
        <section className="relative bg-[#651313] py-20 px-4 overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#EB4724] rounded-full blur-[120px] opacity-20 -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full blur-[100px] opacity-10 translate-y-1/2 -translate-x-1/2"></div>

            <div className="max-w-7xl mx-auto relative z-10 text-center">
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-4xl md:text-5xl font-bold text-white mb-6"
                >
                    Shopping Cart
                </motion.h1>

                {/* Progress Steps */}
                <div className="flex items-center justify-center gap-4 text-white/60 font-medium overflow-x-auto pb-4 sm:pb-0">
                    <div className={`flex items-center gap-2 ${currentStep === 1 ? 'text-white' : ''}`}>
                        <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${currentStep === 1 ? 'bg-[#EB4724]' : 'bg-white/10'}`}>1</span>
                        <span>Shopping Cart</span>
                    </div>
                    <div className="w-8 sm:w-12 h-px bg-white/20 shrink-0"></div>
                    <div className={`flex items-center gap-2 ${currentStep === 2 ? 'text-white' : ''}`}>
                        <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${currentStep === 2 ? 'bg-[#EB4724]' : 'bg-white/10'}`}>2</span>
                        <span>Checkout</span>
                    </div>
                    <div className="w-8 sm:w-12 h-px bg-white/20 shrink-0"></div>
                    <div className={`flex items-center gap-2 ${currentStep === 3 ? 'text-white' : ''}`}>
                        <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${currentStep === 3 ? 'bg-[#EB4724]' : 'bg-white/10'}`}>3</span>
                        <span>Success</span>
                    </div>
                </div>
            </div>
        </section>
    );
}

