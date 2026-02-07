"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
    User, Mail, Phone, Building2, MapPin, Globe,
    Lock, RefreshCw, ChevronDown, CheckCircle2,
    Loader2, AlertCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/context/CartContext";
import { loginUser, signupUser } from "@/api-client/authApi";

import { createTransaction } from "@/api-client/transactionApi";
import { isAdminOrManager, isAuthenticated } from "@/utils/auth";
import { useEffect } from "react";

export default function CheckoutForm() {
    const { cartItems, cartTotal, clearCart } = useCart();
    const router = useRouter();
    const [paymentMethod, setPaymentMethod] = useState<'waafi'>('waafi');
    const [isExistingCustomer, setIsExistingCustomer] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (isAuthenticated() && isAdminOrManager()) {
            router.push("/dashboard");
        }
    }, [router]);

    // Form states
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        companyName: "",
        streetAddress: "",
        streetAddress2: "",
        city: "",
        state: "",
        password: "",
        confirmPassword: "",
        waafiPhone: ""
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Extra check for admin/manager
        if (isAuthenticated() && isAdminOrManager()) {
            alert("Admin and Manager accounts cannot make purchases.");
            return;
        }

        if (cartItems.length === 0) {
            setError("Your cart is empty");
            return;
        }

        setLoading(true);
        setError(null);

        console.log("Checkout Submission Started", { formData, cartItems });

        try {
            let userId: string;
            let userToken: string;
            let userData: any;

            if (isExistingCustomer) {
                // Login existing customer
                const loginRes = await loginUser({
                    email: formData.email,
                    password: formData.password
                });
                userId = loginRes.data.user._id || loginRes.data.user.id;
                userToken = loginRes.data.token;
                userData = loginRes.data.user;
            } else {
                // Register new customer
                if (formData.password !== formData.confirmPassword) {
                    setError("Passwords do not match");
                    setLoading(false);
                    return;
                }
                const signupRes = await signupUser({
                    fullname: `${formData.firstName} ${formData.lastName}`,
                    email: formData.email,
                    phone: formData.phone,
                    password: formData.password,
                    companyName: formData.companyName,
                    streetAddress: formData.streetAddress,
                    streetAddress2: formData.streetAddress2,
                    city: formData.city,
                    state: formData.state,
                });
                userId = signupRes.data.user._id || signupRes.data.user.id;
                userToken = signupRes.data.token;
                userData = signupRes.data.user;
            }

            console.log("DEBUG: Auth Success, user:", userData);

            // Save auth to localStorage (mimic auth utility behavior)
            localStorage.setItem("user", JSON.stringify(userData));
            localStorage.setItem("token", userToken);

            // Process each item in cart
            for (const item of cartItems) {
                if (item.type === 'domain') {
                    // 1. Create Transaction (Domain created by backend)
                    await createTransaction({
                        domain: {
                            name: item.subtitle, // subtitle is the domain name
                            user: userId,
                            price: item.price
                        },
                        userId: userId,
                        type: "register",
                        amount: item.price,
                        description: `Domain Registration: ${item.subtitle}`,
                        paymentMethod: paymentMethod,
                        accountNo: paymentMethod === 'waafi' ? formData.waafiPhone : undefined
                    });
                }
                // Handle hosting types here if needed
            }

            // Success!
            clearCart();
            router.push("/dashboard?success=true");

        } catch (err: any) {
            console.error("Checkout error:", err);
            const data = err.response?.data;
            const message = data?.message || data?.error || err.message || "An error occurred during checkout";

            // If they have multiple errors (e.g. validation), join them
            let detailedError = message;
            if (data?.errors && typeof data.errors === 'object') {
                detailedError += ": " + Object.values(data.errors).join(", ");
            }

            setError(detailedError);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <p className="text-sm font-medium">{error}</p>
                </div>
            )}

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-[#f8fafc] p-6 rounded-2xl border border-gray-100 gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-[#651313]">Checkout</h2>
                    <p className="text-gray-500 text-sm mt-1">Please enter your personal details and billing information to checkout.</p>
                </div>
                <button
                    type="button"
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
                                        name="firstName"
                                        required
                                        value={formData.firstName}
                                        onChange={handleInputChange}
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
                                        name="lastName"
                                        required
                                        value={formData.lastName}
                                        onChange={handleInputChange}
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
                                        name="email"
                                        required
                                        autoComplete="off"
                                        value={formData.email}
                                        onChange={handleInputChange}
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
                                        name="phone"
                                        required
                                        value={formData.phone}
                                        onChange={handleInputChange}
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
                                        name="companyName"
                                        value={formData.companyName}
                                        onChange={handleInputChange}
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
                                        name="streetAddress"
                                        value={formData.streetAddress}
                                        onChange={handleInputChange}
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
                                        name="streetAddress2"
                                        value={formData.streetAddress2}
                                        onChange={handleInputChange}
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
                                            name="city"
                                            value={formData.city}
                                            onChange={handleInputChange}
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
                                            name="state"
                                            value={formData.state}
                                            onChange={handleInputChange}
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
                                            readOnly
                                            value={formData.email}
                                            placeholder="Email"
                                            className="w-full pl-12 pr-4 py-4 bg-[#f8fafc] border border-gray-200 rounded-xl outline-none transition-all text-gray-500"
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
                                        name="password"
                                        required
                                        autoComplete="new-password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        placeholder="Password"
                                        className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-xl focus:border-[#EB4724] focus:ring-4 focus:ring-[#EB4724]/5 outline-none transition-all placeholder:text-gray-400"
                                    />
                                </div>
                                <div className="relative group">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#EB4724] transition-colors">
                                        <Lock className="w-5 h-5" />
                                    </div>
                                    <input
                                        type="password"
                                        name="confirmPassword"
                                        required
                                        autoComplete="new-password"
                                        value={formData.confirmPassword}
                                        onChange={handleInputChange}
                                        placeholder="Confirm Password"
                                        className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-xl focus:border-[#EB4724] focus:ring-4 focus:ring-[#EB4724]/5 outline-none transition-all placeholder:text-gray-400"
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                                <button type="button" className="flex items-center gap-2 px-6 py-2 border border-gray-200 rounded-lg text-sm font-bold text-gray-600 hover:bg-gray-50 transition-colors">
                                    <RefreshCw className="w-4 h-4" />
                                    Generate Password
                                </button>
                                <div className="text-xs text-gray-500 font-medium">
                                    Password Strength: <span className="text-gray-400">{formData.password ? 'Secure' : 'Enter a Password'}</span>
                                </div>
                            </div>
                            <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
                                <div className={`h-full transition-all duration-300 ${formData.password ? 'w-full bg-green-500' : 'w-0'}`}></div>
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
                                        name="email"
                                        required
                                        autoComplete="username"
                                        value={formData.email}
                                        onChange={handleInputChange}
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
                                        name="password"
                                        required
                                        autoComplete="current-password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        placeholder="Password"
                                        className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-xl focus:border-[#EB4724] focus:ring-4 focus:ring-[#EB4724]/5 outline-none transition-all placeholder:text-gray-400"
                                    />
                                </div>
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
                    <p className="font-bold text-[#651313]">Payment Method: Waafi Payment (EVC, Zaad, Sahal, Jeeb)</p>

                    {/* Waafi Phone Input - Always shown */}
                    {true && (
                        <div className="mt-4 animate-in fade-in slide-in-from-top-2">
                            <div className="relative group">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#EB4724] transition-colors">
                                    <Phone className="w-5 h-5" />
                                </div>
                                <input
                                    type="tel"
                                    name="waafiPhone"
                                    required
                                    value={formData.waafiPhone}
                                    onChange={handleInputChange}
                                    placeholder="Enter Waafi/EVC Number (e.g. 61xxxxxxx)"
                                    className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-xl focus:border-[#EB4724] focus:ring-4 focus:ring-[#EB4724]/5 outline-none transition-all placeholder:text-gray-400"
                                />
                            </div>
                            <p className="text-xs text-gray-500 mt-2">You will receive a prompt on your phone to authorize the payment.</p>
                        </div>
                    )}
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
                    name="notes"
                    onChange={handleInputChange}
                ></textarea>
            </section>

            <div className="flex justify-center pt-4">
                <button
                    disabled={loading}
                    className="w-full max-w-md bg-[#651313] disabled:opacity-50 disabled:cursor-not-allowed text-white py-5 rounded-2xl font-black text-xl hover:bg-[#4d0e0e] transition-all shadow-xl hover:shadow-2xl active:scale-95 duration-200 flex items-center justify-center gap-3"
                >
                    {loading ? (
                        <>
                            <Loader2 className="w-6 h-6 animate-spin" />
                            PROCESSING...
                        </>
                    ) : (
                        'COMPLETE ORDER'
                    )}
                </button>
            </div>
        </form>
    );
}

