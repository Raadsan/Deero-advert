"use client";

import CartHeader from "@/components/cart/CartHeader";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CheckoutForm from "@/components/checkout/CheckoutForm";
import { motion } from "framer-motion";

export default function CheckoutPage() {
    return (
        <main className="min-h-screen bg-[#fcfcfc]">
            <Header />
            <div className="pt-[140px]">
                <CartHeader currentStep={2} />
            </div>

            <div className="max-w-4xl mx-auto px-4 py-16">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <CheckoutForm />
                </motion.div>
            </div>

            <Footer />
        </main>
    );
}
