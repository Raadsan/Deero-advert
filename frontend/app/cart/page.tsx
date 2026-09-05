"use client";
export const dynamic = 'force-static';

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CartHeader from "@/components/cart/CartHeader";
import CartItemsList from "@/components/cart/CartItems";
import CartSummary from "@/components/cart/CartSummary";
import { motion } from "framer-motion";

export default function CartPage() {
    return (
        <div className="min-h-screen bg-[#fafafa] text-[#1a1a1a] flex flex-col">
            <Header />

            <main className="flex-1 pt-[110px] md:pt-[140px]">
                <CartHeader />

                <section className="py-12 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-5xl mx-auto">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                            {/* Cart Items */}
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="lg:col-span-8 space-y-8"
                            >
                                <CartItemsList />
                            </motion.div>

                            {/* Order Summary */}
                            <motion.aside
                                initial={{ opacity: 0, x: 30 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="lg:col-span-4"
                            >
                                <CartSummary />
                            </motion.aside>

                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
