"use client";

import React, { useEffect, useState } from "react";
import DataTable from "@/components/layout/DataTable";
import Modal from "@/components/layout/Modal";
import DeleteConfirmModal from "@/components/layout/DeleteConfirmModal";
import { Edit, Trash2, Globe } from "lucide-react";
import {
    getAllDomainPrices,
    createDomainPrice,
    updateDomainPrice,
    deleteDomainPrice,
} from "@/api/domainPriceApi";

interface DomainPrice {
    _id: string;
    tld: string;
    newPrice: number;
    transferPrice: number;
    renewalPrice: number;
    duration: string;
}

export default function DomainManagementPage() {
    const [data, setData] = useState<DomainPrice[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [deletingName, setDeletingName] = useState("");

    const [formData, setFormData] = useState({
        tld: "",
        newPrice: "",
        transferPrice: "",
        renewalPrice: "",
        duration: "1 Year",
    });

    const fetchDomainPrices = async () => {
        setLoading(true);
        try {
            const res = await getAllDomainPrices();
            // Adjust based on the provided JSON structure: { success: true, prices: [...] }
            const items = (res.data as any).prices || (Array.isArray(res.data) ? res.data : []);
            setData(items);
        } catch (err) {
            console.error("Failed to load domain prices", err);
            setData([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDomainPrices();
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const payload = {
                tld: formData.tld,
                newPrice: parseFloat(formData.newPrice),
                transferPrice: parseFloat(formData.transferPrice),
                renewalPrice: parseFloat(formData.renewalPrice),
                duration: formData.duration,
            };

            if (editingId) {
                await updateDomainPrice(editingId, payload);
            } else {
                await createDomainPrice(payload);
            }
            setIsModalOpen(false);
            resetForm();
            fetchDomainPrices();
        } catch (err: any) {
            console.error("Failed to save domain price", err);
            alert(err.response?.data?.message || "Failed to save domain price");
        }
    };

    const resetForm = () => {
        setFormData({
            tld: "",
            newPrice: "",
            transferPrice: "",
            renewalPrice: "",
            duration: "1 Year",
        });
        setEditingId(null);
    };

    const handleEdit = (item: DomainPrice) => {
        setEditingId(item._id);
        setFormData({
            tld: item.tld,
            newPrice: item.newPrice.toString(),
            transferPrice: item.transferPrice.toString(),
            renewalPrice: item.renewalPrice.toString(),
            duration: item.duration || "1 Year",
        });
        setIsModalOpen(true);
    };

    const handleDelete = (id: string, name: string) => {
        setDeletingId(id);
        setDeletingName(name);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!deletingId) return;
        try {
            await deleteDomainPrice(deletingId);
            fetchDomainPrices();
        } catch (err) {
            console.error("Failed to delete domain price", err);
        } finally {
            setIsDeleteModalOpen(false);
            setDeletingId(null);
            setDeletingName("");
        }
    };

    const columns = [
        {
            label: "Domain",
            key: "tld",
            render: (row: DomainPrice) => (
                <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded bg-blue-50 text-blue-600">
                        <Globe className="h-4 w-4" />
                    </div>
                    <span className="font-bold text-gray-900 text-base">{row.tld}</span>
                </div>
            ),
        },
        {
            label: "New Price",
            key: "newPrice",
            render: (row: DomainPrice) => (
                <div className="flex flex-col">
                    <span className="font-bold text-gray-900 text-base">${row.newPrice.toFixed(2)} USD</span>
                    <span className="text-xs text-[#EB4724]">{row.duration || "1 Year"}</span>
                </div>
            ),
        },
        {
            label: "Transfer",
            key: "transferPrice",
            render: (row: DomainPrice) => (
                <div className="flex flex-col">
                    <span className="font-bold text-gray-900 text-base">${row.transferPrice.toFixed(2)} USD</span>
                    <span className="text-xs text-[#EB4724]">{row.duration || "1 Year"}</span>
                </div>
            ),
        },
        {
            label: "Renewal",
            key: "renewalPrice",
            render: (row: DomainPrice) => (
                <div className="flex flex-col">
                    <span className="font-bold text-gray-900 text-base">${row.renewalPrice.toFixed(2)} USD</span>
                    <span className="text-xs text-[#EB4724]">{row.duration || "1 Year"}</span>
                </div>
            ),
        },
        {
            label: "Actions",
            key: "actions",
            width: "100px",
            render: (row: DomainPrice) => (
                <div className="flex gap-2">
                    <button
                        className="p-2 rounded-lg hover:bg-blue-50 text-blue-600 transition-colors"
                        title="Edit"
                        onClick={() => handleEdit(row)}
                    >
                        <Edit className="h-4 w-4" />
                    </button>
                    <button
                        className="p-2 rounded-lg hover:bg-red-50 text-red-600 transition-colors"
                        title="Delete"
                        onClick={() => handleDelete(row._id, row.tld)}
                    >
                        <Trash2 className="h-4 w-4" />
                    </button>
                </div>
            ),
        },
    ];

    return (
        <div className="space-y-6">
            <DataTable
                title="Domain Pricing Management"
                columns={columns}
                data={data}
                showAddButton
                onAddClick={() => {
                    resetForm();
                    setIsModalOpen(true);
                }}
                loading={loading}
            />

            <DeleteConfirmModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                itemName={deletingName}
            />

            <Modal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    resetForm();
                }}
                title={editingId ? "Edit Domain Price" : "Add New Domain Price"}
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-0.5">
                            <label className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">
                                Domain TLD (e.g. .com) <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="tld"
                                required
                                placeholder=".com"
                                value={formData.tld}
                                onChange={handleInputChange}
                                className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#EB4724] focus:border-[#EB4724]"
                            />
                        </div>
                        <div className="space-y-0.5">
                            <label className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">
                                Duration <span className="text-red-500">*</span>
                            </label>
                            <select
                                name="duration"
                                required
                                value={formData.duration}
                                onChange={handleInputChange}
                                className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#EB4724] focus:border-[#EB4724] bg-white text-gray-900"
                            >
                                <option value="1 Year">1 Year</option>
                                <option value="2 Years">2 Years</option>
                                <option value="3 Years">3 Years</option>
                                <option value="5 Years">5 Years</option>
                                <option value="10 Years">10 Years</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="space-y-0.5">
                            <label className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">
                                New Price <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                name="newPrice"
                                required
                                value={formData.newPrice}
                                onChange={handleInputChange}
                                className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#EB4724] focus:border-[#EB4724]"
                            />
                        </div>
                        <div className="space-y-0.5">
                            <label className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">
                                Transfer Price <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                name="transferPrice"
                                required
                                value={formData.transferPrice}
                                onChange={handleInputChange}
                                className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#EB4724] focus:border-[#EB4724]"
                            />
                        </div>
                        <div className="space-y-0.5">
                            <label className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">
                                Renewal Price <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                name="renewalPrice"
                                required
                                value={formData.renewalPrice}
                                onChange={handleInputChange}
                                className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#EB4724] focus:border-[#EB4724]"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-3 border-t border-gray-100 mt-4">
                        <button
                            type="button"
                            onClick={() => {
                                setIsModalOpen(false);
                                resetForm();
                            }}
                            className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-3 py-1.5 text-xs font-medium text-white bg-[#651313] rounded-lg hover:bg-[#500f0f]"
                        >
                            {editingId ? "Update" : "Save"}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
