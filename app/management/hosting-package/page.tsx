"use client";

import { useState, useEffect } from "react";
import DataTable from "@/components/layout/DataTable";
import { getAllPackages, createPackage, updatePackage, deletePackage, HostingPackage } from "@/api/hostingPackageApi";
import { PencilIcon, TrashIcon, XMarkIcon, PlusIcon } from "@heroicons/react/24/outline";
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from "framer-motion";

export default function HostingPackageManagement() {
    const [packages, setPackages] = useState<HostingPackage[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPackage, setEditingPackage] = useState<HostingPackage | null>(null);

    // Form State
    const [formData, setFormData] = useState({
        name: "",
        desc: "",
        price: "",
        pudgeText: "",
        features: ""
    });

    const fetchPackages = async () => {
        try {
            setLoading(true);
            const res: any = await getAllPackages();
            const data = res.data?.data || res.data || [];
            setPackages(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Failed to load packages", error);
            toast.error("Failed to load packages");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPackages();
    }, []);

    const handleAdd = () => {
        setEditingPackage(null);
        setFormData({ name: "", desc: "", price: "", pudgeText: "", features: "" });
        setIsModalOpen(true);
    };

    const handleEdit = (pkg: HostingPackage) => {
        setEditingPackage(pkg);
        setFormData({
            name: pkg.name,
            desc: pkg.desc || "",
            price: pkg.price.toString(),
            pudgeText: pkg.pudgeText || "",
            features: pkg.features.join(", ")
        });
        setIsModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this package?")) return;
        try {
            await deletePackage(id);
            toast.success("Package deleted successfully");
            fetchPackages();
        } catch (error) {
            console.error("Failed to delete package", error);
            toast.error("Failed to delete package");
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const payload = {
                ...formData,
                price: parseFloat(formData.price),
                features: formData.features.split(',').map(f => f.trim()).filter(f => f !== "")
            };

            if (editingPackage) {
                await updatePackage(editingPackage._id, payload);
                toast.success("Package updated successfully");
            } else {
                await createPackage(payload);
                toast.success("Package created successfully");
            }
            setIsModalOpen(false);
            fetchPackages();
        } catch (error) {
            console.error("Failed to save package", error);
            toast.error("Failed to save package");
        }
    };

    const columns = [
        { label: "Name", key: "name" },
        { label: "Price", key: "price", render: (row: any) => `$${row.price}` },
        { label: "Description", key: "desc", render: (row: any) => <span className="text-xs text-gray-500 truncate max-w-[200px] block">{row.desc}</span> },
        { label: "Badge", key: "pudgeText", render: (row: any) => row.pudgeText ? <span className="bg-orange-100 text-orange-700 text-xs px-2 py-1 rounded-full">{row.pudgeText}</span> : "-" },
        {
            label: "Features",
            key: "features",
            render: (row: any) => (
                <div className="flex flex-wrap gap-1">
                    {row.features?.slice(0, 2).map((f: string, i: number) => (
                        <span key={i} className="bg-gray-100 text-gray-600 text-[10px] px-2 py-0.5 rounded">{f}</span>
                    ))}
                    {row.features?.length > 2 && <span className="text-[10px] text-gray-400">+{row.features.length - 2} more</span>}
                </div>
            )
        },
        {
            label: "Actions",
            key: "actions",
            render: (row: any) => (
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => handleEdit(row)}
                        className="p-1.5 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors"
                        title="Edit"
                    >
                        <PencilIcon className="h-4 w-4" />
                    </button>
                    <button
                        onClick={() => handleDelete(row._id)}
                        className="p-1.5 hover:bg-red-50 text-red-600 rounded-lg transition-colors"
                        title="Delete"
                    >
                        <TrashIcon className="h-4 w-4" />
                    </button>
                </div>
            ),
        },
    ];

    return (
        <div className="space-y-6">
            <DataTable
                title="Hosting Packages"
                columns={columns}
                data={packages}
                loading={loading}
                onAddClick={handleAdd}
            />

            {/* Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden"
                        >
                            <div className="flex items-center justify-between p-6 border-b border-gray-100">
                                <h3 className="text-lg font-bold text-[#651313]">
                                    {editingPackage ? "Edit Package" : "Create New Package"}
                                </h3>
                                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                    <XMarkIcon className="h-6 w-6" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-6 space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Package Name</label>
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#EB4724]/20 focus:border-[#EB4724]"
                                            placeholder="e.g. Enterprise"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Price (Monthly)</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={formData.price}
                                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                            className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#EB4724]/20 focus:border-[#EB4724]"
                                            placeholder="0.00"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                    <textarea
                                        value={formData.desc}
                                        onChange={(e) => setFormData({ ...formData, desc: e.target.value })}
                                        className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#EB4724]/20 focus:border-[#EB4724]"
                                        placeholder="Brief description of the package..."
                                        rows={2}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Badge Text (Optional)</label>
                                    <input
                                        type="text"
                                        value={formData.pudgeText}
                                        onChange={(e) => setFormData({ ...formData, pudgeText: e.target.value })}
                                        className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#EB4724]/20 focus:border-[#EB4724]"
                                        placeholder="e.g. Best Value, Save 15%"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Features (Comma separated)</label>
                                    <textarea
                                        value={formData.features}
                                        onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                                        className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#EB4724]/20 focus:border-[#EB4724]"
                                        placeholder="Unlimited Space, 24/7 Support, Free SSL..."
                                        rows={3}
                                    />
                                    <p className="text-xs text-gray-400 mt-1">Separate features with commas.</p>
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 px-4 py-2 bg-[#651313] text-white font-medium rounded-xl hover:bg-[#8B1A1A] transition-colors"
                                    >
                                        {editingPackage ? "Save Changes" : "Create Package"}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
