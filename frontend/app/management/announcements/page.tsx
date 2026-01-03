"use client";

import React, { useState, useEffect } from "react";
import DataTable from "@/components/admin/DataTable";
import Modal from "@/components/admin/Modal";
import { Send, Trash2, Mail, Users, Megaphone } from "lucide-react";
import {
    getAllAnnouncements,
    createAnnouncement,
    deleteAnnouncement,
    Announcement
} from "@/api/announcementApi";
import { getAllUsers } from "@/api/usersApi";

export default function AnnouncementsPage() {
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        message: "",
        sendEmail: true,
        recipients: [] as string[],
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [annRes, userRes] = await Promise.all([
                getAllAnnouncements(),
                getAllUsers()
            ]);

            if (annRes.success && annRes.data) {
                setAnnouncements(Array.isArray(annRes.data) ? annRes.data : [annRes.data]);
            }

            if (userRes.data) {
                setUsers(userRes.data);
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

    const handleRecipientToggle = (userId: string) => {
        setFormData(prev => {
            const isSelected = prev.recipients.includes(userId);
            if (isSelected) {
                return { ...prev, recipients: prev.recipients.filter(id => id !== userId) };
            } else {
                return { ...prev, recipients: [...prev.recipients, userId] };
            }
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setIsSubmitting(true);
            const res = await createAnnouncement({
                title: formData.title,
                message: formData.message,
                sendEmail: formData.sendEmail,
                recipients: formData.recipients.length > 0 ? formData.recipients : undefined
            });

            if (res.success) {
                closeModal();
                fetchData();
            } else {
                alert(res.message || "Failed to send announcement");
            }
        } catch (error: any) {
            alert(error.response?.data?.message || "Error sending announcement");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm("Are you sure you want to delete this announcement?")) {
            try {
                const res = await deleteAnnouncement(id);
                if (res.success) {
                    fetchData();
                }
            } catch (error: any) {
                alert(error.response?.data?.message || "Failed to delete announcement");
            }
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setFormData({
            title: "",
            message: "",
            sendEmail: true,
            recipients: [],
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
            label: "Recipients",
            key: "recipients",
            render: (row: Announcement) => (
                <div className="flex items-center gap-1.5 text-gray-600">
                    <Users className="h-4 w-4" />
                    <span className="text-sm font-medium">{row.recipients.length} users</span>
                </div>
            )
        },
        {
            label: "Email Sent",
            key: "sendEmail",
            render: (row: Announcement) => (
                <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${row.sendEmail ? "bg-green-50 text-green-700 border border-green-100" : "bg-gray-50 text-gray-500 border border-gray-100"
                    }`}>
                    <Mail className="h-3 w-3" />
                    {row.sendEmail ? "Yes" : "No"}
                </div>
            )
        },
        {
            label: "Date",
            key: "createdAt",
            render: (row: Announcement) => (
                <span className="text-sm text-gray-500">
                    {new Date(row.createdAt).toLocaleDateString()}
                    <br />
                    <span className="text-xs">{new Date(row.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </span>
            )
        },
        {
            label: "Actions",
            key: "actions",
            render: (row: Announcement) => (
                <button
                    onClick={() => handleDelete(row._id)}
                    className="p-2 rounded-lg hover:bg-red-50 text-red-500 transition-colors"
                >
                    <Trash2 className="h-4 w-4" />
                </button>
            )
        }
    ];

    return (
        <div className="p-6">
            <DataTable
                title="Announcements Management"
                columns={columns}
                data={announcements}
                loading={loading}
                onAddClick={() => setIsModalOpen(true)}
                addButtonLabel="New Announcement"
            />

            <Modal
                isOpen={isModalOpen}
                onClose={closeModal}
                title="Create New Announcement"
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

                    <div className="flex items-center gap-2 py-2">
                        <input
                            type="checkbox"
                            id="sendEmail"
                            name="sendEmail"
                            checked={formData.sendEmail}
                            onChange={handleInputChange}
                            className="w-4 h-4 text-[#651313] border-gray-300 rounded focus:ring-[#EB4724]"
                        />
                        <label htmlFor="sendEmail" className="text-sm font-medium text-gray-700 cursor-pointer">
                            Also send via Email to recipients
                        </label>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">
                            Recipients (Leave empty to broadcast to ALL users)
                        </label>
                        <div className="max-h-40 overflow-y-auto border border-gray-200 rounded-lg p-2 bg-gray-50 space-y-1">
                            {users
                                .filter(user => {
                                    const roleName = typeof user.role === 'object' ? user.role?.name : user.role;
                                    return roleName?.toLowerCase() === 'user';
                                })
                                .map(user => (
                                    <label key={user._id} className="flex items-center gap-2 p-1.5 hover:bg-white rounded cursor-pointer transition-colors group">
                                        <input
                                            type="checkbox"
                                            checked={formData.recipients.includes(user._id)}
                                            onChange={() => handleRecipientToggle(user._id)}
                                            className="w-3.5 h-3.5 text-[#651313] border-gray-300 rounded focus:ring-[#EB4724]"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-900 truncate">{user.fullname}</p>
                                            <p className="text-xs text-gray-500 truncate">{user.email}</p>
                                        </div>
                                    </label>
                                ))}
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
                            className="flex items-center gap-2 px-6 py-2 text-sm font-medium text-white bg-gradient-to-r from-[#651313] to-[#EB4724] rounded-lg hover:opacity-90 transition-all shadow-md disabled:opacity-50"
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Sending...
                                </>
                            ) : (
                                <>
                                    <Send className="h-4 w-4" />
                                    Send Announcement
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
