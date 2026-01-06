"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated, getUserId } from "@/utils/auth";
import api from "@/api/axios";
import { motion } from "framer-motion";
import {
    UserIcon,
    EnvelopeIcon,
    PhoneIcon,
    BuildingOfficeIcon,
    MapPinIcon,
    GlobeAltIcon,
    UserCircleIcon,
    PencilSquareIcon,
    ShieldCheckIcon,
    KeyIcon,
    IdentificationIcon
} from "@heroicons/react/24/outline";

export default function ProfilePage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const fetchUserData = async () => {
            if (!isAuthenticated()) {
                router.push("/login?redirect=/profile");
                return;
            }

            try {
                const userId = getUserId();
                if (userId) {
                    const response = await api.get(`/users/${userId}`);
                    if (response.data) {
                        setUser(response.data);
                    }
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserData();
    }, [router]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[600px]">
                <div className="relative">
                    <div className="w-16 h-16 border-4 border-[#651313]/10 border-t-[#651313] rounded-full animate-spin"></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                        <UserIcon className="w-6 h-6 text-[#651313]/40" />
                    </div>
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100 mx-4">
                <UserCircleIcon className="w-20 h-20 text-gray-200 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Profile Not Found</h3>
                <p className="text-gray-500 mb-8">We encountered an issue while loading your profile.</p>
                <button
                    onClick={() => window.location.reload()}
                    className="px-6 py-3 bg-[#651313] text-white rounded-xl font-bold hover:bg-[#831a1a] transition-colors"
                >
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto px-4 pb-12">
            {/* Premium Header Section */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative mb-12"
            >
                <div className="h-48 w-full bg-gradient-to-r from-[#651313] via-[#831a1a] to-[#EB4724] rounded-3xl shadow-2xl relative overflow-hidden">
                    <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
                    <div className="absolute -right-20 -top-20 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
                    <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-black/10 rounded-full blur-3xl"></div>
                </div>

                <div className="absolute -bottom-10 left-8 right-8 flex flex-col md:flex-row items-end gap-6">
                    <div className="relative group">
                        <div className="p-1.5 bg-white rounded-full shadow-2xl backdrop-blur-md">
                            <div className="w-32 h-32 md:w-36 md:h-36 bg-gradient-to-br from-gray-50 to-gray-100 rounded-full flex items-center justify-center overflow-hidden border-2 border-gray-50">
                                <UserIcon className="w-16 h-16 text-[#651313]" />
                            </div>
                        </div>
                        <button className="absolute bottom-2 right-2 p-2 bg-white rounded-full shadow-lg text-[#651313] hover:scale-110 transition-transform border border-gray-100">
                            <PencilSquareIcon className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="mb-4 flex-1">
                        <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mb-1">
                            <h2 className="text-3xl font-black text-gray-900 tracking-tight">{user.fullname}</h2>
                            <span className="px-3 py-1 bg-green-100 text-green-700 text-[10px] uppercase font-black rounded-full w-fit tracking-widest border border-green-200">
                                Verified Account
                            </span>
                        </div>
                        <div className="flex items-center gap-4 text-gray-500 font-medium">
                            <span className="flex items-center gap-1.5 text-sm italic">
                                <IdentificationIcon className="w-4 h-4 text-[#EB4724]" />
                                Customer since {new Date(user.createdAt || Date.now()).getFullYear()}
                            </span>
                        </div>
                    </div>

                    <div className="mb-4 hidden lg:flex gap-3">
                        <button className="px-6 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl font-bold text-sm shadow-sm hover:bg-gray-50 hover:border-gray-300 transition-all flex items-center gap-2">
                            <KeyIcon className="w-4 h-4" />
                            Security
                        </button>
                        <button className="px-6 py-2.5 bg-[#651313] text-white rounded-xl font-bold text-sm shadow-xl shadow-[#651313]/20 hover:bg-[#831a1a] transition-all flex items-center gap-2">
                            <PencilSquareIcon className="w-4 h-4" />
                            Edit Profile
                        </button>
                    </div>
                </div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-16">
                {/* Left Column: Contact & Security Quick View */}
                <div className="lg:col-span-4 space-y-8">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100"
                    >
                        <h3 className="text-base font-black text-gray-900 mb-6 flex items-center justify-between">
                            Contact Info
                            <EnvelopeIcon className="w-5 h-5 text-[#EB4724]" />
                        </h3>
                        <div className="space-y-5">
                            <div className="group">
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1 group-hover:text-[#EB4724] transition-colors">Primary Email</p>
                                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-2xl border border-transparent group-hover:border-gray-200 transition-all">
                                    <EnvelopeIcon className="w-4 h-4 text-gray-400" />
                                    <p className="text-sm font-bold text-gray-900 truncate">{user.email}</p>
                                </div>
                            </div>
                            <div className="group">
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1 group-hover:text-[#EB4724] transition-colors">Phone Number</p>
                                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-2xl border border-transparent group-hover:border-gray-200 transition-all">
                                    <PhoneIcon className="w-4 h-4 text-gray-400" />
                                    <p className="text-sm font-bold text-gray-900">{user.phone || 'Not provided'}</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-3xl shadow-xl text-white overflow-hidden relative"
                    >
                        <div className="relative z-10">
                            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center mb-6">
                                <ShieldCheckIcon className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="text-lg font-bold mb-2">Account Security</h3>
                            <p className="text-xs text-gray-400 mb-6 leading-relaxed">Keep your account safe by updating your password regularly and enabling 2FA.</p>
                            <button className="w-full py-3 bg-white text-gray-900 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-gray-100 transition-colors">
                                Update Settings
                            </button>
                        </div>
                        <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
                    </motion.div>
                </div>

                {/* Right Column: Business & Billing Details */}
                <div className="lg:col-span-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 h-full"
                    >
                        <div className="flex items-center justify-between mb-10 pb-6 border-b border-gray-50">
                            <h3 className="text-xl font-black text-gray-900 flex items-center gap-3">
                                <BuildingOfficeIcon className="w-6 h-6 text-[#651313]" />
                                Business & Billing Info
                            </h3>
                            <button className="text-[#EB4724] text-xs font-black uppercase tracking-widest hover:underline">
                                Sync Data
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            <div className="space-y-8">
                                <div className="relative pl-8 border-l-2 border-gray-100  hover:border-[#651313] transition-colors">
                                    <div className="absolute -left-[9px] top-0 w-4 h-4 bg-white border-2 border-[#651313] rounded-full"></div>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Company Entity</p>
                                    <p className="text-lg font-black text-gray-900">{user.companyName || 'Not Registered'}</p>
                                </div>

                                <div className="relative pl-8 border-l-2 border-gray-100 hover:border-[#651313] transition-colors">
                                    <div className="absolute -left-[9px] top-0 w-4 h-4 bg-white border-2 border-gray-200 rounded-full"></div>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Office Location</p>
                                    <div className="space-y-1">
                                        <p className="text-base font-bold text-gray-800">{user.streetAddress || 'No address saved'}</p>
                                        {user.streetAddress2 && <p className="text-sm text-gray-500 font-medium">{user.streetAddress2}</p>}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-8">
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 inline-block">
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">City</p>
                                        <p className="text-sm font-black text-gray-900">{user.city || '—'}</p>
                                    </div>
                                    <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 inline-block">
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">State</p>
                                        <p className="text-sm font-black text-gray-900">{user.state || '—'}</p>
                                    </div>
                                </div>

                                <div className="p-5 bg-gradient-to-br from-white to-gray-50 rounded-3xl border border-gray-100 flex items-center justify-between group">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-[#651313]/5 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                            <GlobeAltIcon className="w-6 h-6 text-[#651313]" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-0.5">Country / Region</p>
                                            <p className="text-base font-black text-gray-900">{user.country || 'Location Unknown'}</p>
                                        </div>
                                    </div>
                                    <button className="p-2 hover:bg-white rounded-full transition-colors">
                                        <MapPinIcon className="w-5 h-5 text-gray-300" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="mt-12 p-6 bg-red-50 rounded-3xl border border-red-100 flex items-start gap-4">
                            <div className="p-2 bg-white rounded-xl shadow-sm">
                                <ShieldCheckIcon className="w-5 h-5 text-red-600" />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-red-900 mb-1">Privacy Notice</p>
                                <p className="text-xs text-red-700/80 leading-relaxed font-medium">Your account information is encrypted and stored securely. We never share your personal data with third parties without your explicit consent.</p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Mobile Action Buttons */}
            <div className="mt-8 lg:hidden grid grid-cols-2 gap-4">
                <button className="py-4 bg-white border border-gray-200 text-gray-700 rounded-2xl font-black text-xs uppercase tracking-widest shadow-sm">
                    Security
                </button>
                <button className="py-4 bg-[#651313] text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-[#651313]/20">
                    Edit Profile
                </button>
            </div>
        </div>
    );
}
