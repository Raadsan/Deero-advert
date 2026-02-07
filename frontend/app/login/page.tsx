"use client";
export const dynamic = 'force-static';

import { useState, useEffect } from "react";
import { Eye, EyeOff, Mail, Lock, User, Phone, ArrowLeft } from "lucide-react";
import { loginUser, signupUser, forgotPassword } from "../../api-client/authApi";
import { useRouter, useSearchParams } from "next/navigation";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { isAuthenticated, isAdminOrManager } from "@/utils/auth";

import Link from "next/link";

type ViewType = "login" | "forgot";

import { Suspense } from "react";

function LoginContent() {
  const [view, setView] = useState<ViewType>("login");
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

  // Login form
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  // Forgot password form
  const [forgotData, setForgotData] = useState({
    email: "",
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await loginUser(loginData);
      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        setSuccess("Login successful! Redirecting...");
        setTimeout(() => {
          // Redirect to dashboard or requested page
          router.push(redirectUrl);
        }, 1000);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await forgotPassword(forgotData.email);
      setSuccess("Password reset link sent to your email!");
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to send reset link. Please try again.");
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

          {view === "login" && (
            <div className="space-y-6">
              <div>

                <p className="text-gray-500 text-center">Sign in to your account.</p>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    <Mail className="h-5 w-5" />
                  </div>
                  <input
                    type="email"
                    required
                    value={loginData.email}
                    onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-[#EB4724] focus:ring-0 transition-all outline-none"
                    placeholder="Email Address"
                  />
                </div>

                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    <Lock className="h-5 w-5" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={loginData.password}
                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                    className="w-full pl-12 pr-12 py-4 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-[#EB4724] focus:ring-0 transition-all outline-none"
                    placeholder="Password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#651313]"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => setView("forgot")}
                    className="text-sm font-bold text-[#EB4724] hover:underline"
                  >
                    Forgot Password?
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#651313] text-white py-4 rounded-xl font-bold text-lg hover:bg-[#4d0e0e] transition-colors shadow-lg flex items-center justify-center gap-2 group disabled:opacity-70"
                >
                  {loading ? "SIGNING IN..." : "SIGN IN"}
                  {!loading && <span className="group-hover:translate-x-1 transition-transform">→</span>}
                </button>

                <div className="text-center mt-6">
                  <p className="text-gray-500">Don't have an account?</p>
                  <Link
                    href="/signup"
                    className="text-[#651313] font-bold hover:underline"
                  >
                    Create Account
                  </Link>
                </div>
              </form>
            </div>
          )}

          {view === "forgot" && (
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-[#651313] mb-2">Reset Password</h1>
                <p className="text-gray-500">Enter your email to receive instructions.</p>
              </div>
              <form onSubmit={handleForgotPassword} className="space-y-4">
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    <Mail className="h-5 w-5" />
                  </div>
                  <input
                    type="email"
                    required
                    value={forgotData.email}
                    onChange={(e) => setForgotData({ email: e.target.value })}
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-[#EB4724] focus:ring-0 transition-all outline-none"
                    placeholder="Email Address"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#651313] text-white py-4 rounded-xl font-bold text-lg hover:bg-[#4d0e0e] transition-colors shadow-lg flex items-center justify-center gap-2 group disabled:opacity-70"
                >
                  {loading ? "SENDING..." : "SEND LINK"}
                </button>

                <div className="text-center">
                  <button onClick={() => setView("login")} className="flex items-center justify-center gap-2 text-sm font-bold text-[#651313] hover:underline mx-auto">
                    <ArrowLeft className="h-4 w-4" /> Back to Login
                  </button>
                </div>
              </form>
            </div>
          )}

        </div>

        {/* RIGHT COLUMN: BRANDING */}
        <div className="w-full md:w-1/2 bg-gradient-to-br from-[#651313] to-[#EB4724] p-8 sm:p-12 text-white flex flex-col justify-center items-center text-center order-1 md:order-2 relative overflow-hidden">
          {/* Shapes/Ornaments */}
          <div className="absolute top-10 right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
          <div className="absolute bottom-10 left-10 w-40 h-40 bg-black/10 rounded-full blur-2xl"></div>

          <div className="relative z-10 space-y-8">
            <h2 className="text-4xl font-bold tracking-tight">Welcome Back!</h2>

            {/* Quick stats / Features visual (Optional mock) */}
            <div className="flex justify-center gap-6">
              <div className="flex flex-col items-center gap-2 p-4 bg-white/10 rounded-2xl backdrop-blur-sm">
                <User className="h-8 w-8 text-white/90" />
                <span className="text-xs font-medium uppercase tracking-wider text-white/80">Account</span>
              </div>
              <div className="flex flex-col items-center gap-2 p-4 bg-white/10 rounded-2xl backdrop-blur-sm">
                <Lock className="h-8 w-8 text-white/90" />
                <span className="text-xs font-medium uppercase tracking-wider text-white/80">Secure</span>
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

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-100 flex items-center justify-center">Loading...</div>}>
      <LoginContent />
    </Suspense>
  );
}


