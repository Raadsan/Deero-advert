"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { toast } from "react-hot-toast";
import { createDiscount } from "@/api-client/discountApi";
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
        startDate: "",
        endDate: "",
        isGlobal: true
    });
    const [loading, setLoading] = useState(false);
    const [users, setUsers] = useState<any[]>([]);

    useEffect(() => {
        if (isOpen) {
            fetchUsers();
        }
    }, [isOpen]);

    const fetchUsers = async () => {
        try {
            const res = await getAllUsers();
            setUsers(res.data);
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
                targetId,
                discountValue: parseFloat(formData.discountValue),
                discountType: formData.discountType,
                userId: formData.isGlobal ? null : parseInt(formData.userId),
                startDate: formData.startDate ? new Date(formData.startDate).toISOString() : null,
                endDate: formData.endDate ? new Date(formData.endDate).toISOString() : null,
            };

            await createDiscount(payload);
            toast.success("Discount created successfully!");
            onClose();
        } catch (error: any) {
            console.error("Failed to create discount", error);
            toast.error(error.response?.data?.message || "Failed to create discount");
        } finally {
            setLoading(false);
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
                        className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden"
                    >
                        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-[#651313] text-white">
                            <div>
                                <h3 className="text-lg font-bold">Create Discount</h3>
                                <p className="text-xs opacity-80">For: {itemName}</p>
                            </div>
                            <button onClick={onClose} className="text-white/80 hover:text-white">
                                <XMarkIcon className="h-6 w-6" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Target Users</label>
                                <div className="flex gap-4">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input 
                                            type="radio" 
                                            checked={formData.isGlobal} 
                                            onChange={() => setFormData({ ...formData, isGlobal: true })} 
                                            className="text-[#EB4724] focus:ring-[#EB4724]"
                                        />
                                        <span className="text-sm">All Users</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input 
                                            type="radio" 
                                            checked={!formData.isGlobal} 
                                            onChange={() => setFormData({ ...formData, isGlobal: false })} 
                                            className="text-[#EB4724] focus:ring-[#EB4724]"
                                        />
                                        <span className="text-sm">Specific User</span>
                                    </label>
                                </div>
                            </div>

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
                                        className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#EB4724]/20 focus:border-[#EB4724]"
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

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Discount Type</label>
                                    <select
                                        value={formData.discountType}
                                        onChange={(e) => setFormData({ ...formData, discountType: e.target.value })}
                                        className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#EB4724]/20 focus:border-[#EB4724]"
                                    >
                                        <option value="percentage">Percentage (%)</option>
                                        <option value="fixed">Fixed Amount ($)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Value</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={formData.discountValue}
                                        onChange={(e) => setFormData({ ...formData, discountValue: e.target.value })}
                                        className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#EB4724]/20 focus:border-[#EB4724]"
                                        placeholder="0.00"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                                    <input
                                        type="date"
                                        value={formData.startDate}
                                        onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                        className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#EB4724]/20 focus:border-[#EB4724]"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                                    <input
                                        type="date"
                                        value={formData.endDate}
                                        onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                        className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#EB4724]/20 focus:border-[#EB4724]"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 px-4 py-2 bg-[#EB4724] text-white font-medium rounded-xl hover:bg-[#D13D1B] transition-colors disabled:opacity-50"
                                >
                                    {loading ? "Creating..." : "Apply Discount"}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
