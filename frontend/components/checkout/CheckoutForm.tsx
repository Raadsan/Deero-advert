"use client";

import { useState } from "react";
import {
    User, Mail, Phone, Building2, MapPin, Globe,
    Lock, RefreshCw, ChevronDown, CheckCircle2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/context/CartContext";

export default function CheckoutForm() {
    const { cartTotal } = useCart();
    const [paymentMethod, setPaymentMethod] = useState<'mail' | 'waafi'>('mail');
    const [isExistingCustomer, setIsExistingCustomer] = useState(false);

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-[#f8fafc] p-6 rounded-2xl border border-gray-100 gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-[#651313]">Checkout</h2>
                    <p className="text-gray-500 text-sm mt-1">Please enter your personal details and billing information to checkout.</p>
                </div>
                <button
                    onClick={() => setIsExistingCustomer(!isExistingCustomer)}
                    className={`${isExistingCustomer ? 'bg-[#ffc107] hover:bg-[#e0a800]' : 'bg-[#0e94a8] hover:bg-[#0c7d8e]'} text-[#1a1a1a] sm:text-white px-6 py-2.5 rounded-lg font-bold transition-all shadow-sm active:scale-95 whitespace-nowrap`}
                    style={{ color: isExistingCustomer ? '#000' : '#fff' }}
                >
                    {isExistingCustomer ? 'Create a New Account' : 'Already Registered?'}
                </button>
            </div>

            <AnimatePresence mode="wait">
                {!isExistingCustomer ? (
                    <motion.div
                        key="new-account"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="space-y-8"
                    >
                        {/* Personal Information */}
                        <section className="space-y-6">
                            <div className="flex items-center gap-4">
                                <h3 className="font-bold text-[#651313] whitespace-nowrap">Personal Information</h3>
                                <div className="h-px bg-gray-100 flex-1 border-t border-dashed border-[#651313]/20"></div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="relative group">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#EB4724] transition-colors">
                                        <User className="w-5 h-5" />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="First Name"
                                        className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-xl focus:border-[#EB4724] focus:ring-4 focus:ring-[#EB4724]/5 outline-none transition-all placeholder:text-gray-400"
                                    />
                                </div>
                                <div className="relative group">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#EB4724] transition-colors">
                                        <User className="w-5 h-5" />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Last Name"
                                        className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-xl focus:border-[#EB4724] focus:ring-4 focus:ring-[#EB4724]/5 outline-none transition-all placeholder:text-gray-400"
                                    />
                                </div>
                                <div className="relative group">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#EB4724] transition-colors">
                                        <Mail className="w-5 h-5" />
                                    </div>
                                    <input
                                        type="email"
                                        placeholder="Email Address"
                                        className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-xl focus:border-[#EB4724] focus:ring-4 focus:ring-[#EB4724]/5 outline-none transition-all placeholder:text-gray-400"
                                    />
                                </div>
                                <div className="relative group">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#EB4724] transition-colors">
                                        <Phone className="w-5 h-5" />
                                    </div>
                                    <input
                                        type="tel"
                                        placeholder="Phone Number"
                                        className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-xl focus:border-[#EB4724] focus:ring-4 focus:ring-[#EB4724]/5 outline-none transition-all placeholder:text-gray-400"
                                    />
                                </div>
                            </div>
                        </section>

                        {/* Billing Address */}
                        <section className="space-y-6">
                            <div className="flex items-center gap-4">
                                <h3 className="font-bold text-[#651313] whitespace-nowrap">Billing Address</h3>
                                <div className="h-px bg-gray-100 flex-1 border-t border-dashed border-[#651313]/20"></div>
                            </div>

                            <div className="space-y-4">
                                <div className="relative group">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#EB4724] transition-colors">
                                        <Building2 className="w-5 h-5" />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Company Name (Optional)"
                                        className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-xl focus:border-[#EB4724] focus:ring-4 focus:ring-[#EB4724]/5 outline-none transition-all placeholder:text-gray-400"
                                    />
                                </div>
                                <div className="relative group">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#EB4724] transition-colors">
                                        <Building2 className="w-5 h-5" />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Street Address"
                                        className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-xl focus:border-[#EB4724] focus:ring-4 focus:ring-[#EB4724]/5 outline-none transition-all placeholder:text-gray-400"
                                    />
                                </div>
                                <div className="relative group">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#EB4724] transition-colors">
                                        <MapPin className="w-5 h-5" />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Street Address 2"
                                        className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-xl focus:border-[#EB4724] focus:ring-4 focus:ring-[#EB4724]/5 outline-none transition-all placeholder:text-gray-400"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="relative group md:col-span-1">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#EB4724] transition-colors">
                                            <Building2 className="w-5 h-5" />
                                        </div>
                                        <input
                                            type="text"
                                            placeholder="City"
                                            className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-xl focus:border-[#EB4724] focus:ring-4 focus:ring-[#EB4724]/5 outline-none transition-all placeholder:text-gray-400"
                                        />
                                    </div>
                                    <div className="relative group md:col-span-1">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#EB4724] transition-colors">
                                            <MapPin className="w-5 h-5" />
                                        </div>
                                        <input
                                            type="text"
                                            placeholder="State"
                                            className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-xl focus:border-[#EB4724] focus:ring-4 focus:ring-[#EB4724]/5 outline-none transition-all placeholder:text-gray-400"
                                        />
                                    </div>
                                    <div className="relative group md:col-span-1">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                                            <span className="flex items-center justify-center w-5 h-5 bg-pink-100 rounded-full text-pink-500 text-[10px]">★</span>
                                        </div>
                                        <input
                                            type="text"
                                            defaultValue="abdulahimuse46@g"
                                            className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-xl focus:border-[#EB4724] focus:ring-4 focus:ring-[#EB4724]/5 outline-none transition-all text-gray-500"
                                        />
                                    </div>
                                </div>

                                <div className="relative group">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#EB4724] transition-colors">
                                        <Globe className="w-5 h-5" />
                                    </div>
                                    <select className="w-full pl-12 pr-10 py-4 bg-white border border-gray-200 rounded-xl focus:border-[#EB4724] focus:ring-4 focus:ring-[#EB4724]/5 outline-none transition-all appearance-none text-[#651313] font-medium">
                                        <option>Somalia</option>
                                    </select>
                                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                                </div>
                            </div>
                        </section>

                        {/* Account Security */}
                        <section className="space-y-6">
                            <div className="flex items-center gap-4">
                                <h3 className="font-bold text-[#651313] whitespace-nowrap">Account Security</h3>
                                <div className="h-px bg-gray-100 flex-1 border-t border-dashed border-[#651313]/20"></div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="relative group">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#EB4724] transition-colors">
                                        <Lock className="w-5 h-5" />
                                    </div>
                                    <input
                                        type="password"
                                        placeholder="Password"
                                        defaultValue="•••••"
                                        className="w-full pl-12 pr-4 py-4 bg-[#f1f5f9]/50 border border-gray-100 rounded-xl focus:border-[#EB4724] outline-none transition-all placeholder:text-gray-400"
                                    />
                                </div>
                                <div className="relative group">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#EB4724] transition-colors">
                                        <Lock className="w-5 h-5" />
                                    </div>
                                    <input
                                        type="password"
                                        placeholder="Confirm Password"
                                        className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-xl focus:border-[#EB4724] focus:ring-4 focus:ring-[#EB4724]/5 outline-none transition-all placeholder:text-gray-400"
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                                <button className="flex items-center gap-2 px-6 py-2 border border-gray-200 rounded-lg text-sm font-bold text-gray-600 hover:bg-gray-50 transition-colors">
                                    <RefreshCw className="w-4 h-4" />
                                    Generate Password
                                </button>
                                <div className="text-xs text-gray-500 font-medium">
                                    Password Strength: <span className="text-gray-400">Enter a Password</span>
                                </div>
                            </div>
                            <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
                                <div className="w-0 h-full bg-[#EB4724]"></div>
                            </div>
                        </section>
                    </motion.div>
                ) : (
                    <motion.div
                        key="existing-customer"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-8"
                    >
                        {/* Existing Customer Login */}
                        <section className="space-y-6">
                            <div className="flex items-center gap-4">
                                <h3 className="font-bold text-[#651313] whitespace-nowrap">Existing Customer Login</h3>
                                <div className="h-px bg-gray-100 flex-1 border-t border-dashed border-[#651313]/20"></div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="relative group">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#EB4724] transition-colors">
                                        <Mail className="w-5 h-5" />
                                    </div>
                                    <input
                                        type="email"
                                        placeholder="Email Address"
                                        className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-xl focus:border-[#EB4724] focus:ring-4 focus:ring-[#EB4724]/5 outline-none transition-all placeholder:text-gray-400"
                                    />
                                </div>
                                <div className="relative group">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#EB4724] transition-colors">
                                        <Lock className="w-5 h-5" />
                                    </div>
                                    <input
                                        type="password"
                                        placeholder="Password"
                                        className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-xl focus:border-[#EB4724] focus:ring-4 focus:ring-[#EB4724]/5 outline-none transition-all placeholder:text-gray-400"
                                    />
                                </div>
                            </div>

                            <div className="flex justify-center">
                                <button className="bg-[#a26868] hover:bg-[#8e5a5a] text-white px-12 py-3 rounded-lg font-bold transition-all shadow-md active:scale-95">
                                    Login
                                </button>
                            </div>
                        </section>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Domain Registrant - Common */}
            <section className="space-y-6">
                <div className="flex items-center gap-4">
                    <h3 className="font-bold text-[#651313] whitespace-nowrap">Domain Registrant Information</h3>
                    <div className="h-px bg-gray-100 flex-1 border-t border-dashed border-[#651313]/20"></div>
                </div>
                <p className="text-gray-500 text-sm">You may specify alternative registered contact details for the domain registration(s) in your order when placing an order on behalf of another person or entity. If you do not require this, you can skip this section.</p>

                <div className="relative">
                    <select className="w-full px-6 py-4 bg-white border border-gray-200 rounded-xl focus:border-[#EB4724] focus:ring-4 focus:ring-[#EB4724]/5 outline-none transition-all appearance-none text-[#651313] font-medium">
                        <option>Use Default Contact (Details Above)</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>
            </section>

            {/* Payment Details - Common */}
            <section className="space-y-6">
                <div className="flex items-center gap-4">
                    <h3 className="font-bold text-[#651313] whitespace-nowrap">Payment Details</h3>
                    <div className="h-px bg-gray-100 flex-1 border-t border-dashed border-[#651313]/20"></div>
                </div>

                <div className="bg-[#def7ec] p-5 rounded-xl flex items-center gap-3">
                    <span className="text-[#651313] font-bold">Total Due Today:</span>
                    <span className="text-xl font-black text-[#651313]">${cartTotal.toFixed(2)} USD</span>
                </div>

                <div className="space-y-4">
                    <p className="font-bold text-[#651313]">Please choose your preferred method of payment.</p>
                    <div className="flex flex-wrap gap-6">
                        <label className="flex items-center gap-3 cursor-pointer group">
                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${paymentMethod === 'mail' ? 'border-[#EB4724] bg-[#EB4724]' : 'border-gray-200'}`}>
                                {paymentMethod === 'mail' && <CheckCircle2 className="w-4 h-4 text-white" />}
                            </div>
                            <input
                                type="radio"
                                name="payment"
                                className="hidden"
                                checked={paymentMethod === 'mail'}
                                onChange={() => setPaymentMethod('mail')}
                            />
                            <span className="text-[#651313] font-medium group-hover:text-[#EB4724] transition-colors">Mail In Payment</span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer group">
                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${paymentMethod === 'waafi' ? 'border-[#EB4724] bg-[#EB4724]' : 'border-gray-200'}`}>
                                {paymentMethod === 'waafi' && <CheckCircle2 className="w-4 h-4 text-white" />}
                            </div>
                            <input
                                type="radio"
                                name="payment"
                                className="hidden"
                                checked={paymentMethod === 'waafi'}
                                onChange={() => setPaymentMethod('waafi')}
                            />
                            <span className="text-[#651313] font-medium group-hover:text-[#EB4724] transition-colors">Waafi Payment( EVC, Zaad, Sahal, Jeeb)</span>
                        </label>
                    </div>
                </div>
            </section>

            {/* Additional Notes - Common */}
            <section className="space-y-6">
                <div className="flex items-center gap-4">
                    <h3 className="font-bold text-[#651313] whitespace-nowrap">Additional Notes</h3>
                    <div className="h-px bg-gray-100 flex-1 border-t border-dashed border-[#651313]/20"></div>
                </div>
                <textarea
                    placeholder="You can enter any additional notes or information you want included with your order here..."
                    className="w-full h-32 p-6 bg-white border border-gray-200 rounded-2xl focus:border-[#EB4724] focus:ring-4 focus:ring-[#EB4724]/5 outline-none transition-all placeholder:text-gray-300 resize-none"
                ></textarea>
            </section>

            <div className="flex justify-center pt-4">
                <button className="w-full max-w-md bg-[#651313] text-white py-5 rounded-2xl font-black text-xl hover:bg-[#4d0e0e] transition-all shadow-xl hover:shadow-2xl active:scale-95 duration-200">
                    COMPLETE ORDER
                </button>
            </div>
        </div>
    );
}
