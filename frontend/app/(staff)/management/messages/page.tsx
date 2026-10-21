"use client";

import React, { useEffect, useState, useMemo } from "react";
import DataTable from "@/components/layout/DataTable";
import DeleteConfirmModal from "@/components/layout/DeleteConfirmModal";
import { getAllContacts, deleteContact } from "@/api-client/contactApi";
import {
    Mail,
    Phone,
    Calendar,
    Trash2,
    Eye,
    X,
    MessageSquare,
    RefreshCw,
    User,
    CheckCircle2,
    Inbox,
    ChevronRight
} from "lucide-react";
import toast from "react-hot-toast";

const truncateWords = (text?: string, maxWords: number = 20) => {
    if (!text) return "";
    const words = text.trim().split(/\s+/);
    if (words.length <= maxWords) return text;
    return words.slice(0, maxWords).join(" ") + "...";
};

interface ContactMessage {
    id: number;
    name: string;
    email: string;
    phone: string;
    subject: string;
    message: string;
    createdAt: string;
    updatedAt?: string;
}

export default function MessagesManagementPage() {
    const [messages, setMessages] = useState<ContactMessage[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deletingId, setDeletingId] = useState<number | null>(null);
    const [deletingName, setDeletingName] = useState("");

    const fetchMessages = async () => {
        try {
            setLoading(true);
            const res = await getAllContacts();
            const list = res.data?.data || res.data || [];
            setMessages(Array.isArray(list) ? list : []);
        } catch (error: any) {
            console.error("Failed to load contact messages:", error);
            toast.error(error.response?.data?.message || "Failed to load messages");
            setMessages([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMessages();
    }, []);

    // Summary stats
    const stats = useMemo(() => {
        const now = new Date();
        const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        const todayCount = messages.filter((m) => {
            if (!m.createdAt) return false;
            return new Date(m.createdAt) >= todayStart;
        }).length;

        const uniqueSenders = new Set(messages.map((m) => m.email?.toLowerCase().trim())).size;

        return {
            total: messages.length,
            today: todayCount,
            uniqueSenders,
        };
    }, [messages]);

    const handleDeleteClick = (id: number, name: string) => {
        setDeletingId(id);
        setDeletingName(name);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!deletingId) return;
        try {
            await deleteContact(String(deletingId));
            toast.success("Message deleted successfully");
            if (selectedMessage?.id === deletingId) {
                setSelectedMessage(null);
            }
            fetchMessages();
        } catch (error: any) {
            console.error("Failed to delete message:", error);
            toast.error(error.response?.data?.message || "Failed to delete message");
        } finally {
            setIsDeleteModalOpen(false);
            setDeletingId(null);
            setDeletingName("");
        }
    };

    const columns = [
        {
            label: "#",
            key: "id",
            width: "5%",
            render: (_: any, index: number) => (
                <span className="text-gray-400 font-mono text-xs font-medium">#{index + 1}</span>
            ),
        },
        {
            label: "Sender",
            key: "name",
            width: "20%",
            render: (row: ContactMessage) => (
                <div className="flex items-center gap-2.5">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#651313] to-[#EB4724] text-white flex items-center justify-center text-xs font-bold shrink-0">
                        {(row.name || "U").charAt(0).toUpperCase()}
                    </div>
                    <div className="flex flex-col min-w-0">
                        <span className="font-semibold text-gray-900 text-xs truncate">
                            {row.name || "Anonymous"}
                        </span>
                        <span className="text-[11px] text-gray-500 truncate">
                            ID: #{row.id}
                        </span>
                    </div>
                </div>
            ),
        },
        {
            label: "Contact Info",
            key: "email",
            width: "22%",
            render: (row: ContactMessage) => (
                <div className="space-y-1">
                    <a
                        href={`mailto:${row.email}`}
                        className="flex items-center gap-1.5 text-xs text-gray-600 hover:text-[#EB4724] transition-colors truncate"
                        title={row.email}
                    >
                        <Mail className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                        <span className="truncate">{row.email || "-"}</span>
                    </a>
                    {row.phone && (
                        <a
                            href={`tel:${row.phone}`}
                            className="flex items-center gap-1.5 text-xs text-gray-600 hover:text-[#EB4724] transition-colors truncate"
                            title={row.phone}
                        >
                            <Phone className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                            <span>{row.phone}</span>
                        </a>
                    )}
                </div>
            ),
        },
        {
            label: "Subject & Message",
            key: "subject",
            width: "32%",
            render: (row: ContactMessage) => (
                <div className="flex flex-col min-w-0 max-w-sm">
                    <span className="font-semibold text-gray-900 text-xs truncate">
                        {row.subject || "(No Subject)"}
                    </span>
                    <p className="text-[11px] text-gray-600 mt-1 line-clamp-2 leading-relaxed">
                        {truncateWords(row.message, 20)}
                    </p>
                    <button
                        onClick={() => setSelectedMessage(row)}
                        className="text-[11px] font-semibold text-[#EB4724] hover:underline self-start mt-1.5 inline-flex items-center gap-0.5"
                    >
                        <span>View details</span>
                        <ChevronRight className="w-3 h-3" />
                    </button>
                </div>
            ),
        },
        {
            label: "Date",
            key: "createdAt",
            width: "13%",
            render: (row: ContactMessage) => (
                <div className="flex flex-col text-xs text-gray-600">
                    <span>{row.createdAt ? new Date(row.createdAt).toLocaleDateString() : "-"}</span>
                    <span className="text-[10px] text-gray-400">
                        {row.createdAt ? new Date(row.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ""}
                    </span>
                </div>
            ),
        },
        {
            label: "Actions",
            key: "actions",
            width: "12%",
            align: "center",
            render: (row: ContactMessage) => (
                <div className="flex items-center justify-center gap-1.5">
                    <button
                        onClick={() => setSelectedMessage(row)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-[#651313] bg-[#651313]/10 hover:bg-[#651313] hover:text-white rounded-lg transition-colors shadow-xs"
                        title="View Full Message"
                    >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View</span>
                    </button>
                    <button
                        onClick={() => handleDeleteClick(row.id, row.name)}
                        className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete Message"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            ),
        },
    ];

    return (
        <div className="space-y-6">
            {/* Top Header Card */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                <div>
                    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#651313]">
                        <MessageSquare className="h-4 w-4" />
                        <span>Management / Inquiries</span>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mt-1">Contact Messages</h1>
                    <p className="text-sm text-gray-500 mt-0.5">
                        Inquiries, consultation messages, and feedback submitted through the "Contact Us" form
                    </p>
                </div>

                <div className="flex items-center gap-2.5">
                    <button
                        onClick={fetchMessages}
                        disabled={loading}
                        className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors shadow-sm disabled:opacity-50"
                        title="Refresh messages"
                    >
                        <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin text-[#651313]" : "text-gray-500"}`} />
                        <span>Refresh</span>
                    </button>
                </div>
            </div>

            {/* KPI Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm relative overflow-hidden">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">Total Inquiries</span>
                        <div className="h-10 w-10 rounded-lg bg-[#651313]/10 text-[#651313] flex items-center justify-center">
                            <Inbox className="h-5 w-5" />
                        </div>
                    </div>
                    <div className="mt-3">
                        <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
                        <div className="mt-1 text-xs text-gray-500">All recorded contact submissions</div>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#651313]" />
                </div>

                <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm relative overflow-hidden">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">Today's Messages</span>
                        <div className="h-10 w-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                            <MessageSquare className="h-5 w-5" />
                        </div>
                    </div>
                    <div className="mt-3">
                        <div className="text-2xl font-bold text-gray-900">{stats.today}</div>
                        <div className="mt-1 text-xs text-emerald-600 font-medium">Received today</div>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-emerald-500" />
                </div>

                <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm relative overflow-hidden">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">Unique Senders</span>
                        <div className="h-10 w-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                            <User className="h-5 w-5" />
                        </div>
                    </div>
                    <div className="mt-3">
                        <div className="text-2xl font-bold text-gray-900">{stats.uniqueSenders}</div>
                        <div className="mt-1 text-xs text-gray-500">Distinct prospective clients</div>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-500" />
                </div>
            </div>

            {/* Messages DataTable */}
            <DataTable
                title="Message Inquiries"
                columns={columns}
                data={messages}
                onRefresh={fetchMessages}
                loading={loading}
                showAddButton={false}
                enableLastFilter={true}
            />

            {/* View Message Detail Modal */}
            {selectedMessage && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
                    <div className="bg-white rounded-2xl max-w-3xl w-full shadow-2xl border border-gray-100 overflow-hidden flex flex-col max-h-[80vh]">
                        {/* Modal Header */}
                        <div className="bg-[#651313] px-6 py-4 text-white flex items-center justify-between shrink-0">
                            <div className="flex items-center gap-3">
                                <div className="h-9 w-9 rounded-xl bg-white/10 flex items-center justify-center">
                                    <Mail className="h-5 w-5 text-white" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-base">Inquiry Details</h3>
                                    <p className="text-xs text-white/70">Message #{selectedMessage.id}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setSelectedMessage(null)}
                                className="h-8 w-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 overflow-y-auto space-y-4">
                            {/* Sender Info Card - Responsive Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100 text-xs">
                                <div>
                                    <span className="text-gray-400 block text-[10px] uppercase font-bold tracking-wider">Sender</span>
                                    <span className="font-bold text-gray-900 text-sm truncate block mt-0.5">{selectedMessage.name}</span>
                                </div>
                                <div>
                                    <span className="text-gray-400 block text-[10px] uppercase font-bold tracking-wider">Email</span>
                                    <a
                                        href={`mailto:${selectedMessage.email}`}
                                        className="font-medium text-[#EB4724] hover:underline truncate block mt-0.5"
                                        title={selectedMessage.email}
                                    >
                                        {selectedMessage.email}
                                    </a>
                                </div>
                                <div>
                                    <span className="text-gray-400 block text-[10px] uppercase font-bold tracking-wider">Phone</span>
                                    <a
                                        href={`tel:${selectedMessage.phone}`}
                                        className="font-medium text-gray-800 hover:text-[#EB4724] truncate block mt-0.5"
                                    >
                                        {selectedMessage.phone || "-"}
                                    </a>
                                </div>
                                <div>
                                    <span className="text-gray-400 block text-[10px] uppercase font-bold tracking-wider">Received On</span>
                                    <span className="text-gray-600 truncate block mt-0.5">
                                        {new Date(selectedMessage.createdAt).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                                    </span>
                                </div>
                            </div>

                            {/* Subject */}
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                                    Subject
                                </label>
                                <div className="px-3.5 py-2.5 bg-white rounded-lg border border-gray-200 text-sm font-semibold text-gray-900">
                                    {selectedMessage.subject || "(No Subject)"}
                                </div>
                            </div>

                            {/* Message Body */}
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                                    Message
                                </label>
                                <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 text-sm text-gray-800 whitespace-pre-wrap leading-relaxed font-sans max-h-[260px] overflow-y-auto">
                                    {selectedMessage.message}
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="px-6 py-3.5 bg-gray-50 border-t border-gray-100 flex items-center justify-end shrink-0">
                            <button
                                onClick={() => setSelectedMessage(null)}
                                className="px-6 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-xs font-semibold text-gray-700 transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirm Modal */}
            <DeleteConfirmModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                itemName={`message from "${deletingName}"`}
            />
        </div>
    );
}
