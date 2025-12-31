"use client";

import { useEffect, useState } from "react";
import DataTable from "../../../components/admin/DataTable";
import Modal from "../../../components/admin/Modal";
import { Pencil, Trash2, CheckCircle, XCircle } from "lucide-react";
import { getAllCareers, createCareer, updateCareer, deleteCareer, Career } from "../../../api/careerApi";

export default function CareersPage() {
    const [loading, setLoading] = useState(true);
    const [rows, setRows] = useState<Career[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        title: "",
        type: "Full-time" as Career["type"],
        location: "",
        description: "",
        postedDate: "",
        expireDate: "",
    });

    // Fetch careers
    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await getAllCareers();
            if (res.data.success) {
                setRows(res.data.data);
            }
        } catch (err) {
            console.error("Failed to load careers", err);
            setRows([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Handle input changes
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
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

            if (!formData.postedDate || !formData.expireDate) {
                alert("Both posted and expire dates are required");
                return;
            }

            const posted = new Date(formData.postedDate);
            const expire = new Date(formData.expireDate);

            if (expire <= posted) {
                alert("Expire date must be after posted date");
                return;
            }

            const dataToSend = {
                title: formData.title.trim(),
                type: formData.type,
                location: formData.location.trim(),
                description: formData.description.trim(),
                postedDate: formData.postedDate,
                expireDate: formData.expireDate,
            };

            if (editingId) {
                await updateCareer(editingId, dataToSend);
            } else {
                await createCareer(dataToSend);
            }

            // Reset form and close modal
            setIsModalOpen(false);
            setEditingId(null);
            setFormData({
                title: "",
                type: "Full-time",
                location: "",
                description: "",
                postedDate: "",
                expireDate: "",
            });

            // Reload data
            fetchData();
        } catch (err: any) {
            console.error("Failed to save career", err);
            alert(err.response?.data?.message || "Failed to save job posting");
        }
    };

    // Handle delete
    const handleDelete = async (row: Career) => {
        if (!confirm(`Are you sure you want to delete "${row.title}"?`)) return;
        try {
            await deleteCareer(row._id);
            fetchData();
        } catch (err) {
            console.error("Failed to delete career", err);
            alert("Failed to delete job posting");
        }
    };

    // Handle edit
    const handleEdit = (row: Career) => {
        setEditingId(row._id);
        setFormData({
            title: row.title,
            type: row.type,
            location: row.location,
            description: row.description,
            postedDate: row.postedDate.split("T")[0],
            expireDate: row.expireDate.split("T")[0],
        });
        setIsModalOpen(true);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    };

    const columns = [
        {
            label: "Title",
            key: "title",
            width: "25%",
            render: (row: Career) => (
                <span className="font-medium text-gray-900">{row.title}</span>
            ),
        },
        {
            label: "Type",
            key: "type",
            width: "12%",
            render: (row: Career) => (
                <span className="px-2 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                    {row.type}
                </span>
            ),
        },
        {
            label: "Location",
            key: "location",
            width: "15%",
        },
        {
            label: "Posted Date",
            key: "postedDate",
            width: "12%",
            render: (row: Career) => (
                <span className="text-gray-600 text-sm">{formatDate(row.postedDate)}</span>
            ),
        },
        {
            label: "Expire Date",
            key: "expireDate",
            width: "12%",
            render: (row: Career) => (
                <span className="text-gray-600 text-sm">{formatDate(row.expireDate)}</span>
            ),
        },
        {
            label: "Status",
            key: "isActive",
            width: "10%",
            render: (row: Career) => {
                const isActive = new Date() <= new Date(row.expireDate);
                return (
                    <span
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${isActive
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                            }`}
                    >
                        {isActive ? (
                            <>
                                <CheckCircle className="h-3 w-3" />
                                Active
                            </>
                        ) : (
                            <>
                                <XCircle className="h-3 w-3" />
                                Expired
                            </>
                        )}
                    </span>
                );
            },
        },
        {
            label: "Actions",
            key: "actions",
            width: "14%",
            render: (row: Career) => (
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
                title="Job Postings"
                columns={columns}
                data={rows}
                showAddButton
                onAddClick={() => {
                    setIsModalOpen(true);
                    setEditingId(null);
                    setFormData({
                        title: "",
                        type: "Full-time",
                        location: "",
                        description: "",
                        postedDate: "",
                        expireDate: "",
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
                        type: "Full-time",
                        location: "",
                        description: "",
                        postedDate: "",
                        expireDate: "",
                    });
                }}
                title={editingId ? "Edit Job Posting" : "Add New Job Posting"}
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Title */}
                    <div className="space-y-0.5">
                        <label className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">
                            Job Title <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="title"
                            required
                            value={formData.title}
                            onChange={handleInputChange}
                            className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#EB4724] focus:border-[#EB4724]"
                            placeholder="e.g., Graphic Designer"
                        />
                    </div>

                    {/* Type */}
                    <div className="space-y-0.5">
                        <label className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">
                            Job Type <span className="text-red-500">*</span>
                        </label>
                        <select
                            name="type"
                            required
                            value={formData.type}
                            onChange={handleInputChange}
                            className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#EB4724] focus:border-[#EB4724]"
                        >
                            <option value="Full-time">Full-time</option>
                            <option value="Part-time">Part-time</option>
                            <option value="Contract">Contract</option>
                            <option value="Internship">Internship</option>
                        </select>
                    </div>

                    {/* Location */}
                    <div className="space-y-0.5">
                        <label className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">
                            Location <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="location"
                            required
                            value={formData.location}
                            onChange={handleInputChange}
                            className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#EB4724] focus:border-[#EB4724]"
                            placeholder="e.g., Mogadishu, Somalia"
                        />
                    </div>

                    {/* Description */}
                    <div className="space-y-0.5">
                        <label className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">
                            Description <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            name="description"
                            required
                            value={formData.description}
                            onChange={handleInputChange}
                            rows={4}
                            className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#EB4724] focus:border-[#EB4724]"
                            placeholder="Job description and requirements..."
                        />
                    </div>

                    {/* Dates */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-0.5">
                            <label className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">
                                Posted Date <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="date"
                                name="postedDate"
                                required
                                value={formData.postedDate}
                                onChange={handleInputChange}
                                className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#EB4724] focus:border-[#EB4724]"
                            />
                        </div>
                        <div className="space-y-0.5">
                            <label className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">
                                Expire Date <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="date"
                                name="expireDate"
                                required
                                value={formData.expireDate}
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
                                setEditingId(null);
                                setFormData({
                                    title: "",
                                    type: "Full-time",
                                    location: "",
                                    description: "",
                                    postedDate: "",
                                    expireDate: "",
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
