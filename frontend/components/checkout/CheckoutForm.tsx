"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { User, Mail, Phone, Lock, Eye, EyeOff, Loader2, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/context/CartContext";
import { loginUser, signupUser } from "@/api-client/authApi";
import { checkoutCart } from "@/api-client/transactionApi";
import { getToken, getUser, isAdminOrManager, isAuthenticated, setAuth } from "@/utils/auth";

const inputClass =
    "w-full pl-12 pr-4 py-4 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-[#EB4724] focus:ring-0 outline-none transition-all placeholder:text-gray-400 text-[#1a1a1a]";

export default function CheckoutForm() {
    const { cartItems, cartTotal, clearCart } = useCart();
    const router = useRouter();
    const [paymentMethod] = useState<"waafi">("waafi");
    const [isExistingCustomer, setIsExistingCustomer] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    useEffect(() => {
        if (isAuthenticated() && isAdminOrManager()) {
            router.push("/dashboard");
        }
    }, [router]);

    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
        waafiPhone: "",
    });

    // Reset email & password when switching tabs
    const toggleCustomerMode = (existing: boolean) => {
        setIsExistingCustomer(existing);
        setFormData(prev => ({
            ...prev,
            email: "",
            password: "",
            confirmPassword: "",
        }));
        setError(null);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (isAuthenticated() && isAdminOrManager()) {
            alert("Admin and Manager accounts cannot make purchases.");
            return;
        }

        if (cartItems.length === 0) {
            setError("Your cart is empty.");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            let userId: string;
            let userToken: string;
            let userData: any;

            const currentUser = getUser();
            const currentToken = getToken();

            if (currentUser && currentToken) {
                userId = currentUser._id || currentUser.id;
                userToken = currentToken;
                userData = currentUser;
            } else if (isExistingCustomer) {
                const loginRes = await loginUser({
                    email: formData.email,
                    password: formData.password,
                });
                userId = loginRes.data.user._id || loginRes.data.user.id;
                userToken = loginRes.data.token;
                userData = loginRes.data.user;
            } else {
                if (formData.password !== formData.confirmPassword) {
                    setError("Passwords do not match.");
                    setLoading(false);
                    return;
                }
                const signupRes = await signupUser({
                    fullname: formData.fullName,
                    email: formData.email,
                    phone: formData.phone,
                    password: formData.password,
                });
                userId = signupRes.data.user._id || signupRes.data.user.id;
                userToken = signupRes.data.token;
                userData = signupRes.data.user;
            }

            setAuth(userToken, userData);

            await checkoutCart({
                userId,
                accountNo: formData.waafiPhone,
                paymentMethod,
                items: cartItems.map((item) => ({
                    type: item.type,
                    amount: item.price,
                    originalAmount: item.originalAmount,
                    discountApplied: item.discountApplied,
                    description:
                        item.type === "domain"
                            ? `Domain Registration: ${item.subtitle}`
                            : `Payment for ${item.subtitle}`,
                    domain:
                        item.type === "domain"
                            ? { name: item.subtitle, price: item.price }
                            : undefined,
                    serviceId: item.serviceId,
                    packageId: item.packageId,
                    hostingPackageId: item.hostingPackageId,
                })),
            });

            clearCart();
            router.push("/?success=true&type=cart");
        } catch (err: any) {
            console.error("Checkout error:", err);
            const data = err.response?.data;
            let msg = data?.message || data?.error || err.message || "An error occurred during checkout.";
            if (data?.errors && typeof data.errors === "object") {
                msg += ": " + Object.values(data.errors).join(", ");
            }
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error Banner */}
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <p className="text-sm font-medium">{error}</p>
                </div>
            )}

            {/* Toggle: New vs Existing */}
            <div className="flex items-center justify-between bg-gray-50 p-1 rounded-xl border border-gray-100">
                <button
                    type="button"
                    onClick={() => toggleCustomerMode(false)}
                    className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all ${!isExistingCustomer
                            ? "bg-[#651313] text-white shadow"
                            : "text-gray-500 hover:text-[#651313]"
                        }`}
                >
                    New Customer
                </button>
                <button
                    type="button"
                    onClick={() => toggleCustomerMode(true)}
                    className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all ${isExistingCustomer
                            ? "bg-[#651313] text-white shadow"
                            : "text-gray-500 hover:text-[#651313]"
                        }`}
                >
                    Already Registered?
                </button>
            </div>

            <AnimatePresence mode="wait">
                {!isExistingCustomer ? (
                    <motion.div
                        key="new"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="space-y-4"
                    >
                        {/* Full Name + Email */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="relative group">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#EB4724] transition-colors">
                                    <User className="w-5 h-5" />
                                </div>
                                <input
                                    type="text"
                                    name="fullName"
                                    required
                                    autoComplete="off"
                                    value={formData.fullName}
                                    onChange={handleInputChange}
                                    placeholder="Full Name"
                                    className={inputClass}
                                />
                            </div>
                            <div className="relative group">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#EB4724] transition-colors">
                                    <Mail className="w-5 h-5" />
                                </div>
                                <input
                                    key="new-email"
                                    type="email"
                                    name="email"
                                    required
                                    autoComplete="off"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    placeholder="Email"
                                    className={inputClass}
                                />
                            </div>
                        </div>

                        {/* Phone */}
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
                                className={inputClass}
                            />
                        </div>

                        {/* Password + Confirm */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="relative group">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#EB4724] transition-colors">
                                    <Lock className="w-5 h-5" />
                                </div>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    required
                                    autoComplete="new-password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    placeholder="Password"
                                    className={`${inputClass} pr-12`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#651313] transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                            <div className="relative group">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#EB4724] transition-colors">
                                    <Lock className="w-5 h-5" />
                                </div>
                                <input
                                    type={showConfirm ? "text" : "password"}
                                    name="confirmPassword"
                                    required
                                    autoComplete="new-password"
                                    value={formData.confirmPassword}
                                    onChange={handleInputChange}
                                    placeholder="Confirm"
                                    className={`${inputClass} pr-12`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirm(!showConfirm)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#651313] transition-colors"
                                >
                                    {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="existing"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="space-y-4"
                    >
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
                                className={inputClass}
                            />
                        </div>
                        <div className="relative group">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#EB4724] transition-colors">
                                <Lock className="w-5 h-5" />
                            </div>
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                required
                                autoComplete="current-password"
                                value={formData.password}
                                onChange={handleInputChange}
                                placeholder="Password"
                                className={`${inputClass} pr-12`}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#651313] transition-colors"
                            >
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Payment — Waafi */}
            <div className="space-y-3 pt-2">
                <p className="text-sm font-bold text-[#651313]">Waafi Payment (EVC / Zaad / Sahal / Jeeb)</p>
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
                        placeholder="Waafi / EVC Number (e.g. 61xxxxxxx)"
                        className={inputClass}
                    />
                </div>
                <p className="text-xs text-gray-400">You will receive a prompt on your phone to authorize the payment.</p>
            </div>

            {/* Total + Submit */}
            <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between bg-[#f8fafc] border border-gray-100 p-4 rounded-xl">
                    <span className="text-gray-600 font-medium">Total Due Today</span>
                    <span className="text-xl font-black text-[#651313]">${cartTotal.toFixed(2)} <span className="text-sm font-bold">USD</span></span>
                </div>

                <button
                    disabled={loading}
                    className="w-full bg-[#651313] disabled:opacity-50 disabled:cursor-not-allowed text-white py-4 rounded-xl font-black text-lg hover:bg-[#4d0e0e] transition-all shadow-lg hover:shadow-xl active:scale-95 duration-200 flex items-center justify-center gap-3"
                >
                    {loading ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            PROCESSING...
                        </>
                    ) : (
                        "COMPLETE ORDER"
                    )}
                </button>
            </div>
        </form>
    );
}
