"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Upload, CheckCircle2, Loader2, FileText, Briefcase, User, Mail, Phone, GraduationCap, Folder } from "lucide-react";
import { submitApplication } from "@/api-client/applicationApi";
import { Career } from "@/api-client/careerApi";

interface ApplyModalProps {
    isOpen: boolean;
    onClose: () => void;
    job: Career | null;
}

export default function ApplyModal({ isOpen, onClose, job }: ApplyModalProps) {
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [form, setForm] = useState({
        fullName: "",
        email: "",
        phone: "",
        position: job?.title || "",
    });

    const [files, setFiles] = useState<{
        cv: File | null;
        portfolio: File | null;
        certificate: File | null;
    }>({
        cv: null,
        portfolio: null,
        certificate: null,
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: keyof typeof files) => {
        const file = e.target.files?.[0];
        if (file) {
            setFiles(prev => ({ ...prev, [type]: file }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Comprehensive Validation
        if (!form.fullName.trim()) { setError("Full Name is required"); return; }
        if (!form.email.trim()) { setError("Email Address is required"); return; }
        if (!form.phone.trim()) { setError("Phone Number is required"); return; }
        // Position is automatically handled from the job context
        if (!files.cv) { setError("Please upload your CV"); return; }
        if (!files.portfolio) { setError("Please upload your Portfolio"); return; }
        if (!files.certificate) { setError("Please upload your Education Certificate"); return; }

        setLoading(true);
        setError(null);

        try {
            const formData = new FormData();
            formData.append("fullName", form.fullName);
            formData.append("email", form.email);
            formData.append("phone", form.phone);
            formData.append("position", form.position || job?.title || "");
            if (job?._id) formData.append("careerId", job._id);

            formData.append("cv", files.cv);
            if (files.portfolio) formData.append("portfolio", files.portfolio);
            if (files.certificate) formData.append("certificate", files.certificate);

            const res = await submitApplication(formData as any);
            if (res.data.success) {
                setSubmitted(true);
                setTimeout(() => {
                    onClose();
                    setSubmitted(false);
                    setForm({ fullName: "", email: "", phone: "", position: "" });
                    setFiles({ cv: null, portfolio: null, certificate: null });
                }, 3000);
            }
        } catch (err: any) {
            console.error("Submission error:", err);
            setError(err.response?.data?.message || "Failed to submit application. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden relative"
            >
                {/* Header */}
                <div className="bg-[#4d0e0e] p-6 text-white flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold">Apply for Position</h2>
                        <p className="text-white/70 text-sm mt-1">{job?.title || "General Application"}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/10 rounded-full transition-colors"
                    >
                        <X className="h-6 w-6" />
                    </button>
                </div>

                <div className="p-8 max-h-[80vh] overflow-y-auto custom-scrollbar">
                    {submitted ? (
                        <div className="py-12 text-center space-y-4">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto"
                            >
                                <CheckCircle2 className="h-10 w-10" />
                            </motion.div>
                            <h3 className="text-2xl font-bold text-gray-800">Application Sent!</h3>
                            <p className="text-gray-500">Thank you for your interest. We'll review your application and get back to you soon.</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {error && (
                                <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm font-medium border border-red-100">
                                    {error}
                                </div>
                            )}

                            {/* Personal Info Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                                        <User className="h-3 w-3" /> Full Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        required
                                        type="text"
                                        placeholder="John Doe"
                                        value={form.fullName}
                                        onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#EB4724] focus:ring-2 focus:ring-[#EB4724]/10 outline-none transition-all text-gray-800"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                                        <Mail className="h-3 w-3" /> Email Address <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        required
                                        type="email"
                                        placeholder="john@example.com"
                                        value={form.email}
                                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#EB4724] focus:ring-2 focus:ring-[#EB4724]/10 outline-none transition-all text-gray-800"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                                        <Phone className="h-3 w-3" /> Phone Number <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        required
                                        type="tel"
                                        placeholder="+252 ..."
                                        value={form.phone}
                                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#EB4724] focus:ring-2 focus:ring-[#EB4724]/10 outline-none transition-all text-gray-800"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                                        <Briefcase className="h-3 w-3" /> Position
                                    </label>
                                    <input
                                        type="text"
                                        readOnly
                                        value={job?.title || "General Position"}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-50 text-gray-500 outline-none cursor-not-allowed transition-all"
                                    />
                                </div>
                            </div>

                            {/* File Uploads */}
                            <div className="space-y-4 pt-4 border-t border-gray-100">
                                <h4 className="text-sm font-bold text-gray-800">Required Documents</h4>

                                {/* CV Upload */}
                                <div className="relative">
                                    <label className="block p-4 rounded-2xl border-2 border-dashed border-gray-200 hover:border-[#EB4724] hover:bg-[#EB4724]/5 transition-all cursor-pointer group">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-gray-100 group-hover:bg-[#EB4724]/10 rounded-xl flex items-center justify-center text-gray-400 group-hover:text-[#EB4724] transition-colors">
                                                {files.cv ? <CheckCircle2 className="h-6 w-6 text-green-500" /> : <FileText className="h-6 w-6" />}
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-bold text-gray-800">Upload CV <span className="text-red-500">*</span></p>
                                               
                                            </div>
                                            <Upload className="h-5 w-5 text-gray-400 group-hover:text-[#EB4724]" />
                                        </div>
                                        <input
                                            type="file"
                                            className="hidden"
                                            accept=".pdf,.doc,.docx"
                                            onChange={(e) => handleFileChange(e, "cv")}
                                        />
                                    </label>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Portfolio Upload */}
                                    <label className="block p-4 rounded-2xl border-2 border-dashed border-gray-200 hover:border-[#EB4724] hover:bg-[#EB4724]/5 transition-all cursor-pointer group">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-gray-100 group-hover:bg-[#EB4724]/10 rounded-xl flex items-center justify-center text-gray-400 group-hover:text-[#EB4724] transition-colors">
                                                {files.portfolio ? <CheckCircle2 className="h-5 w-5 text-green-500" /> : <Folder className="h-5 w-5" />}
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-sm font-bold text-gray-800">Portfolio <span className="text-red-500">*</span></p>
                                                <p className="text-[10px] text-gray-500 truncate max-w-[150px]">{files.portfolio ? files.portfolio.name : "Required (Max size: 2GB)"}</p>
                                            </div>
                                        </div>
                                        <input
                                            type="file"
                                            className="hidden"
                                            onChange={(e) => handleFileChange(e, "portfolio")}
                                        />
                                    </label>

                                    {/* Certificate Upload */}
                                    <label className="block p-4 rounded-2xl border-2 border-dashed border-gray-200 hover:border-[#EB4724] hover:bg-[#EB4724]/5 transition-all cursor-pointer group">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-gray-100 group-hover:bg-[#EB4724]/10 rounded-xl flex items-center justify-center text-gray-400 group-hover:text-[#EB4724] transition-colors">
                                                {files.certificate ? <CheckCircle2 className="h-5 w-5 text-green-500" /> : <GraduationCap className="h-5 w-5" />}
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-sm font-bold text-gray-800">Education Cert. <span className="text-red-500">*</span></p>
                                                <p className="text-[10px] text-gray-500 truncate max-w-[150px]">{files.certificate ? files.certificate.name : "Required"}</p>
                                            </div>
                                        </div>
                                        <input
                                            type="file"
                                            className="hidden"
                                            onChange={(e) => handleFileChange(e, "certificate")}
                                        />
                                    </label>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-4 bg-[#EB4724] text-white font-bold rounded-2xl shadow-lg hover:bg-[#651313] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="h-5 w-5 animate-spin" />
                                        Submitting Application...
                                    </>
                                ) : (
                                    "Submit Application"
                                )}
                            </button>
                        </form>
                    )}
                </div>
            </motion.div>
        </div>
    );
}
