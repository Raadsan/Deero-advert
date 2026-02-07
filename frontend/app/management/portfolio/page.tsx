"use client";
export const dynamic = 'force-static';

import React, { useEffect, useState } from "react";
import Image from "next/image";
import DataTable from "@/components/layout/DataTable";
import Modal from "@/components/layout/Modal";
import DeleteConfirmModal from "@/components/layout/DeleteConfirmModal";
import { Edit, Trash2, Camera, X } from "lucide-react";
import {
    getPortfolios,
    createPortfolio,
    updatePortfolio,
    deletePortfolio,
    deleteGalleryImage,
} from "@/api/portfolioApi";
import { getImageUrl } from "@/utils/url";

export default function PortfolioManagementPage() {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [deletingName, setDeletingName] = useState("");
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        year: "",
        industry: "",
        mainImage: null as File | null,
        mainImagePreview: "",
        galleryImages: [] as File[],
        galleryPreviews: [] as string[],
        existingGallery: [] as string[],
    });

    // Fetch portfolios from backend
    const fetchPortfolios = async () => {
        setLoading(true);
        try {
            const res = await getPortfolios();
            const items = res.data.success
                ? res.data.portfolios || res.data.portfolio || []
                : Array.isArray(res.data)
                    ? res.data
                    : [];

            setData(
                [...items].reverse().map((p: any) => ({
                    _id: p._id,
                    title: p.title || "",
                    description: p.description || "",
                    industry: p.industry || "",
                    year: p.year || "",
                    mainImage: getImageUrl(p.mainImage),
                    gallery: p.gallery || [],
                    createdAt: p.createdAt || p.updatedAt || "",
                }))
            );
        } catch (err) {
            console.error("Failed to load portfolios", err);
            setData([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPortfolios();
    }, []);

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleMainImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 50 * 1024 * 1024) {
                alert("File is too large. Please select an image smaller than 50MB.");
                e.target.value = "";
                return;
            }
            setFormData((prev) => ({
                ...prev,
                mainImage: file,
                mainImagePreview: URL.createObjectURL(file),
            }));
        }
    };

    const handleGalleryImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length > 0) {
            const validFiles = files.filter(f => f.size <= 50 * 1024 * 1024);
            if (validFiles.length !== files.length) {
                alert("Some files were too large and were skipped.");
            }
            const previews = validFiles.map(f => URL.createObjectURL(f));
            setFormData((prev) => ({
                ...prev,
                galleryImages: [...prev.galleryImages, ...validFiles],
                galleryPreviews: [...prev.galleryPreviews, ...previews],
            }));
        }
    };

    const removeGalleryPreview = (index: number) => {
        setFormData((prev) => ({
            ...prev,
            galleryImages: prev.galleryImages.filter((_, i) => i !== index),
            galleryPreviews: prev.galleryPreviews.filter((_, i) => i !== index),
        }));
    };

    const removeExistingGalleryImage = async (portfolioId: string, imagePath: string) => {
        if (!confirm("Are you sure you want to delete this gallery image?")) return;
        try {
            await deleteGalleryImage(portfolioId, imagePath);
            setFormData((prev) => ({
                ...prev,
                existingGallery: prev.existingGallery.filter(img => img !== imagePath),
            }));
        } catch (err) {
            console.error("Failed to delete gallery image", err);
            alert("Failed to delete gallery image");
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const formDataToSend = new FormData();
        formDataToSend.append("title", formData.title);
        formDataToSend.append("description", formData.description);
        formDataToSend.append("year", formData.year);
        formDataToSend.append("industry", formData.industry);

        if (formData.mainImage) {
            formDataToSend.append("mainImage", formData.mainImage);
        }

        formData.galleryImages.forEach((file) => {
            formDataToSend.append("gallery", file);
        });

        try {
            if (editingId) {
                await updatePortfolio(editingId, formDataToSend);
            } else {
                if (!formData.mainImage) {
                    alert("Main image is required");
                    return;
                }
                await createPortfolio(formDataToSend);
            }
            setIsModalOpen(false);
            resetForm();
            fetchPortfolios();
        } catch (err: any) {
            console.error("Failed to save portfolio", err);
            alert(err.response?.data?.message || "Failed to save portfolio");
        }
    };

    const handleDelete = async (id: string, title: string) => {
        setDeletingId(id);
        setDeletingName(title);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!deletingId) return;
        try {
            await deletePortfolio(deletingId);
            fetchPortfolios();
        } catch (err) {
            console.error("Failed to delete portfolio", err);
        } finally {
            setIsDeleteModalOpen(false);
            setDeletingId(null);
            setDeletingName("");
        }
    };

    const handleEdit = (portfolio: any) => {
        setEditingId(portfolio._id);

        setFormData({
            title: portfolio.title,
            description: portfolio.description || "",
            year: portfolio.year || "",
            industry: portfolio.industry || "",
            mainImage: null,
            mainImagePreview: portfolio.mainImage,
            galleryImages: [],
            galleryPreviews: [],
            existingGallery: portfolio.gallery || [],
        });
        setIsModalOpen(true);
    };

    const resetForm = () => {
        setEditingId(null);
        setFormData({
            title: "",
            description: "",
            year: "",
            industry: "",
            mainImage: null,
            mainImagePreview: "",
            galleryImages: [],
            galleryPreviews: [],
            existingGallery: [],
        });
    };

    const columns = [
        {
            label: "Main Image",
            key: "mainImage",
            render: (row: any) => (
                <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-md border border-gray-100 bg-gray-50">
                    <Image
                        src={row.mainImage || "/logo deero-02 .svg"}
                        alt={row.title}
                        width={48}
                        height={48}
                        unoptimized
                        className="h-full w-full object-cover"
                        onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = "/logo deero-02 .svg";
                        }}
                    />
                </div>
            ),
        },
        { label: "Title", key: "title" },
        {
            label: "Description",
            key: "description",
            render: (row: any) => (
                <span className="text-xs text-gray-500 line-clamp-1 max-w-[200px]">
                    {row.description}
                </span>
            ),
        },
        {
            label: "Gallery",
            key: "gallery",
            render: (row: any) => (
                <span className="text-xs text-gray-500">
                    {row.gallery?.length || 0} images
                </span>
            ),
        },
        { label: "Industry", key: "industry" },
        { label: "Year", key: "year" },
        {
            label: "Date",
            key: "createdAt",
            render: (row: any) => {
                const date = row.createdAt ? new Date(row.createdAt) : null;
                const isValidDate = date && !isNaN(date.getTime());
                return (
                    <span className="text-xs text-gray-500">
                        {isValidDate ? date.toLocaleDateString() : "-"}
                    </span>
                );
            },
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
                        <Edit className="h-4 w-4" />
                    </button>
                    <button
                        className="p-2 rounded-lg hover:bg-red-50 text-red-600 transition-colors"
                        title="Delete"
                        onClick={() => handleDelete(row._id, row.title)}
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
                title="Portfolio Items"
                columns={columns}
                data={data}
                showAddButton
                onAddClick={() => setIsModalOpen(true)}
                onRefresh={fetchPortfolios}
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
                title={editingId ? "Edit Portfolio Item" : "Add New Portfolio Item"}
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Main Image Upload */}
                    <div className="space-y-0.5">
                        <label className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">
                            Main Image {!editingId && <span className="text-red-500">*</span>}
                        </label>
                        <div className="flex items-center gap-3">
                            <div className="relative h-20 w-20 rounded-md bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors group overflow-hidden">
                                {formData.mainImagePreview ? (
                                    <img
                                        src={formData.mainImagePreview}
                                        alt="Preview"
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <Camera className="h-6 w-6 text-gray-400 group-hover:text-[#EB4724] transition-colors" />
                                )}
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleMainImageChange}
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                />
                            </div>
                            <div className="flex-1">
                                <p className="text-xs text-gray-500">
                                    {formData.mainImage
                                        ? formData.mainImage.name
                                        : editingId
                                            ? "Click to change main image"
                                            : "Click to upload main image"}
                                </p>
                                {formData.mainImage && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setFormData((prev) => ({
                                                ...prev,
                                                mainImage: null,
                                                mainImagePreview: editingId ? prev.mainImagePreview : "",
                                            }));
                                        }}
                                        className="text-xs text-red-500 hover:text-red-700 mt-1"
                                    >
                                        Remove
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Title */}
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
                            className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#EB4724] focus:border-[#EB4724]"
                        />
                    </div>

                    {/* Description */}
                    <div className="space-y-0.5">
                        <label className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">
                            Description
                        </label>
                        <textarea
                            name="description"
                            rows={3}
                            value={formData.description}
                            onChange={handleInputChange}
                            className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#EB4724] focus:border-[#EB4724]"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {/* Year */}
                        <div className="space-y-0.5">
                            <label className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">
                                Year
                            </label>
                            <input
                                type="text"
                                name="year"
                                value={formData.year}
                                onChange={handleInputChange}
                                className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#EB4724] focus:border-[#EB4724]"
                                placeholder="e.g. 2021"
                            />
                        </div>

                        {/* Industry */}
                        <div className="space-y-0.5">
                            <label className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">
                                Industry
                            </label>
                            <input
                                type="text"
                                name="industry"
                                value={formData.industry}
                                onChange={handleInputChange}
                                className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#EB4724] focus:border-[#EB4724]"
                                placeholder="e.g. Healthcare"
                            />
                        </div>
                    </div>

                    {/* Gallery Images */}
                    <div className="space-y-2">
                        <label className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">
                            Gallery Images
                        </label>

                        {/* Existing Gallery (for edit mode) */}
                        {editingId && formData.existingGallery.length > 0 && (
                            <div className="space-y-1">
                                <p className="text-[9px] uppercase font-bold text-gray-400 tracking-wider">Existing Images</p>
                                <div className="grid grid-cols-4 gap-2">
                                    {formData.existingGallery.map((img, idx) => (
                                        <div key={idx} className="relative group">
                                            <img
                                                src={getImageUrl(img) || "/logo deero-02 .svg"}
                                                alt={`Gallery ${idx + 1}`}
                                                className="h-16 w-full object-cover rounded border border-gray-200"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeExistingGalleryImage(editingId, img)}
                                                className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <X className="h-3 w-3" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* New Gallery Images */}
                        {formData.galleryPreviews.length > 0 && (
                            <div className="grid grid-cols-4 gap-2">
                                {formData.galleryPreviews.map((preview, idx) => (
                                    <div key={idx} className="relative group">
                                        <img
                                            src={preview}
                                            alt={`New ${idx + 1}`}
                                            className="h-16 w-full object-cover rounded border border-gray-200"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeGalleryPreview(idx)}
                                            className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <X className="h-3 w-3" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Upload Button */}
                        <div className="relative">
                            <label className="cursor-pointer inline-flex items-center gap-2 px-3 py-2 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                                <Camera className="h-4 w-4" />
                                Add Gallery Images
                                <input
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={handleGalleryImagesChange}
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                />
                            </label>
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
