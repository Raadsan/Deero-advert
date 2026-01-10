"use client";

import { useState, useEffect } from "react";
import DataTable from "@/components/layout/DataTable";
import Modal from "@/components/layout/Modal";
import DeleteConfirmModal from "@/components/layout/DeleteConfirmModal";
import {
    getAllDomainPrices,
    createDomainPrice,
    updateDomainPrice,
    deleteDomainPrice
} from "@/api/domainPriceApi";
import { Edit, Trash2 } from "lucide-react";

interface DomainPrice {
    _id: string;
    tld: string;
    newPrice: number;
    transferPrice: number;
    renewalPrice: number;
}

export default function DomainPricingManagement() {
    const [prices, setPrices] = useState<DomainPrice[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [currentPrice, setCurrentPrice] = useState<DomainPrice | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [deletingName, setDeletingName] = useState("");

    // Form state
    const [formData, setFormData] = useState({
        tld: "",
        newPrice: "",
        transferPrice: "",
        renewalPrice: ""
    });

    useEffect(() => {
        fetchPrices();
    }, []);

    const fetchPrices = async () => {
        try {
            setLoading(true);
            const response = await getAllDomainPrices();
            const data = Array.isArray(response.data) ? response.data : response.data.prices || [];
            setPrices(data);
        } catch (error) {
            console.error("Error fetching domain prices:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (price?: DomainPrice) => {
        if (price) {
            setCurrentPrice(price);
            setFormData({
                tld: price.tld,
                newPrice: price.newPrice.toString(),
                transferPrice: price.transferPrice.toString(),
                renewalPrice: price.renewalPrice.toString()
            });
        } else {
            setCurrentPrice(null);
            setFormData({
                tld: "",
                newPrice: "",
                transferPrice: "",
                renewalPrice: ""
            });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setCurrentPrice(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const data = {
                tld: formData.tld,
                newPrice: Number(formData.newPrice),
                transferPrice: Number(formData.transferPrice),
                renewalPrice: Number(formData.renewalPrice),
                duration: "1 Year"
            };

            if (currentPrice) {
                await updateDomainPrice(currentPrice._id, data);
            } else {
                await createDomainPrice(data);
            }
            fetchPrices();
            handleCloseModal();
        } catch (error: any) {
            console.error("Error saving domain price:", error);
            const msg = error.response?.data?.message || "Failed to save domain price";
            alert(msg);
        }
    };

    const handleDelete = (id: string, tld: string) => {
        setDeletingId(id);
        setDeletingName(tld);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!deletingId) return;
        try {
            await deleteDomainPrice(deletingId);
            fetchPrices();
        } catch (error) {
            console.error("Error deleting domain price:", error);
            alert("Failed to delete domain price");
        } finally {
            setIsDeleteModalOpen(false);
            setDeletingId(null);
            setDeletingName("");
        }
    };

    const columns = [
        {
            label: "TLD",
            key: "tld",
            render: (row: DomainPrice) => <span className="font-bold text-[#651313]">{row.tld}</span>
        },
        {
            label: "Register Price",
            key: "newPrice",
            render: (row: DomainPrice) => <span>${row.newPrice}</span>
        },
        {
            label: "Transfer Price",
            key: "transferPrice",
            render: (row: DomainPrice) => <span>${row.transferPrice}</span>
        },
        {
            label: "Renewal Price",
            key: "renewalPrice",
            render: (row: DomainPrice) => <span>${row.renewalPrice}</span>
        },
        {
            label: "Actions",
            key: "actions",
            render: (row: DomainPrice) => (
                <div className="flex gap-2">
                    <button
                        onClick={() => handleOpenModal(row)}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                        title="Edit"
                    >
                        <Edit className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => handleDelete(row._id, row.tld)}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                        title="Delete"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            )
        }
    ];

    return (
        <div className="p-6">
            <DataTable
                title="Domain Pricing Management"
                columns={columns}
                data={prices}
                loading={loading}
                showAddButton={true}
                onAddClick={() => handleOpenModal()}
            />

            <DeleteConfirmModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                itemName={deletingName}
            />

            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={currentPrice ? "Edit Domain Price" : "Add New Domain Price"}
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Domain TLD (e.g., .com)
                        </label>
                        <input
                            type="text"
                            required
                            value={formData.tld}
                            onChange={(e) => setFormData({ ...formData, tld: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#EB4724] focus:border-[#EB4724] outline-none"
                            placeholder=".com"
                        />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Register Price
                            </label>
                            <input
                                type="number"
                                required
                                step="0.01"
                                min="0"
                                value={formData.newPrice}
                                onChange={(e) => setFormData({ ...formData, newPrice: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#EB4724] focus:border-[#EB4724] outline-none"
                                placeholder="0.00"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Transfer Price
                            </label>
                            <input
                                type="number"
                                required
                                step="0.01"
                                min="0"
                                value={formData.transferPrice}
                                onChange={(e) => setFormData({ ...formData, transferPrice: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#EB4724] focus:border-[#EB4724] outline-none"
                                placeholder="0.00"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Renewal Price
                            </label>
                            <input
                                type="number"
                                required
                                step="0.01"
                                min="0"
                                value={formData.renewalPrice}
                                onChange={(e) => setFormData({ ...formData, renewalPrice: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#EB4724] focus:border-[#EB4724] outline-none"
                                placeholder="0.00"
                            />
                        </div>
                    </div>
                    <div className="flex justify-end gap-3 mt-6">
                        <button
                            type="button"
                            onClick={handleCloseModal}
                            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-[#651313] text-white rounded-lg hover:bg-[#500f0f] transition-colors"
                        >
                            {currentPrice ? "Update Price" : "Add Price"}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
