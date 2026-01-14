"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import DataTable from "@/components/layout/DataTable";
import Modal from "@/components/layout/Modal";
import DeleteConfirmModal from "@/components/layout/DeleteConfirmModal";
import { Edit, Trash2, Camera } from "lucide-react";
import {
    getTeams,
    createTeam,
    updateTeam,
    deleteTeam,
} from "@/api/teamApi";
import { getImageUrl } from "@/utils/url";



export default function TeamsManagementPage() {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [deletingName, setDeletingName] = useState("");
    const [formData, setFormData] = useState({
        name: "",
        position: "",
        facebook: "",
        twitter: "",
        linkedin: "",
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
                items.reverse().map((t: any) => ({
                    _id: t._id,
                    name: t.name || t.fullname || "",
                    position: t.position || t.title || "",
                    image: getImageUrl(t.image),
                    socials: t.socials || [],
                    createdAt: t.createdAt,
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
            // Add file size check (e.g., 50MB)
            if (file.size > 50 * 1024 * 1024) {
                alert("File is too large. Please select an image smaller than 50MB.");
                e.target.value = ""; // clear input
                return;
            }
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

        const socials = [
            { platform: "facebook", url: formData.facebook },
            { platform: "twitter", url: formData.twitter },
            { platform: "linkedin", url: formData.linkedin },
        ].filter(s => s.url); // Only send platforms with URLs

        formDataToSend.append("socials", JSON.stringify(socials));

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

    const handleDelete = async (id: string, name: string) => {
        setDeletingId(id);
        setDeletingName(name);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!deletingId) return;
        try {
            await deleteTeam(deletingId);
            fetchTeams();
        } catch (err) {
            console.error("Failed to delete team member", err);
        } finally {
            setIsDeleteModalOpen(false);
            setDeletingId(null);
            setDeletingName("");
        }
    };

    const handleEdit = (member: any) => {
        setEditingId(member._id);

        const facebook = member.socials?.find((s: any) => s.platform === "facebook")?.url || "";
        const twitter = member.socials?.find((s: any) => s.platform === "twitter")?.url || "";
        const linkedin = member.socials?.find((s: any) => s.platform === "linkedin")?.url || "";

        setFormData({
            name: member.name,
            position: member.position,
            facebook,
            twitter,
            linkedin,
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
            facebook: "",
            twitter: "",
            linkedin: "",
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
            label: "Socials",
            key: "socials",
            render: (row: any) => (
                <div className="flex gap-2">
                    {row.socials?.map((s: any) => (
                        <a
                            key={s._id || s.platform}
                            href={s.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-400 hover:text-[#EB4724] transition-colors"
                            title={s.platform}
                        >
                            <span className="capitalize text-[10px]">{s.platform}</span>
                        </a>
                    ))}
                </div>
            )
        },
        {
            label: "Date",
            key: "createdAt",
            render: (row: any) => (
                <span className="text-xs text-gray-500">
                    {new Date(row.createdAt).toLocaleDateString()}
                </span>
            )
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
                        onClick={() => handleDelete(row._id, row.name)}
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

                    <div className="grid grid-cols-2 gap-4">
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
                    </div>

                    <div className="space-y-3 pt-2">
                        <p className="text-[10px] uppercase font-bold text-gray-500 tracking-wider border-b pb-1">Social Media Links</p>

                        <div className="space-y-0.5">
                            <label className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Facebook URL</label>
                            <input
                                type="url"
                                name="facebook"
                                placeholder="https://facebook.com/..."
                                value={formData.facebook}
                                onChange={handleInputChange}
                                className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#EB4724] focus:border-[#EB4724]"
                            />
                        </div>

                        <div className="space-y-0.5">
                            <label className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Twitter/X URL</label>
                            <input
                                type="url"
                                name="twitter"
                                placeholder="https://twitter.com/..."
                                value={formData.twitter}
                                onChange={handleInputChange}
                                className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#EB4724] focus:border-[#EB4724]"
                            />
                        </div>

                        <div className="space-y-0.5">
                            <label className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">LinkedIn URL</label>
                            <input
                                type="url"
                                name="linkedin"
                                placeholder="https://linkedin.com/in/..."
                                value={formData.linkedin}
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
