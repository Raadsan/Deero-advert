"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import DataTable from "@/components/layout/DataTable";
import Modal from "@/components/layout/Modal";
import { Pencil, Trash2, Camera } from "lucide-react";
import {
    getTeams,
    createTeam,
    updateTeam,
    deleteTeam,
} from "../../../api/teamApi";

// Base URL for images
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") || "http://localhost:5000";

export default function TeamsManagementPage() {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        name: "",
        position: "",
        image: null as File | null,
        imagePreview: "",
    });

    // Fetch teams from backend
    const fetchTeams = async () => {
        setLoading(true);
        try {
            const res = await getTeams();
            // Adjust based on backend response structure: { success: true, teams: [...] }
            const items = res.data.success ? res.data.teams : (Array.isArray(res.data) ? res.data : []);

            setData(
                items.map((t: any) => ({
                    _id: t._id,
                    name: t.name,
                    position: t.position,
                    image: t.image?.startsWith("http")
                        ? t.image
                        : `${API_BASE_URL}/${t.image}`.replace(/([^:]\/)\/+/g, "$1"),
                }))
            );
        } catch (err) {
            console.error("Failed to load teams", err);
            setData([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTeams();
    }, []);

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFormData((prev) => ({
                ...prev,
                image: file,
                imagePreview: URL.createObjectURL(file),
            }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const formDataToSend = new FormData();
        formDataToSend.append("name", formData.name);
        formDataToSend.append("position", formData.position);
        if (formData.image) {
            formDataToSend.append("image", formData.image);
        }

        try {
            if (editingId) {
                await updateTeam(editingId, formDataToSend);
            } else {
                if (!formData.image) {
                    alert("Image is required");
                    return;
                }
                await createTeam(formDataToSend);
            }
            setIsModalOpen(false);
            resetForm();
            fetchTeams();
        } catch (err: any) {
            console.error("Failed to save team member", err);
            alert(err.response?.data?.message || "Failed to save team member");
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this team member?")) return;
        try {
            await deleteTeam(id);
            fetchTeams();
        } catch (err) {
            console.error("Failed to delete team member", err);
        }
    };

    const handleEdit = (member: any) => {
        setEditingId(member._id);
        setFormData({
            name: member.name,
            position: member.position,
            image: null,
            imagePreview: member.image,
        });
        setIsModalOpen(true);
    };

    const resetForm = () => {
        setEditingId(null);
        setFormData({
            name: "",
            position: "",
            image: null,
            imagePreview: "",
        });
    };

    const columns = [
        {
            label: "Image",
            key: "image",
            render: (row: any) => (
                <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-full border border-gray-100 bg-gray-50">
                    <Image
                        src={row.image || "/placeholder-user.jpg"}
                        alt={row.name}
                        width={48}
                        height={48}
                        unoptimized
                        className="h-full w-full object-cover"
                    />
                </div>
            ),
        },
        { label: "Name", key: "name" },
        { label: "Position", key: "position" },
        {
            label: "Actions",
            key: "actions",
            width: "100px",
            render: (row: any) => (
                <div className="flex gap-2">
                    <button
                        className="p-2 rounded-lg hover:bg-orange-50 text-[#EB4724] transition-colors"
                        title="Edit"
                        onClick={() => handleEdit(row)}
                    >
                        <Pencil className="h-4 w-4" />
                    </button>
                    <button
                        className="p-2 rounded-lg hover:bg-red-50 text-red-500 transition-colors"
                        title="Delete"
                        onClick={() => handleDelete(row._id)}
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
                title="Team Members"
                columns={columns}
                data={data}
                showAddButton
                onAddClick={() => setIsModalOpen(true)}
                loading={loading}
            />

            <Modal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    resetForm();
                }}
                title={editingId ? "Edit Team Member" : "Add New Team Member"}
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Image Upload */}
                    <div className="space-y-0.5">
                        <label className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">
                            Photo {!editingId && <span className="text-red-500">*</span>}
                        </label>
                        <div className="flex items-center gap-3">
                            <div className="relative h-20 w-20 rounded-full bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors group overflow-hidden">
                                {formData.imagePreview ? (
                                    <img
                                        src={formData.imagePreview}
                                        alt="Preview"
                                        className="h-full w-full rounded-full object-cover"
                                    />
                                ) : (
                                    <Camera className="h-6 w-6 text-gray-400 group-hover:text-[#EB4724] transition-colors" />
                                )}
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                />
                            </div>
                            <div className="flex-1">
                                <p className="text-xs text-gray-500">
                                    {formData.image
                                        ? formData.image.name
                                        : editingId
                                            ? "Click to change photo"
                                            : "Click to upload member photo"}
                                </p>
                                {formData.image && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setFormData((prev) => ({
                                                ...prev,
                                                image: null,
                                                imagePreview: editingId ? prev.imagePreview : "",
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

                    <div className="space-y-0.5">
                        <label className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">
                            Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="name"
                            required
                            value={formData.name}
                            onChange={handleInputChange}
                            className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#EB4724] focus:border-[#EB4724]"
                        />
                    </div>

                    <div className="space-y-0.5">
                        <label className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">
                            Position <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="position"
                            required
                            value={formData.position}
                            onChange={handleInputChange}
                            className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#EB4724] focus:border-[#EB4724]"
                        />
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
