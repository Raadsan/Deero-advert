"use client";
export const dynamic = 'force-static';

import React, { useEffect, useState } from "react";
import Image from "next/image";
import DataTable from "@/components/layout/DataTable";
import Modal from "@/components/layout/Modal";
import DeleteConfirmModal from "@/components/layout/DeleteConfirmModal";
import { Trash2, Camera, X, Pencil } from "lucide-react";
import {
    getHeroHomes,
    createHeroHome,
    updateHeroHome,
    deleteHeroHome
} from "@/api-client/heroHomeApi";
import { getImageUrl } from "@/utils/url";
import { compressImage } from "@/utils/compressImage";
import { toast } from "react-hot-toast";

export default function HeroHomePage() {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [deletingId, setDeletingId] = useState<number | null>(null);
    const [deletingName, setDeletingName] = useState("");
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        sortOrder: 0,
        isActive: true,
        image: null as File | null,
        imagePreview: "",
    });

    const fetchHeros = async () => {
        setLoading(true);
        try {
            const res = await getHeroHomes();
            const heros = res.data || [];
            setData(
                heros.map((h: any) => ({
                    ...h,
                    image: getImageUrl(h.image),
                }))
            );
        } catch (err) {
            console.error("Failed to load hero homes", err);
            setData([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHeros();
    }, []);

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value, type } = e.target;
        if (type === "checkbox") {
            const checked = (e.target as HTMLInputElement).checked;
            setFormData((prev) => ({ ...prev, [name]: checked }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const compressedFile = await compressImage(file);
            const newPreview = URL.createObjectURL(compressedFile);

            setFormData((prev) => ({
                ...prev,
                image: compressedFile,
                imagePreview: newPreview,
            }));

            e.target.value = "";
        }
    };

    const removeImage = () => {
        setFormData((prev) => ({
            ...prev,
            image: null,
            imagePreview: "",
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.image && !formData.imagePreview) {
            toast.error("Image is required");
            return;
        }

        const formDataToSend = new FormData();
        formDataToSend.append("title", formData.title);
        formDataToSend.append("description", formData.description);
        formDataToSend.append("sortOrder", formData.sortOrder.toString());
        formDataToSend.append("isActive", formData.isActive.toString());

        if (formData.image) {
            formDataToSend.append("image", formData.image);
        }

        try {
            if (editingId) {
                await updateHeroHome(editingId, formDataToSend);
                toast.success("Hero slide updated successfully");
            } else {
                await createHeroHome(formDataToSend);
                toast.success("Hero slide added successfully");
            }
            setIsModalOpen(false);
            setEditingId(null);
            setFormData({
                title: "",
                description: "",
                sortOrder: 0,
                isActive: true,
                image: null,
                imagePreview: "",
            });
            fetchHeros();
        } catch (err: any) {
            console.error("Failed to save hero slide", err);
            toast.error(err.response?.data?.message || "Failed to save hero slide");
        }
    };

    const handleDelete = (id: number, title: string) => {
        setDeletingId(id);
        setDeletingName(title || "Hero Slide");
        setIsDeleteModalOpen(true);
    };

    const handleEdit = (row: any) => {
        setEditingId(row.id);
        setFormData({
            title: row.title || "",
            description: row.description || "",
            sortOrder: row.sortOrder || 0,
            isActive: row.isActive,
            image: null,
            imagePreview: row.image || "",
        });
        setIsModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!deletingId) return;
        try {
            await deleteHeroHome(deletingId);
            toast.success("Hero slide deleted successfully");
            fetchHeros();
        } catch (err) {
            console.error("Failed to delete hero slide", err);
            toast.error("Failed to delete hero slide");
        } finally {
            setIsDeleteModalOpen(false);
            setDeletingId(null);
            setDeletingName("");
        }
    };

    const columns = [
        {
            label: "Image",
            key: "image",
            width: "10%",
            render: (row: any) => (
                <div className="h-10 w-16 relative bg-gray-100 rounded overflow-hidden">
                    {row.image ? (
                        <Image
                            src={row.image}
                            alt="Hero Image"
                            fill
                            unoptimized
                            className="object-cover"
                        />
                    ) : (
                        <span className="text-gray-400 text-xs italic">No image</span>
                    )}
                </div>
            ),
        },
        {
            label: "Title",
            key: "title",
            width: "25%",
        },
        {
            label: "Description",
            key: "description",
            width: "35%",
            render: (row: any) => <p className="line-clamp-2 text-gray-700">{row.description}</p>,
        },
        {
            label: "Status",
            key: "isActive",
            render: (row: any) => (
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${row.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                    {row.isActive ? "Active" : "Inactive"}
                </span>
            ),
        },
        {
            label: "Order",
            key: "sortOrder",
            width: "10%",
        },
        {
            label: "Actions",
            key: "actions",
            width: "100px",
            render: (row: any) => (
                <div className="flex gap-2">
                    <button
                        className="p-2 rounded-lg hover:bg-blue-50 text-blue-600 transition-colors"
                        title="Edit"
                        onClick={() => handleEdit(row)}
                    >
                        <Pencil className="h-4 w-4" />
                    </button>
                    <button
                        className="p-2 rounded-lg hover:bg-red-50 text-red-600 transition-colors"
                        title="Delete"
                        onClick={() => handleDelete(row.id, row.title)}
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
                title="Hero Home Slides"
                columns={columns}
                data={data}
                showAddButton
                onAddClick={() => setIsModalOpen(true)}
                onRefresh={fetchHeros}
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
                    setEditingId(null);
                    setFormData({
                        title: "",
                        description: "",
                        sortOrder: 0,
                        isActive: true,
                        image: null,
                        imagePreview: "",
                    });
                }}
                title={editingId ? "Edit Hero Slide" : "Add New Hero Slide"}
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">
                            Hero Image <span className="text-red-500">*</span>
                        </label>
                        <div className="flex gap-4">
                            {formData.imagePreview ? (
                                <div className="relative h-24 w-40 rounded-lg border border-gray-200 overflow-hidden group">
                                    <img src={formData.imagePreview} alt="preview" className="h-full w-full object-cover" />
                                    <button
                                        type="button"
                                        onClick={removeImage}
                                        className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                </div>
                            ) : (
                                <label className="flex flex-col items-center justify-center h-24 w-40 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors">
                                    <Camera className="h-6 w-6 text-gray-400" />
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        className="hidden"
                                    />
                                </label>
                            )}
                        </div>
                    </div>

                    <div className="space-y-0.5">
                        <label className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">
                            Title <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="title"
                            required
                            value={formData.title}
                            onChange={handleInputChange}
                            className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#EB4724]"
                        />
                    </div>

                    <div className="space-y-0.5">
                        <label className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">
                            Description <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            name="description"
                            required
                            rows={3}
                            value={formData.description}
                            onChange={handleInputChange}
                            className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#EB4724] resize-none"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-0.5">
                            <label className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">
                                Sort Order
                            </label>
                            <input
                                type="number"
                                name="sortOrder"
                                value={formData.sortOrder}
                                onChange={handleInputChange}
                                className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#EB4724]"
                            />
                        </div>

                        <div className="flex items-center space-x-2 pt-5">
                            <input
                                type="checkbox"
                                name="isActive"
                                checked={formData.isActive}
                                onChange={handleInputChange}
                                className="h-4 w-4 text-[#EB4724] border-gray-300 rounded focus:ring-[#EB4724]"
                            />
                            <label className="text-sm font-medium text-gray-700">
                                Active Status
                            </label>
                        </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-3 border-t border-gray-100 mt-4">
                        <button
                            type="button"
                            onClick={() => {
                                setIsModalOpen(false);
                                setEditingId(null);
                            }}
                            className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-3 py-1.5 text-xs font-medium text-white bg-[#651313] rounded-lg hover:bg-[#500f0f]"
                        >
                            Save
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
