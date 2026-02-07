"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import DataTable from "@/components/layout/DataTable";
import Modal from "@/components/layout/Modal";
import DeleteConfirmModal from "@/components/layout/DeleteConfirmModal";
import { Trash2, Camera, X } from "lucide-react";
import {
    getMajorClients,
    createMajorClient,
    deleteMajorClient,
} from "@/api/majorClientApi";
import { getImageUrl } from "@/utils/url";

export default function MajorClientsPage() {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [deletingName, setDeletingName] = useState("");
    const [formData, setFormData] = useState({
        description: "",
        images: [] as File[],
        imagePreviews: [] as string[],
    });

    // ✅ Fetch clients from backend
    const fetchClients = async () => {
        setLoading(true);
        try {
            const res = await getMajorClients();
            const clientsData = Array.isArray(res.clients) ? res.clients : res.data || [];
            const clients = [...clientsData].reverse();
            setData(
                clients.map((c: any) => ({
                    id: c._id,
                    description: c.description,
                    images: (c.images || []).map((img: string) => getImageUrl(img)),
                    createdAt: c.createdAt,
                }))
            );
        } catch (err) {
            console.error("Failed to load major clients", err);
            setData([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchClients();
    }, []);

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // Handle file input change (multiple files)
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const selectedFiles = Array.from(e.target.files);

            // Filter files larger than 50MB
            const validFiles = selectedFiles.filter(file => file.size <= 50 * 1024 * 1024);
            const invalidFiles = selectedFiles.filter(file => file.size > 50 * 1024 * 1024);

            if (invalidFiles.length > 0) {
                alert(`${invalidFiles.length} file(s) are too large and were skipped. Max size is 50MB.`);
            }

            if (validFiles.length > 0) {
                const newPreviews = validFiles.map((file) => URL.createObjectURL(file));

                setFormData((prev) => ({
                    ...prev,
                    images: [...prev.images, ...validFiles],
                    imagePreviews: [...prev.imagePreviews, ...newPreviews],
                }));
            }

            e.target.value = ""; // Clear input to allow re-selecting same files if needed
        }
    };

    const removeImage = (index: number) => {
        setFormData((prev) => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index),
            imagePreviews: prev.imagePreviews.filter((_, i) => i !== index),
        }));
    };

    // ✅ Add client
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (formData.images.length === 0) {
            alert("At least one image is required");
            return;
        }

        // Create FormData
        const formDataToSend = new FormData();
        formDataToSend.append("description", formData.description);

        // Append all images
        formData.images.forEach((file) => {
            formDataToSend.append("images", file);
        });

        try {
            await createMajorClient(formDataToSend);
            setIsModalOpen(false);
            setFormData({
                description: "",
                images: [],
                imagePreviews: [],
            });
            fetchClients(); // reload table
        } catch (err: any) {
            console.error("Failed to save client", err);
            alert(err.response?.data?.message || "Failed to save client");
        }
    };

    // ✅ Delete client
    const handleDelete = (id: string, description: string) => {
        setDeletingId(id);
        const namePreview = description?.length > 40 ? description.slice(0, 40) + "..." : description;
        setDeletingName(namePreview || "Major Client");
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!deletingId) return;
        try {
            await deleteMajorClient(deletingId);
            fetchClients();
        } catch (err) {
            console.error("Failed to delete client", err);
        } finally {
            setIsDeleteModalOpen(false);
            setDeletingId(null);
            setDeletingName("");
        }
    };

    const columns = [
        {
            label: "Images",
            key: "images",
            width: "30%",
            render: (row: any) => (
                <div className="flex -space-x-3 overflow-hidden p-1">
                    {row.images && row.images.length > 0 ? (
                        row.images.slice(0, 4).map((img: string, i: number) => (
                            <div key={i} className="inline-block h-10 w-10 rounded-full ring-2 ring-white bg-gray-100 overflow-hidden relative">
                                <Image
                                    src={img || "/logo deero-02 .svg"}
                                    alt={`Client Image ${i + 1}`}
                                    fill
                                    unoptimized
                                    className="object-cover"
                                />
                            </div>
                        ))
                    ) : (
                        <span className="text-gray-400 text-xs italic">No images</span>
                    )}
                    {row.images && row.images.length > 4 && (
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 ring-2 ring-white text-xs font-medium text-gray-500">
                            +{row.images.length - 4}
                        </div>
                    )}
                </div>
            ),
        },
        {
            label: "Description",
            key: "description",
            width: "50%",
            render: (row: any) => <p className="line-clamp-2 text-gray-700">{row.description}</p>,
        },
        {
            label: "Created At",
            key: "createdAt",
            render: (row: any) => (
                <span className="text-gray-500 text-sm">
                    {row.createdAt ? new Date(row.createdAt).toLocaleDateString() : "-"}
                </span>
            ),
        },
        {
            label: "Actions",
            key: "actions",
            width: "100px",
            render: (row: any) => (
                <div className="flex gap-2">
                    {/* Edit button omitted since backend doesn't support update yet */}
                    <button
                        className="p-2 rounded-lg hover:bg-red-50 text-red-600 transition-colors"
                        title="Delete"
                        onClick={() => handleDelete(row.id, row.description)}
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
                title="Major Clients"
                columns={columns}
                data={data}
                showAddButton
                onAddClick={() => setIsModalOpen(true)}
                onRefresh={fetchClients}
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
                    setFormData({
                        description: "",
                        images: [],
                        imagePreviews: [],
                    });
                }}
                title={"Add New Major Client"}
            >
                <form onSubmit={handleSubmit} className="space-y-4">

                    {/* Multiple Image Upload */}
                    <div className="space-y-2">
                        <label className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">
                            Client Images (Max 5) <span className="text-red-500">*</span>
                        </label>

                        <div className="grid grid-cols-5 gap-2">
                            {formData.imagePreviews.map((preview, index) => (
                                <div key={index} className="relative aspect-square rounded-lg border border-gray-200 overflow-hidden group">
                                    <img src={preview} alt="preview" className="h-full w-full object-cover" />
                                    <button
                                        type="button"
                                        onClick={() => removeImage(index)}
                                        className="absolute top-0.5 right-0.5 bg-black/50 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <X className="h-3 w-3" />
                                    </button>
                                </div>
                            ))}

                            {formData.images.length < 5 && (
                                <label className="flex flex-col items-center justify-center aspect-square rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors">
                                    <Camera className="h-6 w-6 text-gray-400" />
                                    <span className="hidden">Upload</span>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        onChange={handleFileChange}
                                        className="hidden"
                                    />
                                </label>
                            )}
                        </div>
                        <p className="text-xs text-gray-400">Upload up to 5 images representing the client.</p>
                    </div>

                    <div className="space-y-0.5">
                        <label className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">
                            Description <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            name="description"
                            required
                            rows={4}
                            value={formData.description}
                            onChange={handleInputChange}
                            placeholder="Enter client details..."
                            className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#EB4724] focus:border-[#EB4724] resize-none"
                        />
                    </div>

                    <div className="flex justify-end gap-2 pt-3 border-t border-gray-100 mt-4">
                        <button
                            type="button"
                            onClick={() => {
                                setIsModalOpen(false);
                                setFormData({
                                    description: "",
                                    images: [],
                                    imagePreviews: [],
                                });
                            }}
                            className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-3 py-1.5 text-xs font-medium text-white bg-[#651313] rounded-lg hover:bg-[#500f0f]"
                        >
                            Save Client
                        </button>
                    </div>
                </form>
            </Modal>
        </div >
    );
}
