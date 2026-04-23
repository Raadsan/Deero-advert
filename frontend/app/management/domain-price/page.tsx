"use client";

import { useState, useEffect } from "react";
import DataTable from "@/components/layout/DataTable";
import { 
    getAllDomainPrices, 
    createDomainPrice, 
    updateDomainPrice, 
    deleteDomainPrice, 
    toggleDomainPriceStatus,
    DomainPriceRecord 
} from "@/api-client/domainPriceApi";
import { 
    PencilIcon, 
    TrashIcon, 
    XMarkIcon, 
    PlusIcon, 
    CheckCircleIcon, 
    XCircleIcon,
    TicketIcon 
} from "@heroicons/react/24/outline";
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from "framer-motion";
import DiscountModal from "@/components/management/DiscountModal";

export default function DomainPriceManagement() {
    const [prices, setPrices] = useState<DomainPriceRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPrice, setEditingPrice] = useState<DomainPriceRecord | null>(null);
    const [discountModal, setDiscountModal] = useState<{ open: boolean, id: string, name: string }>({ open: false, id: "", name: "" });

    // Form State
    const [formData, setFormData] = useState({
        tld: "",
        price: "",
        isActive: true
    });


    const fetchPrices = async () => {
        try {
            setLoading(true);
            const res: any = await getAllDomainPrices();
            const data = res.data?.data || res.data || [];
            setPrices(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Failed to load domain prices", error);
            toast.error("Failed to load domain prices");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPrices();
    }, []);

    const handleAdd = () => {
        setEditingPrice(null);
        setFormData({ tld: "", price: "", isActive: true });
        setIsModalOpen(true);
    };

    const handleEdit = (price: DomainPriceRecord) => {
        setEditingPrice(price);
        setFormData({
            tld: price.tld,
            price: price.price.toString(),
            isActive: price.isActive
        });
        setIsModalOpen(true);
    };


    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this domain price?")) return;
        try {
            await deleteDomainPrice(id);
            toast.success("Domain price deleted successfully");
            fetchPrices();
        } catch (error) {
            console.error("Failed to delete domain price", error);
            toast.error("Failed to delete domain price");
        }
    };

    const handleToggleStatus = async (id: string) => {
        try {
            await toggleDomainPriceStatus(id);
            toast.success("Status updated successfully");
            fetchPrices();
        } catch (error) {
            console.error("Failed to toggle status", error);
            toast.error("Failed to toggle status");
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const payload = {
                tld: formData.tld,
                price: parseFloat(formData.price),
                isActive: formData.isActive
            };


            if (editingPrice) {
                await updateDomainPrice(editingPrice._id, payload);
                toast.success("Domain price updated successfully");
            } else {
                await createDomainPrice(payload);
                toast.success("Domain price created successfully");
            }
            setIsModalOpen(false);
            fetchPrices();
        } catch (error: any) {
            console.error("Failed to save domain price", error);
            toast.error(error.response?.data?.message || "Failed to save domain price");
        }
    };

    const columns = [
        { label: "TLD", key: "tld", render: (row: any) => <span className="font-bold text-[#651313]">{row.tld}</span> },
        { label: "Price", key: "price", render: (row: any) => `$${row.price?.toFixed(2) || "0.00"}` },


        { 
            label: "Status", 
            key: "isActive", 
            render: (row: any) => (
                <button 
                    onClick={() => handleToggleStatus(row._id)}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
                        row.isActive 
                        ? "bg-green-100 text-green-700 hover:bg-green-200" 
                        : "bg-red-100 text-red-700 hover:bg-red-200"
                    }`}
                >
                    {row.isActive ? (
                        <><CheckCircleIcon className="h-3.5 w-3.5" /> Active</>
                    ) : (
                        <><XCircleIcon className="h-3.5 w-3.5" /> Inactive</>
                    )}
                </button>
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
                    <button
                        onClick={() => setDiscountModal({ open: true, id: row.tld, name: `Domain: ${row.tld}` })}
                        className="p-1.5 hover:bg-green-50 text-green-600 rounded-lg transition-colors"
                        title="Apply Discount"
                    >
                        <TicketIcon className="h-4 w-4" />
                    </button>
                </div>
            ),
        },
    ];

    return (
        <div className="space-y-6">
            <DataTable
                title="Domain Prices"
                columns={columns}
                data={prices}
                loading={loading}
                onAddClick={handleAdd}
                onRefresh={fetchPrices}
            />

            {/* Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden"
                        >
                            <div className="flex items-center justify-between p-6 border-b border-gray-100">
                                <h3 className="text-lg font-bold text-[#651313]">
                                    {editingPrice ? "Edit Domain Price" : "Register New Domain"}
                                </h3>
                                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                    <XMarkIcon className="h-6 w-6" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">TLD (e.g. .com or .so)</label>
                                    <input
                                        type="text"
                                        value={formData.tld}
                                        onChange={(e) => setFormData({ ...formData, tld: e.target.value })}
                                        className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#EB4724]/20 focus:border-[#EB4724]"
                                        placeholder="e.g. .com or .so"
                                        required
                                        disabled={!!editingPrice}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
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

                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        id="isActive"
                                        checked={formData.isActive}
                                        onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                        className="w-4 h-4 text-[#EB4724] focus:ring-[#EB4724] border-gray-300 rounded"
                                    />
                                    <label htmlFor="isActive" className="text-sm font-medium text-gray-700 cursor-pointer">
                                        Mark as Active
                                    </label>
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
                                        {editingPrice ? "Save Changes" : "Register Price"}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <DiscountModal 
                isOpen={discountModal.open}
                onClose={() => setDiscountModal({ ...discountModal, open: false })}
                targetType="domain"
                targetId={discountModal.id}
                itemName={discountModal.name}
            />
        </div>
    );
}
