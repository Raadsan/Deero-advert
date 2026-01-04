"use client";

import { useEffect, useState } from "react";
import DataTable from "@/components/layout/DataTable";
import Modal from "@/components/layout/Modal";
import { Pencil, Trash2 } from "lucide-react";
import { getAllEventsNews, createEventNews, updateEventNews, deleteEventNews } from "../../../api/eventsNewsApi";

type EventNewsItem = {
    _id: string;
    title: string;
    type: "event" | "news";
    date: string;
    isPublished: boolean;
    createdAt: string;
    updatedAt: string;
};

export default function EventsNewsPage() {
    const [loading, setLoading] = useState(true);
    const [rows, setRows] = useState<EventNewsItem[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        title: "",
        type: "event" as "event" | "news",
        date: "",
    });

    // Fetch events and news
    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await getAllEventsNews();
            if (res.data.success) {
                setRows(res.data.data);
            }
        } catch (err) {
            console.error("Failed to load events & news", err);
            setRows([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Handle input changes
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // Handle form submit
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            if (!formData.title.trim()) {
                alert("Title is required");
                return;
            }

            if (!formData.date) {
                alert("Date is required");
                return;
            }

            const dataToSend = {
                title: formData.title.trim(),
                type: formData.type,
                date: formData.date,
            };

            if (editingId) {
                await updateEventNews(editingId, dataToSend);
            } else {
                await createEventNews(dataToSend);
            }

            // Reset form and close modal
            setIsModalOpen(false);
            setEditingId(null);
            setFormData({
                title: "",
                type: "event",
                date: "",
            });

            // Reload data
            fetchData();
        } catch (err: any) {
            console.error("Failed to save event/news", err);
            alert(err.response?.data?.message || "Failed to save event/news");
        }
    };

    // Handle delete
    const handleDelete = async (row: EventNewsItem) => {
        if (!confirm(`Are you sure you want to delete "${row.title}"?`)) return;
        try {
            await deleteEventNews(row._id);
            fetchData();
        } catch (err) {
            console.error("Failed to delete event/news", err);
            alert("Failed to delete event/news");
        }
    };

    // Handle edit
    const handleEdit = (row: EventNewsItem) => {
        setEditingId(row._id);
        setFormData({
            title: row.title,
            type: row.type,
            date: row.date.split("T")[0], // Format date for input
        });
        setIsModalOpen(true);
    };

    const columns = [
        {
            label: "Title",
            key: "title",
            width: "40%",
            render: (row: EventNewsItem) => (
                <span className="font-medium text-gray-900">{row.title}</span>
            ),
        },
        {
            label: "Type",
            key: "type",
            width: "15%",
            render: (row: EventNewsItem) => (
                <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold uppercase ${row.type === "event"
                        ? "bg-blue-100 text-blue-700 border border-blue-200"
                        : "bg-green-100 text-green-700 border border-green-200"
                        }`}
                >
                    {row.type}
                </span>
            ),
        },
        {
            label: "Date",
            key: "date",
            width: "20%",
            render: (row: EventNewsItem) => (
                <span className="text-gray-600">
                    {new Date(row.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                    })}
                </span>
            ),
        },
        {
            label: "Actions",
            key: "actions",
            width: "15%",
            render: (row: EventNewsItem) => (
                <div className="flex gap-2">
                    <button
                        onClick={() => handleEdit(row)}
                        className="p-2 rounded-lg hover:bg-orange-50 text-[#EB4724] transition-colors"
                        title="Edit"
                    >
                        <Pencil className="h-4 w-4" />
                    </button>
                    <button
                        onClick={() => handleDelete(row)}
                        className="p-2 rounded-lg hover:bg-red-50 text-red-500 transition-colors"
                        title="Delete"
                    >
                        <Trash2 className="h-4 w-4" />
                    </button>
                </div>
            ),
        },
    ];

    return (
        <div className="space-y-6 p-6">
            <DataTable
                title="Events & News"
                columns={columns}
                data={rows}
                showAddButton
                onAddClick={() => {
                    setIsModalOpen(true);
                    setEditingId(null);
                    setFormData({
                        title: "",
                        type: "event",
                        date: "",
                    });
                }}
                loading={loading}
            />

            <Modal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setEditingId(null);
                    setFormData({
                        title: "",
                        type: "event",
                        date: "",
                    });
                }}
                title={editingId ? "Edit Event/News" : "Add New Event/News"}
            >
                <form onSubmit={handleSubmit} className="space-y-4">
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
                            placeholder="e.g., Annual Tech Conference"
                        />
                    </div>

                    {/* Type */}
                    <div className="space-y-0.5">
                        <label className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">
                            Type <span className="text-red-500">*</span>
                        </label>
                        <select
                            name="type"
                            required
                            value={formData.type}
                            onChange={handleInputChange}
                            className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#EB4724] focus:border-[#EB4724]"
                        >
                            <option value="event">Event</option>
                            <option value="news">News</option>
                        </select>
                    </div>

                    {/* Date */}
                    <div className="space-y-0.5">
                        <label className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">
                            Date <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="date"
                            name="date"
                            required
                            value={formData.date}
                            onChange={handleInputChange}
                            className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#EB4724] focus:border-[#EB4724]"
                        />
                    </div>

                    <div className="flex justify-end gap-2 pt-3 border-t border-gray-100 mt-4">
                        <button
                            type="button"
                            onClick={() => {
                                setIsModalOpen(false);
                                setEditingId(null);
                                setFormData({
                                    title: "",
                                    type: "event",
                                    date: "",
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
                            {editingId ? "Update" : "Save"}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
