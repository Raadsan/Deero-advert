"use client";

import { motion } from "framer-motion";
import { ArrowRight, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";

export default function CartSummary() {
    const { cartTotal } = useCart();
    const subtotal = cartTotal;
    const total = cartTotal;

    return (
        <div className="sticky top-[140px] space-y-6">
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 overflow-hidden relative">
                {/* Decorative background */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#EB4724]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

                <h3 className="text-xl font-bold text-[#651313] mb-8 flex items-center gap-2">
                    <ShoppingBag className="w-5 h-5 text-[#EB4724]" />
                    Order Summary
                </h3>

                <div className="space-y-4 mb-8">
                    <div className="flex justify-between items-center text-gray-500 text-sm">
                        <span>Subtotal</span>
                        <span className="font-bold text-[#651313]">${subtotal.toFixed(2)} USD</span>
                    </div>
                    <div className="flex justify-between items-center text-gray-500 text-sm">
                        <span>Totals</span>
                        <span className="font-bold text-[#651313]">${total.toFixed(2)} USD</span>
                    </div>
                    <div className="text-right pb-4">
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Annually</p>
                    </div>

                    <div className="pt-6 border-t border-[#EB4724]/20 text-center">
                        <p className="text-sm font-semibold text-[#651313]/60 mb-1">Total Due Today</p>
                        <p className="text-4xl font-black text-[#651313] tracking-tight">${total.toFixed(2)} <span className="text-sm">USD</span></p>
                    </div>
                </div>

                <Link
                    href="/checkout"
                    className="w-full bg-[#EB4724] text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#d13d1d] transition-all shadow-lg hover:shadow-xl active:scale-95 duration-200 group"
                >
                    Checkout
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                    href="/"
                    className="w-full mt-4 flex items-center justify-center gap-2 text-sm font-bold text-[#651313]/60 hover:text-[#651313] transition-colors"
                >
                    <span className="rotate-180 inline-block">
                        <ArrowRight className="w-4 h-4" />
                    </span>
                    Continue Shopping
                </Link>
            </div>
        </div>
    );
}
