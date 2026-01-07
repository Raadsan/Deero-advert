"use client";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CartHeader from "@/components/cart/CartHeader";
import CartItemsList from "@/components/cart/CartItems";
import CartSummary from "@/components/cart/CartSummary";
import CartSidebar from "@/components/cart/CartSidebar";
import { motion } from "framer-motion";

export default function CartPage() {
    return (
        <div className="min-h-screen bg-[#fafafa] text-[#1a1a1a] flex flex-col">
            <Header />

            <main className="flex-1 pt-[140px]">
                {/* Hero Section */}
                <CartHeader />

                {/* Dynamic Cart Layout */}
                <section className="py-12 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-7xl mx-auto">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                            {/* Left Column - Navigation/Categories (Desktop only or top on mobile) */}
                            <motion.aside
                                initial={{ opacity: 0, x: -30 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="lg:col-span-3 order-2 lg:order-1"
                            >
                                <CartSidebar />
                            </motion.aside>

                            {/* Middle Column - Cart Items List */}
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="lg:col-span-6 space-y-8 order-1 lg:order-2"
                            >
                                <CartItemsList />
                            </motion.div>

                            {/* Right Column - Order Summary sticky */}
                            <motion.aside
                                initial={{ opacity: 0, x: 30 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="lg:col-span-3 order-3"
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
