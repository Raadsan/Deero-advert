"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ShoppingBag, CreditCard, X, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { getCompanyContacts } from "@/api-client/companyContactApi";

// Crisp WhatsApp SVG Icon
function WhatsAppIcon({ className = "w-5 h-5" }: { className?: string }) {
    return (
        <svg
            className={className}
            viewBox="0 0 24 24"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.888 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.455 5.71 1.457h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
    );
}

export default function CartSummary() {
    const { cartTotal, cartItems } = useCart();
    const router = useRouter();
    const subtotal = cartTotal;
    const total = cartTotal;

    const [isOptionsModalOpen, setIsOptionsModalOpen] = useState(false);
    const [whatsappNumber, setWhatsappNumber] = useState<string>("+252618553633");

    // Fetch dynamic WhatsApp contact from backend company contacts
    useEffect(() => {
        const fetchContacts = async () => {
            try {
                const res = await getCompanyContacts();
                const contacts = res?.data || [];
                // Look for whatsapp type first, then phone type
                const wa = contacts.find((c: any) => c.type === "whatsapp");
                const phone = contacts.find((c: any) => c.type === "phone");
                const found = wa?.value || phone?.value;
                if (found) {
                    const cleaned = String(found).replace(/[^0-9]/g, "");
                    if (cleaned.length > 5) {
                        setWhatsappNumber(cleaned);
                    }
                }
            } catch (err) {
                console.warn("CartSummary: Could not fetch company contacts for WhatsApp", err);
            }
        };
        fetchContacts();
    }, []);

    // Generate prefilled WhatsApp URL with formatted cart details
    const getWhatsAppUrl = () => {
        if (!cartItems || cartItems.length === 0) {
            const defaultMsg = `Asc Deero Advert, waxaan rabaa inaan dalbado adeegyada shirkadda. Wadarta: $${total.toFixed(2)} USD.`;
            return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(defaultMsg)}`;
        }

        const itemsList = cartItems
            .map(
                (item, idx) =>
                    `${idx + 1}. *${item.title}*${item.subtitle ? ` (${item.subtitle})` : ""} - $${Number(item.price).toFixed(2)} USD`
            )
            .join("\n");

        const message =
            `*DALAB CUSUB - DEERO ADVERT*\n\n` +
            `Asc, waxaan rabaa inaan dalbado adeegyadan soo socda:\n\n` +
            `${itemsList}\n\n` +
            `*Wadarta Guud: $${total.toFixed(2)} USD*\n\n` +
            `Fadlan ila soo xiriira si aan u dhamaystiro bixinta iyo helitaanka adeegga. Mahadsanidiin!`;

        return `https://wa.me/252618553839?text=${encodeURIComponent(message)}`;
    };

    const handleWhatsAppCheckout = () => {
        const url = getWhatsAppUrl();
        window.open(url, "_blank");
        setIsOptionsModalOpen(false);
    };

    const handleBuyNowCheckout = () => {
        setIsOptionsModalOpen(false);
        router.push("/checkout");
    };

    return (
        <>
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
                            <p className="text-4xl font-black text-[#651313] tracking-tight">
                                ${total.toFixed(2)} <span className="text-sm">USD</span>
                            </p>
                        </div>
                    </div>

                    {/* Main Checkout Trigger - Opens Modal with 2 Options */}
                    <button
                        type="button"
                        onClick={() => setIsOptionsModalOpen(true)}
                        className="w-full bg-[#EB4724] text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#d13d1d] transition-all shadow-lg hover:shadow-xl active:scale-95 duration-200 group"
                    >
                        <span>Checkout</span>
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>


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

            {/* 2-Option Checkout Modal */}
            <AnimatePresence>
                {isOptionsModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 10 }}
                            transition={{ duration: 0.2 }}
                            className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-gray-100 overflow-hidden relative"
                        >
                          

                          

                            {/* Two Options */}
                            <div className="p-6 space-y-4">
                                {/* Option 1: Buy Now (Direct Website Checkout) */}
                                <button
                                    type="button"
                                    onClick={handleBuyNowCheckout}
                                    className="w-full text-left p-4 rounded-xl border-2 border-[#EB4724] hover:bg-[#EB4724]/5 transition-all group flex items-center gap-4 relative"
                                >
                                    <div className="p-3 rounded-xl bg-[#EB4724] text-white shrink-0 group-hover:scale-105 transition-transform shadow-md">
                                        <CreditCard className="w-6 h-6" />
                                    </div>
                                    <div className="flex-1 min-w-0 pr-6">
                                        <div className="flex items-center gap-2">
                                            <h4 className="font-bold text-[#651313] text-base group-hover:text-[#EB4724] transition-colors">
                                                Buy Now (Direct Checkout)
                                            </h4>
                                        </div>
                                    </div>
                                </button>

                                {/* Option 2: WhatsApp Checkout */}
                                <button
                                    type="button"
                                    onClick={handleWhatsAppCheckout}
                                    className="w-full  text-left p-4 rounded-xl border-2 border-[#25D366] hover:bg-[#25D366]/5 transition-all group flex items-center gap-4 relative"
                                >
                                    <div className="p-3 rounded-xl bg-[#25D366] text-white shrink-0 group-hover:scale-105 transition-transform shadow-md">
                                        <WhatsAppIcon className="w-6 h-6 fill-white" />
                                    </div>
                                    <div className="flex-1 min-w-0 pr-6">
                                            <h4 className="font-bold text-gray-900 text-base group-hover:text-[#1da851] transition-colors">
                                                Order via WhatsApp
                                            </h4>
                                        
                                      
                                    </div>
                                </button>
                            </div>

                            {/* Footer */}
                            <div className="px-6 py-3 bg-gray-50 border-t border-gray-100 text-center">
                                <button
                                    type="button"
                                    onClick={() => setIsOptionsModalOpen(false)}
                                    className="text-xs font-semibold text-gray-500 hover:text-gray-800 transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
}
