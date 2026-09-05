"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Edit3, Globe, Server, ShoppingCart, BriefcaseBusiness } from "lucide-react";
import { useCart } from "@/context/CartContext";

const getIcon = (type: string) => {
    switch (type) {
        case 'domain': return <Globe className="w-5 h-5" />;
        case 'hosting': return <Server className="w-5 h-5" />;
        case 'service': return <BriefcaseBusiness className="w-5 h-5" />;
        default: return <ShoppingCart className="w-5 h-5" />;
    }
};

export default function CartItemsList() {
    const { cartItems, removeFromCart, clearCart } = useCart();

    if (cartItems.length === 0) {
        return (
            <div className="bg-white rounded-2xl p-12 shadow-sm border border-gray-100 text-center space-y-4">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto text-gray-300">
                    <ShoppingCart className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-bold text-[#651313]">Your cart is empty</h3>
                <p className="text-gray-500">Looks like you haven't added anything to your cart yet.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-[#651313]">Review &amp; Checkout</h2>

            <div className="space-y-4">
                <AnimatePresence>
                    {cartItems.map((item) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 hover:shadow-md transition-shadow"
                        >
                            <div className="flex items-start gap-4 flex-1">
                                <div className="w-12 h-12 rounded-xl bg-[#651313]/5 flex items-center justify-center text-[#651313] shrink-0">
                                    {getIcon(item.type)}
                                </div>
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-bold text-[#651313]">{item.title}</h3>
                                    </div>
                                    <p className="text-[#EB4724] font-medium">{item.subtitle}</p>
                                    <p className="text-sm text-gray-500">{item.options}</p>
                                    {item.renewalPrice && (
                                        <p className="text-xs text-gray-400">Renewal ${item.renewalPrice.toFixed(2)}/yr</p>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-8">
                                <div className="text-right">
                                    <p className="text-xl font-bold text-[#651313]">${item.price.toFixed(2)}</p>
                                    <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">USD</p>
                                </div>
                                <button
                                    onClick={() => removeFromCart(item.id)}
                                    className="p-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

        </div>
    );
}
