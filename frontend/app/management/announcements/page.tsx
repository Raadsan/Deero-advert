"use client";
export const dynamic = 'force-static';

import React, { useState, useEffect } from "react";
import DataTable from "@/components/layout/DataTable";
import Modal from "@/components/layout/Modal";
import DeleteConfirmModal from "@/components/layout/DeleteConfirmModal";
import { Edit2, Trash2, Megaphone } from "lucide-react";
import {
    getAllAnnouncements,
    createAnnouncement,
    updateAnnouncement,
    deleteAnnouncement,
    Announcement
} from "@/api-client/announcementApi";

export default function AnnouncementsPage() {
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [deletingTitle, setDeletingTitle] = useState("");
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        title: "",
        message: "",
        startDate: "",
        endDate: "",
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const annRes = await getAllAnnouncements();

            if (annRes.data?.success && annRes.data?.data) {
                const data = Array.isArray(annRes.data.data) ? annRes.data.data : [annRes.data.data];
                setAnnouncements([...data].reverse());
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        if (type === "checkbox") {
            const checked = (e.target as HTMLInputElement).checked;
            setFormData(prev => ({ ...prev, [name]: checked }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setIsSubmitting(true);
            const data = {
                title: formData.title,
                message: formData.message,
                startDate: formData.startDate,
                endDate: formData.endDate,
            };

            const res = editingId
                ? await updateAnnouncement(editingId, data)
                : await createAnnouncement(data);

            if (res.data?.success) {
                closeModal();
                fetchData();
                alert(`✅ Announcement ${editingId ? "updated" : "created"} successfully!`);
            } else {
                alert(res.data?.message || `Failed to ${editingId ? "update" : "create"} announcement`);
            }
        } catch (error: any) {
            console.error(`Error ${editingId ? "updating" : "creating"} announcement:`, error);
            alert(error.response?.data?.message || `Error ${editingId ? "updating" : "creating"} announcement`);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEdit = (ann: Announcement) => {
        setEditingId(ann._id);
        setFormData({
            title: ann.title,
            message: ann.message,
            startDate: ann.startDate ? new Date(ann.startDate).toISOString().split('T')[0] : "",
            endDate: ann.endDate ? new Date(ann.endDate).toISOString().split('T')[0] : "",
        });
        setIsModalOpen(true);
    };

    const handleDelete = (id: string, title: string) => {
        setDeletingId(id);
        setDeletingTitle(title);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!deletingId) return;
        try {
            const res = await deleteAnnouncement(deletingId);
            if (res.data?.success) {
                fetchData();
            }
        } catch (error: any) {
            alert(error.response?.data?.message || "Failed to delete announcement");
        } finally {
            setIsDeleteModalOpen(false);
            setDeletingId(null);
            setDeletingTitle("");
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingId(null);
        setFormData({
            title: "",
            message: "",
            startDate: "",
            endDate: "",
        });
    };

    const columns = [
        {
            label: "Title",
            key: "title",
            render: (row: Announcement) => (
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-red-50 text-[#651313]">
                        <Megaphone className="h-4 w-4" />
                    </div>
                    <span className="font-semibold text-gray-900">{row.title}</span>
                </div>
            )
        },
        {
            label: "Message",
            key: "message",
            render: (row: Announcement) => (
                <div className="max-w-[200px] truncate text-gray-600 text-sm" title={row.message}>
                    {row.message}
                </div>
            )
        },
        {
            label: "Sent By",
            key: "createdBy",
            render: (row: Announcement) => (
                <div className="text-sm">
                    <div className="font-medium text-gray-900">{row.createdBy?.fullname || "Admin"}</div>
                    <div className="text-gray-500 text-xs">{row.createdBy?.email}</div>
                </div>
            )
        },
        {
            label: "Start Date",
            key: "startDate",
            render: (row: Announcement) => (
                <div className="text-sm text-gray-600">
                    {row.startDate ? new Date(row.startDate).toLocaleDateString() : "-"}
                </div>
            )
        },
        {
            label: "End Date",
            key: "endDate",
            render: (row: Announcement) => (
                <div className="text-sm text-gray-600">
                    {row.endDate ? new Date(row.endDate).toLocaleDateString() : "-"}
                </div>
            )
        },
        {
            label: "Actions",
            key: "actions",
            render: (row: Announcement) => (
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => handleEdit(row)}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit Announcement"
                    >
                        <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                        onClick={() => handleDelete(row._id, row.title)}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete Announcement"
                    >
                        <Trash2 className="h-4 w-4" />
                    </button>
                </div>
            )
        }
    ];

    return (
        <div className="space-y-6">
            <DataTable
                title="Announcements Management"
                columns={columns}
                data={announcements}
                loading={loading}
                onAddClick={() => setIsModalOpen(true)}
                onRefresh={fetchData}
                addButtonLabel="New Announcement"
            />

            <DeleteConfirmModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                itemName={deletingTitle}
            />

            <Modal
                isOpen={isModalOpen}
                onClose={closeModal}
                title={editingId ? "Edit Announcement" : "Create New Announcement"}
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                            Announcement Title <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleInputChange}
                            required
                            placeholder="e.g. Big Discount 🎉"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#EB4724] focus:outline-none transition-all"
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                            Message Content <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            name="message"
                            value={formData.message}
                            onChange={handleInputChange}
                            required
                            rows={4}
                            placeholder="Type your announcement message here..."
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#EB4724] focus:outline-none transition-all resize-none"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                                Start Date <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="date"
                                name="startDate"
                                value={formData.startDate}
                                onChange={handleInputChange}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#EB4724] focus:outline-none transition-all"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                                End Date <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="date"
                                name="endDate"
                                value={formData.endDate}
                                onChange={handleInputChange}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#EB4724] focus:outline-none transition-all"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                        <button
                            type="button"
                            onClick={closeModal}
                            className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-[#EB4724] text-white py-3 rounded-xl font-bold hover:bg-[#d63d1a] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    {editingId ? "Updating..." : "Sending..."}
                                </>
                            ) : (
                                editingId ? "Update Announcement" : "Send Announcement"
                            )}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}

