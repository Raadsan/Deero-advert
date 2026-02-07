"use client";
export const dynamic = 'force-static';

import { useState, useEffect } from "react";
import { Mail, Lock, User, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { signupUser } from "../../api/authApi";
import { useRouter, useSearchParams } from "next/navigation";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { isAuthenticated } from "@/utils/auth";
import Link from "next/link";

import { Suspense } from "react";

function SignupContent() {
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirectUrl = searchParams.get("redirect") || "/dashboard";

    // Redirect if already logged in
    useEffect(() => {
        if (isAuthenticated()) {
            router.push(redirectUrl);
        }
    }, [router, redirectUrl]);

    const [signupData, setSignupData] = useState({
        fullname: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
    });

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess("");

        if (signupData.password !== signupData.confirmPassword) {
            setError("Passwords do not match");
            setLoading(false);
            return;
        }

        if (signupData.password.length < 6) {
            setError("Password must be at least 6 characters");
            setLoading(false);
            return;
        }

        try {
            const res = await signupUser({
                fullname: signupData.fullname,
                email: signupData.email,
                phone: signupData.phone,
                password: signupData.password,
            });
            localStorage.setItem("token", res.data.token);
            localStorage.setItem("user", JSON.stringify(res.data.user));
            setSuccess("Account created successfully! Redirecting...");
            setTimeout(() => {
                router.push(redirectUrl);
            }, 1000);
        } catch (err: any) {
            setError(err.response?.data?.message || "Signup failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 font-sans">
            <div className="w-full max-w-5xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[600px]">

                {/* LEFT COLUMN: FORM */}
                <div className="w-full md:w-1/2 p-8 sm:p-12 flex flex-col justify-center bg-white order-2 md:order-1 relative">
                    {/* Error/Success Messages */}
                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                            {error}
                        </div>
                    )}
                    {success && (
                        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
                            {success}
                        </div>
                    )}

                    <div className="space-y-6">
                        <div>
                            <h1 className="text-3xl font-bold text-[#651313] mb-2">Create Account</h1>
                            <p className="text-gray-500">Join us today.</p>
                        </div>
                        <form onSubmit={handleSignup} className="space-y-4">
                            <div className="grid grid-cols-2 gap-3">
                                <div className="bg-gray-50 rounded-xl px-4 py-3 flex items-center gap-2">
                                    <User className="text-gray-400 h-5 w-5 shrink-0" />
                                    <input
                                        value={signupData.fullname}
                                        onChange={(e) => setSignupData({ ...signupData, fullname: e.target.value })}
                                        placeholder="Full Name"
                                        className="bg-transparent w-full outline-none text-gray-700"
                                        required
                                    />
                                </div>
                                <div className="bg-gray-50 rounded-xl px-4 py-3 flex items-center gap-2">
                                    <Mail className="text-gray-400 h-5 w-5 shrink-0" />
                                    <input
                                        type="email"
                                        value={signupData.email}
                                        onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                                        placeholder="Email"
                                        className="bg-transparent w-full outline-none text-gray-700"
                                        required
                                        autoComplete="off"
                                    />
                                </div>
                            </div>
                            <div className="bg-gray-50 rounded-xl px-4 py-3 flex items-center gap-2">
                                <div className="relative w-full">
                                    <PhoneInput
                                        country={"so"}
                                        value={signupData.phone}
                                        onChange={(phone) => setSignupData({ ...signupData, phone })}
                                        inputStyle={{
                                            width: "100%",
                                            height: "50px",
                                            background: "#f9fafb",
                                            border: "none",
                                            borderRadius: "12px",
                                            paddingLeft: "48px",
                                            fontSize: "16px",
                                            color: "#374151"
                                        }}
                                        buttonStyle={{
                                            background: "transparent",
                                            border: "none",
                                            borderRadius: "12px 0 0 12px",
                                            paddingLeft: "8px"
                                        }}
                                        containerClass="!bg-gray-50 rounded-xl"
                                        placeholder="Phone Number"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="bg-gray-50 rounded-xl px-4 py-3 flex items-center gap-2">
                                    <Lock className="text-gray-400 h-5 w-5 shrink-0" />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={signupData.password}
                                        onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                                        placeholder="Password"
                                        className="bg-transparent w-full outline-none text-gray-700"
                                        required
                                        autoComplete="new-password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="text-gray-400 hover:text-[#651313]"
                                    >
                                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                    </button>
                                </div>
                                <div className="bg-gray-50 rounded-xl px-4 py-3 flex items-center gap-2">
                                    <Lock className="text-gray-400 h-5 w-5 shrink-0" />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={signupData.confirmPassword}
                                        onChange={(e) => setSignupData({ ...signupData, confirmPassword: e.target.value })}
                                        placeholder="Confirm"
                                        className="bg-transparent w-full outline-none text-gray-700"
                                        required
                                        autoComplete="new-password"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-[#651313] text-white py-4 rounded-xl font-bold text-lg hover:bg-[#4d0e0e] transition-colors shadow-lg flex items-center justify-center gap-2 group disabled:opacity-70"
                            >
                                {loading ? "CREATING..." : "SIGN UP"}
                                {!loading && <span className="group-hover:translate-x-1 transition-transform">→</span>}
                            </button>

                            <div className="text-center">
                                <Link href="/login" className="text-sm font-bold text-[#651313] hover:underline">
                                    Back to Login
                                </Link>
                            </div>
                        </form>
                    </div>
                </div>

                {/* RIGHT COLUMN: BRANDING */}
                <div className="w-full md:w-1/2 bg-gradient-to-br from-[#651313] to-[#EB4724] p-8 sm:p-12 text-white flex flex-col justify-center items-center text-center order-1 md:order-2 relative overflow-hidden">
                    <div className="absolute top-10 right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                    <div className="absolute bottom-10 left-10 w-40 h-40 bg-black/10 rounded-full blur-2xl"></div>

                    <div className="relative z-10 space-y-8">
                        <h2 className="text-4xl font-bold tracking-tight">Welcome Back!</h2>
                        <div className="flex justify-center gap-6">
                            <div className="flex flex-col items-center gap-2 p-4 bg-white/10 rounded-2xl backdrop-blur-sm">
                                <User className="h-8 w-8 text-white/90" />
                                <span className="text-xs font-medium uppercase tracking-wider text-white/80">ACCOUNT</span>
                            </div>
                            <div className="flex flex-col items-center gap-2 p-4 bg-white/10 rounded-2xl backdrop-blur-sm">
                                <Lock className="h-8 w-8 text-white/90" />
                                <span className="text-xs font-medium uppercase tracking-wider text-white/80">SECURE</span>
                            </div>
                        </div>
                        <p className="text-white/80 leading-relaxed max-w-sm mx-auto">
                            Streamline your advertising workflow with Deero Advert. Login to manage your campaigns, track performance, and grow your business.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function SignupPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-gray-100 flex items-center justify-center">Loading...</div>}>
            <SignupContent />
        </Suspense>
    );
}
