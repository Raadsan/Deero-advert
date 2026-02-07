"use client";
export const runtime = 'edge';

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Lock, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { resetPassword } from "../../../api/authApi";

export default function ResetPasswordPage() {
    const params = useParams();
    const router = useRouter();
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess("");

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            setLoading(false);
            return;
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters");
            setLoading(false);
            return;
        }

        try {
            await resetPassword(params.token as string, password);
            setSuccess("Password reset successful! Redirecting to login...");
            setTimeout(() => {
                router.push("/login");
            }, 2000);
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to reset password. Link may be expired.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 font-sans">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden p-8 sm:p-12">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-[#651313] mb-2">New Password</h1>
                    <p className="text-gray-500">Create a new secure password.</p>
                </div>

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

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="relative group">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                            <Lock className="h-5 w-5" />
                        </div>
                        <input
                            type={showPassword ? "text" : "password"}
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full pl-12 pr-12 py-4 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-[#EB4724] focus:ring-0 transition-all outline-none"
                            placeholder="New Password"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#651313]"
                        >
                            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                    </div>

                    <div className="relative group">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                            <Lock className="h-5 w-5" />
                        </div>
                        <input
                            type={showPassword ? "text" : "password"}
                            required
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full pl-12 pr-12 py-4 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-[#EB4724] focus:ring-0 transition-all outline-none"
                            placeholder="Confirm Password"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#651313] text-white py-4 rounded-xl font-bold text-lg hover:bg-[#4d0e0e] transition-colors shadow-lg flex items-center justify-center gap-2 group disabled:opacity-70"
                    >
                        {loading ? "RESETTING..." : "RESET PASSWORD"}
                    </button>

                    <div className="text-center">
                        <button
                            type="button"
                            onClick={() => router.push("/login")}
                            className="flex items-center justify-center gap-2 text-sm font-bold text-[#651313] hover:underline mx-auto"
                        >
                            <ArrowLeft className="h-4 w-4" /> Back to Login
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
