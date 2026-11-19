"use client";
export const dynamic = 'force-static';

import React, { useEffect, useState } from "react";
import Image from "next/image";
import DataTable from "@/components/layout/DataTable";
import Modal from "@/components/layout/Modal";
import DeleteConfirmModal from "@/components/layout/DeleteConfirmModal";
import { Edit, Trash2, Camera, Eye, ExternalLink } from "lucide-react";
import {
    getWelcomeMessages,
    createWelcomeMessage,
    updateWelcomeMessage,
    deleteWelcomeMessage,
} from "@/api-client/welcomeApi";
import { getImageUrl } from "@/utils/url";
import { compressImage } from "@/utils/compressImage";

export default function WelcomeMessageManagement() {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [viewingItem, setViewingItem] = useState<any | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [deletingName, setDeletingName] = useState("");
    const [formData, setFormData] = useState({
        title: "",
        subtitle: "",
        content: "",
        presidentName: "",
        presidentTitle: "",
        facebook: "",
        linkedin: "",
        instagram: "",
        image: null as File | null,
        imagePreview: "",
    });

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await getWelcomeMessages();
            const items = res.data?.data || [];
            setData(
                (Array.isArray(items) ? items : [items]).map((item: any) => ({
                    _id: String(item.id || item._id),
                    title: item.title || "",
                    subtitle: item.subtitle || "",
                    content: item.content || "",
                    presidentName: item.presidentName || "",
                    presidentTitle: item.presidentTitle || "",
                    facebook: item.facebook || "",
                    linkedin: item.linkedin || "",
                    instagram: item.instagram || "",
                    image: item.image ? getImageUrl(item.image) : "",
                    isActive: item.isActive,
                    createdAt: item.createdAt,
                }))
            );
        } catch (err) {
            console.error("Failed to load welcome messages", err);
            setData([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const compressed = await compressImage(file);
            setFormData((prev) => ({
                ...prev,
                image: compressed,
                imagePreview: URL.createObjectURL(compressed),
            }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const fd = new FormData();
        fd.append("title", formData.title);
        fd.append("subtitle", formData.subtitle);
        fd.append("content", formData.content);
        fd.append("presidentName", formData.presidentName);
        fd.append("presidentTitle", formData.presidentTitle);
        fd.append("facebook", formData.facebook);
        fd.append("linkedin", formData.linkedin);
        fd.append("instagram", formData.instagram);
        if (formData.image) fd.append("image", formData.image);

        try {
            if (editingId) {
                await updateWelcomeMessage(editingId, fd);
            } else {
                await createWelcomeMessage(fd);
            }
            setIsModalOpen(false);
            resetForm();
            fetchData();
        } catch (err: any) {
            console.error("Failed to save", err);
            alert(err.response?.data?.message || "Failed to save welcome message");
        }
    };

    const handleEdit = (item: any) => {
        setEditingId(item._id);
        setFormData({
            title: item.title,
            subtitle: item.subtitle,
            content: item.content,
            presidentName: item.presidentName,
            presidentTitle: item.presidentTitle,
            facebook: item.facebook || "",
            linkedin: item.linkedin || "",
            instagram: item.instagram || "",
            image: null,
            imagePreview: item.image || "",
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
            await deleteWelcomeMessage(deletingId);
            fetchData();
        } catch (err) {
            console.error("Failed to delete", err);
        } finally {
            setIsDeleteModalOpen(false);
            setDeletingId(null);
            setDeletingName("");
        }
    };

    const resetForm = () => {
        setEditingId(null);
        setFormData({
            title: "",
            subtitle: "",
            content: "",
            presidentName: "",
            presidentTitle: "",
            facebook: "",
            linkedin: "",
            instagram: "",
            image: null,
            imagePreview: "",
        });
    };

    const handleView = (item: any) => {
        setViewingItem(item);
        setIsViewModalOpen(true);
    };

    const columns = [
        {
            label: "Image",
            key: "image",
            render: (row: any) => (
                <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-full border border-gray-100 bg-gray-50">
                    {row.image ? (
                        <Image
                            src={row.image}
                            alt={row.presidentName}
                            width={48}
                            height={48}
                            unoptimized
                            className="h-full w-full object-cover"
                        />
                    ) : (
                        <div className="h-full w-full flex items-center justify-center text-gray-300 text-xs">No img</div>
                    )}
                </div>
            ),
        },
        { label: "Title", key: "title", render: (row: any) => <span className="text-xs truncate max-w-[180px] inline-block font-medium">{row.title}</span> },
        { label: "President", key: "presidentName" },
        { label: "Role", key: "presidentTitle" },
        {
            label: "Status",
            key: "isActive",
            render: (row: any) => (
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${row.isActive ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                    {row.isActive ? "Active" : "Inactive"}
                </span>
            ),
        },
        {
            label: "Date",
            key: "createdAt",
            render: (row: any) => (
                <span className="text-xs text-gray-500">{new Date(row.createdAt).toLocaleDateString()}</span>
            ),
        },
        {
            label: "Actions",
            key: "actions",
            width: "120px",
            render: (row: any) => (
                <div className="flex gap-1.5 items-center">
                    <button
                        className="p-2 rounded-lg hover:bg-emerald-50 text-emerald-600 transition-colors"
                        title="View Details"
                        onClick={() => handleView(row)}
                    >
                        <Eye className="h-4 w-4" />
                    </button>
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
                        onClick={() => handleDelete(row._id, row.presidentName || row.title)}
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
                title="Welcome Messages"
                columns={columns}
                data={data}
                showAddButton
                onAddClick={() => setIsModalOpen(true)}
                onRefresh={fetchData}
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
                onClose={() => { setIsModalOpen(false); resetForm(); }}
                title={editingId ? "Edit Welcome Message" : "Add Welcome Message"}
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Image Upload */}
                    <div className="space-y-0.5">
                        <label className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">
                            President Photo
                        </label>
                        <div className="flex items-center gap-3">
                            <div className="relative h-20 w-20 rounded-full bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors group overflow-hidden">
                                {formData.imagePreview ? (
                                    <img src={formData.imagePreview} alt="Preview" className="h-full w-full rounded-full object-cover" />
                                ) : (
                                    <Camera className="h-6 w-6 text-gray-400 group-hover:text-[#EB4724] transition-colors" />
                                )}
                                <input type="file" accept="image/*" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                            </div>
                            <p className="text-xs text-gray-500">
                                {formData.image ? formData.image.name : editingId ? "Click to change photo" : "Click to upload photo"}
                            </p>
                        </div>
                    </div>

                    {/* Title */}
                    <div className="space-y-0.5">
                        <label className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Title <span className="text-red-500">*</span></label>
                        <input type="text" name="title" required value={formData.title} onChange={handleInputChange}
                            className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#EB4724] focus:border-[#EB4724]"
                            placeholder="WELCOME TO THE HOME OF CREATIVE EXCELLENCE." />
                    </div>

                    {/* Subtitle */}
                    <div className="space-y-0.5">
                        <label className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Subtitle</label>
                        <input type="text" name="subtitle" value={formData.subtitle} onChange={handleInputChange}
                            className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#EB4724] focus:border-[#EB4724]"
                            placeholder="e.g. Deero Advert President" />
                    </div>

                    {/* President Name & Title */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-0.5">
                            <label className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">President Name</label>
                            <input type="text" name="presidentName" value={formData.presidentName} onChange={handleInputChange}
                                className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#EB4724] focus:border-[#EB4724]"
                                placeholder="e.g. Eng. Ayuub Mohamud" />
                        </div>
                        <div className="space-y-0.5">
                            <label className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Title / Role</label>
                            <input type="text" name="presidentTitle" value={formData.presidentTitle} onChange={handleInputChange}
                                className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#EB4724] focus:border-[#EB4724]"
                                placeholder="e.g. President" />
                        </div>
                    </div>

                    {/* Content */}
                    <div className="space-y-0.5">
                        <label className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">
                            Content <span className="text-red-500">*</span>
                        </label>
                        <p className="text-[10px] text-gray-400">Use a new line to separate paragraphs.</p>
                        <textarea name="content" rows={6} required value={formData.content} onChange={handleInputChange}
                            className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#EB4724] focus:border-[#EB4724] resize-y"
                            placeholder="Write the welcome message here..." />
                    </div>

                    {/* Social Media Links */}
                    <div className="space-y-3 pt-2">
                        <p className="text-[10px] uppercase font-bold text-gray-500 tracking-wider border-b pb-1">Social Media Links</p>
                        <div className="space-y-0.5">
                            <label className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Facebook URL</label>
                            <input type="url" name="facebook" value={formData.facebook} onChange={handleInputChange} placeholder="https://facebook.com/..."
                                className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#EB4724] focus:border-[#EB4724]" />
                        </div>
                        <div className="space-y-0.5">
                            <label className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">LinkedIn URL</label>
                            <input type="url" name="linkedin" value={formData.linkedin} onChange={handleInputChange} placeholder="https://linkedin.com/in/..."
                                className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#EB4724] focus:border-[#EB4724]" />
                        </div>
                        <div className="space-y-0.5">
                            <label className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Instagram URL</label>
                            <input type="url" name="instagram" value={formData.instagram} onChange={handleInputChange} placeholder="https://instagram.com/..."
                                className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#EB4724] focus:border-[#EB4724]" />
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-end gap-2 pt-3 border-t border-gray-100 mt-4">
                        <button type="button" onClick={() => { setIsModalOpen(false); resetForm(); }}
                            className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                            Cancel
                        </button>
                        <button type="submit"
                            className="px-3 py-1.5 text-xs font-medium text-white bg-[#651313] rounded-lg hover:bg-[#500f0f]">
                            {editingId ? "Update" : "Save"}
                        </button>
                    </div>
                </form>
            </Modal>

            {/* View Details Modal */}
            <Modal
                isOpen={isViewModalOpen}
                onClose={() => {
                    setIsViewModalOpen(false);
                    setViewingItem(null);
                }}
                title="Welcome Message Details"
            >
                {viewingItem && (
                    <div className="space-y-4 max-h-[75vh] overflow-y-auto pr-1">
                        {/* Header Profile preview */}
                        <div className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100">
                            <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-full border-2 border-white shadow-sm bg-gray-200">
                                {viewingItem.image ? (
                                    <img
                                        src={viewingItem.image}
                                        alt={viewingItem.presidentName}
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <div className="h-full w-full flex items-center justify-center text-gray-400 text-xs font-medium">No photo</div>
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="text-base font-bold text-gray-900 truncate">
                                    {viewingItem.presidentName || "No Name"}
                                </h3>
                                <p className="text-xs font-semibold text-[#EB4724]">
                                    {viewingItem.presidentTitle || "No Title"}
                                </p>
                                <div className="flex items-center gap-2 mt-2">
                                    <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${viewingItem.isActive ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-600"}`}>
                                        {viewingItem.isActive ? "Active on Website" : "Inactive"}
                                    </span>
                                    <span className="text-xs text-gray-400">
                                        {new Date(viewingItem.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Title & Subtitle */}
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Title</label>
                            <p className="text-sm font-semibold text-[#651313] bg-gray-50 p-2.5 rounded-lg border border-gray-100">
                                {viewingItem.title || "—"}
                            </p>
                        </div>

                        <div className="space-y-1">
                            <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Subtitle</label>
                            <p className="text-sm text-gray-700 bg-gray-50 p-2.5 rounded-lg border border-gray-100">
                                {viewingItem.subtitle || "—"}
                            </p>
                        </div>

                        {/* Full Message Content */}
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Content</label>
                            <div className="text-xs text-gray-700 bg-gray-50 p-3 rounded-lg border border-gray-100 leading-relaxed whitespace-pre-line max-h-48 overflow-y-auto">
                                {viewingItem.content || "No message content"}
                            </div>
                        </div>

                        {/* Social Media Links */}
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Social Links</label>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
                                <div className="p-2 rounded-lg border border-gray-100 bg-gray-50">
                                    <span className="font-semibold text-blue-600 block text-[11px]">Facebook:</span>
                                    <span className="text-gray-600 truncate block mt-0.5">{viewingItem.facebook || "—"}</span>
                                </div>
                                <div className="p-2 rounded-lg border border-gray-100 bg-gray-50">
                                    <span className="font-semibold text-sky-700 block text-[11px]">LinkedIn:</span>
                                    <span className="text-gray-600 truncate block mt-0.5">{viewingItem.linkedin || "—"}</span>
                                </div>
                                <div className="p-2 rounded-lg border border-gray-100 bg-gray-50">
                                    <span className="font-semibold text-pink-600 block text-[11px]">Instagram:</span>
                                    <span className="text-gray-600 truncate block mt-0.5">{viewingItem.instagram || "—"}</span>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                            <a
                                href="/welcome"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#EB4724] hover:underline"
                            >
                                <ExternalLink className="h-3.5 w-3.5" />
                                Open Public Page
                            </a>
                            <button
                                type="button"
                                onClick={() => setIsViewModalOpen(false)}
                                className="px-3.5 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
}
