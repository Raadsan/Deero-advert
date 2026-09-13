"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    XMarkIcon,
    DevicePhoneMobileIcon,
    GlobeAltIcon,
    Squares2X2Icon,
    TrashIcon,
    CheckCircleIcon,
    ExclamationCircleIcon
} from "@heroicons/react/24/outline";
import { toast } from "react-hot-toast";
import {
    createDiscount,
    getDiscountByTarget,
    updateDiscount,
    deleteDiscount
} from "@/api-client/discountApi";
import { getAllUsers } from "@/api-client/usersApi";

interface DiscountModalProps {
    isOpen: boolean;
    onClose: () => void;
    targetType: string;
    targetId: string;
    itemName: string;
}

export default function DiscountModal({ isOpen, onClose, targetType, targetId, itemName }: DiscountModalProps) {
    const [formData, setFormData] = useState({
        userId: "",
        discountValue: "",
        discountType: "percentage",
        platform: "all", // "all" | "app" | "website"
        startDate: "",
        endDate: "",
        isGlobal: true
    });
    const [existingDiscount, setExistingDiscount] = useState<any>(null);
    const [checkingExisting, setCheckingExisting] = useState(false);
    const [loading, setLoading] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [users, setUsers] = useState<any[]>([]);

    useEffect(() => {
        if (isOpen) {
            fetchUsers();
            checkExistingDiscount();
        } else {
            setExistingDiscount(null);
            resetForm();
        }
    }, [isOpen, targetType, targetId]);

    const resetForm = () => {
        setFormData({
            userId: "",
            discountValue: "",
            discountType: "percentage",
            platform: "all",
            startDate: "",
            endDate: "",
            isGlobal: true
        });
    };

    const checkExistingDiscount = async () => {
        if (!targetType || !targetId) return;
        try {
            setCheckingExisting(true);
            const res: any = await getDiscountByTarget(targetType, targetId);
            const disc = res.data?.discount;
            if (disc && disc.status === "active") {
                setExistingDiscount(disc);
                setFormData({
                    userId: disc.userId ? disc.userId.toString() : "",
                    discountValue: disc.discountValue ? disc.discountValue.toString() : "",
                    discountType: disc.discountType || "percentage",
                    platform: disc.platform || "all",
                    startDate: disc.startDate ? disc.startDate.split("T")[0] : "",
                    endDate: disc.endDate ? disc.endDate.split("T")[0] : "",
                    isGlobal: !disc.userId
                });
            } else {
                setExistingDiscount(null);
                resetForm();
            }
        } catch (err) {
            console.error("Failed to check existing discount", err);
            setExistingDiscount(null);
            resetForm();
        } finally {
            setCheckingExisting(false);
        }
    };

    const fetchUsers = async () => {
        try {
            const res = await getAllUsers();
            const userOnly = res.data.filter((u: any) => u.role?.name === "user");
            setUsers(userOnly);
        } catch (error) {
            console.error("Failed to fetch users", error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setLoading(true);
            const payload = {
                targetType,
                targetId: targetId ? targetId.toString() : null,
                discountValue: parseFloat(formData.discountValue),
                discountType: formData.discountType,
                platform: formData.platform,
                userId: formData.isGlobal ? null : parseInt(formData.userId),
                startDate: formData.startDate ? new Date(formData.startDate).toISOString() : null,
                endDate: formData.endDate ? new Date(formData.endDate).toISOString() : null,
                status: "active"
            };

            if (existingDiscount?.id) {
                // Update existing discount
                await updateDiscount(existingDiscount.id, payload);
                toast.success("Discount updated successfully!");
            } else {
                // Create brand new discount
                await createDiscount(payload);
                toast.success("Discount created successfully!");
            }

            onClose();
        } catch (error: any) {
            console.error("Failed to save discount", error);
            toast.error(error.response?.data?.message || "Failed to save discount");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!existingDiscount?.id) return;
        if (!confirm("Are you sure you want to remove this discount?")) return;

        try {
            setDeleting(true);
            await deleteDiscount(existingDiscount.id);
            toast.success("Discount removed successfully!");
            onClose();
        } catch (error: any) {
            console.error("Failed to delete discount", error);
            toast.error(error.response?.data?.message || "Failed to remove discount");
        } finally {
            setDeleting(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden max-h-[92vh] flex flex-col"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-[#651313] text-white">
                            <div>
                                <h3 className="text-lg font-bold flex items-center gap-2">
                                    {existingDiscount ? "Edit Active Discount" : "Create Discount"}
                                </h3>
                                <p className="text-xs opacity-80">For: {itemName}</p>
                            </div>
                            <button onClick={onClose} className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors">
                                <XMarkIcon className="h-6 w-6" />
                            </button>
                        </div>

                        {/* Existing Discount Notice Banner */}
                        {existingDiscount && (
                            <div className="bg-amber-50 border-b border-amber-200 px-5 py-3 flex items-start gap-3">
                                <ExclamationCircleIcon className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                                <div className="text-xs text-amber-900 flex-1">
                                    <span className="font-bold">Active discount already exists:</span>{" "}
                                    <span className="font-extrabold text-[#EB4724]">
                                        {existingDiscount.discountValue}
                                        {existingDiscount.discountType === "percentage" ? "%" : "$"} OFF
                                    </span>{" "}
                                    on{" "}
                                    <span className="font-semibold uppercase tracking-wider bg-amber-200 text-amber-950 px-1.5 py-0.5 rounded text-[10px]">
                                        {existingDiscount.platform || "ALL"}
                                    </span>
                                    <p className="mt-0.5 text-amber-700">
                                        You can modify its platform or percentage below, or delete it.
                                    </p>
                                </div>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
                            {/* Target Users */}
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-gray-700">Target Users</label>
                                <div className="flex gap-4">
                                    <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-700">
                                        <input
                                            type="radio"
                                            checked={formData.isGlobal}
                                            onChange={() => setFormData({ ...formData, isGlobal: true })}
                                            className="text-[#EB4724] focus:ring-[#EB4724]"
                                        />
                                        <span>All Users</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-700">
                                        <input
                                            type="radio"
                                            checked={!formData.isGlobal}
                                            onChange={() => setFormData({ ...formData, isGlobal: false })}
                                            className="text-[#EB4724] focus:ring-[#EB4724]"
                                        />
                                        <span>Specific User</span>
                                    </label>
                                </div>
                            </div>

                            {/* Specific User Select */}
                            {!formData.isGlobal && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    className="space-y-1"
                                >
                                    <label className="block text-sm font-medium text-gray-700">Select User</label>
                                    <select
                                        value={formData.userId}
                                        onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
                                        className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#EB4724]/20 focus:border-[#EB4724] text-sm"
                                        required={!formData.isGlobal}
                                    >
                                        <option value="">Select a user</option>
                                        {users.map(user => (
                                            <option key={user.id} value={user.id}>
                                                {user.email} {user.fullname ? `(${user.fullname})` : ""}
                                            </option>
                                        ))}
                                    </select>
                                </motion.div>
                            )}

                            {/* Target Platform (App, Website, or All) */}
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-gray-700">
                                    Target Platform
                                </label>
                                <div className="grid grid-cols-3 gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, platform: "all" })}
                                        className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-xs font-semibold transition-all ${formData.platform === "all"
                                                ? "border-[#EB4724] bg-[#EB4724]/10 text-[#EB4724] shadow-sm"
                                                : "border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100"
                                            }`}
                                    >

                                        <span>Both</span>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, platform: "app" })}
                                        className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-xs font-semibold transition-all ${formData.platform === "app"
                                                ? "border-[#EB4724] bg-[#EB4724]/10 text-[#EB4724] shadow-sm"
                                                : "border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100"
                                            }`}
                                    >

                                        <span>App Only</span>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, platform: "website" })}
                                        className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-xs font-semibold transition-all ${formData.platform === "website"
                                                ? "border-[#EB4724] bg-[#EB4724]/10 text-[#EB4724] shadow-sm"
                                                : "border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100"
                                            }`}
                                    >

                                        <span>Web Only</span>
                                    </button>
                                </div>
                            </div>

                            {/* Discount Type & Value */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Discount Type</label>
                                    <select
                                        value={formData.discountType}
                                        onChange={(e) => setFormData({ ...formData, discountType: e.target.value })}
                                        className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#EB4724]/20 focus:border-[#EB4724] text-sm"
                                    >
                                        <option value="percentage">Percentage (%)</option>
                                        <option value="fixed">Fixed Amount ($)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Value</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={formData.discountValue}
                                        onChange={(e) => setFormData({ ...formData, discountValue: e.target.value })}
                                        className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#EB4724]/20 focus:border-[#EB4724] text-sm font-bold text-gray-800"
                                        placeholder="0.00"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Start & End Date */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Start Date</label>
                                    <input
                                        type="date"
                                        value={formData.startDate}
                                        onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                        className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#EB4724]/20 focus:border-[#EB4724] text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">End Date</label>
                                    <input
                                        type="date"
                                        value={formData.endDate}
                                        onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                        className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#EB4724]/20 focus:border-[#EB4724] text-sm"
                                    />
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-2 pt-3">
                                {existingDiscount && (
                                    <button
                                        type="button"
                                        onClick={handleDelete}
                                        disabled={deleting}
                                        className="px-3 py-2.5 bg-red-50 text-red-600 font-semibold rounded-xl hover:bg-red-100 transition-colors flex items-center justify-center gap-1 text-sm disabled:opacity-50"
                                        title="Remove this discount completely"
                                    >
                                        <TrashIcon className="w-4 h-4" />
                                        <span>{deleting ? "..." : "Delete"}</span>
                                    </button>
                                )}

                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors text-sm"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    disabled={loading || checkingExisting}
                                    className="flex-1 px-4 py-2.5 bg-[#EB4724] text-white font-semibold rounded-xl hover:bg-[#D13D1B] transition-colors disabled:opacity-50 text-sm shadow-md shadow-[#EB4724]/20 flex items-center justify-center gap-1.5"
                                >
                                    <CheckCircleIcon className="w-4 h-4" />
                                    <span>
                                        {loading
                                            ? "Saving..."
                                            : existingDiscount
                                                ? "Update Discount"
                                                : "Apply Discount"}
                                    </span>
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
