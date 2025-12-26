"use client";

import React, { useState } from "react";
import Image from "next/image";
import DataTable from "@/components/admin/DataTable";
import Modal from "@/components/admin/Modal";
import { Pencil, Trash2, Upload, Camera } from "lucide-react";

// Placeholder data based on user schema
const initialTestimonials = [
    {
        id: 1,
        clientName: "Ahmed Ali",
        clientTitle: "CEO, Somtel",
        clientImage: "/home-images/client1.jpg",
        message: "Great service and amazing results. Highly recommended!",
    },
    {
        id: 2,
        clientName: "Maryan Hassan",
        clientTitle: "Marketing Director, Hormuud",
        clientImage: "/home-images/client2.jpg",
        message: "They transformed our digital presence completely.",
    },
    {
        id: 3,
        clientName: "Abdi Nour",
        clientTitle: "Founder, BlueSky",
        clientImage: "/home-images/client3.jpg",
        message: "Professional team and timely delivery.",
    },
];

export default function TestimonialsPage() {
    const [data, setData] = useState(initialTestimonials);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        clientName: "",
        clientTitle: "",
        clientImage: "",
        message: ""
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Simulate adding data
        const newId = data.length + 1;
        const newTestimonial = { ...formData, id: newId };
        setData([newTestimonial, ...data]);
        setIsModalOpen(false);
        setFormData({ clientName: "", clientTitle: "", clientImage: "", message: "" }); // Reset form
    };

    const columns = [
        {
            label: "Client Image",
            key: "clientImage",
            render: (row: any) => (
                <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-full border border-gray-100 bg-gray-50">
                    <Image
                        src={row.clientImage || "/placeholder-user.jpg"}
                        alt={row.clientName}
                        width={48}
                        height={48}
                        className="h-full w-full object-cover"
                        onError={(e) => {
                            (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${row.clientName}&background=random`;
                        }}
                    />
                </div>
            )
        },
        {
            label: "Client Name",
            key: "clientName",
            render: (row: any) => (
                <span className="font-semibold text-gray-900">{row.clientName}</span>
            )
        },
        {
            label: "Client Title",
            key: "clientTitle",
            render: (row: any) => (
                <span className="text-gray-500">{row.clientTitle}</span>
            )
        },
        {
            label: "Message",
            key: "message",
            width: "40%",
            render: (row: any) => (
                <p className="line-clamp-2 text-gray-600 italic">"{row.message}"</p>
            )
        },
        {
            label: "Actions",
            key: "actions",
            width: "100px",
            render: (row: any) => (
                <div className="flex gap-2">
                    <button className="p-2 rounded-lg hover:bg-orange-50 text-[#EB4724] transition-colors" title="Edit">
                        <Pencil className="h-4 w-4" />
                    </button>
                    <button className="p-2 rounded-lg hover:bg-red-50 text-red-500 transition-colors" title="Delete">
                        <Trash2 className="h-4 w-4" />
                    </button>
                </div>
            )
        }
    ];

    return (
        <div className="space-y-6">
            <DataTable
                title="Testimonials"
                columns={columns}
                data={data}
                onAddClick={() => setIsModalOpen(true)}
            />

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Add New Testimonial"
            >
                <form onSubmit={handleSubmit} className="space-y-2">
                    {/* Image Upload Placeholder */}
                    <div className="flex flex-col items-center justify-center mb-3">
                        <div className="relative h-16 w-16 rounded-full bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors group">
                            {formData.clientImage ? (
                                <img src={formData.clientImage} alt="Preview" className="h-full w-full rounded-full object-cover" />
                            ) : (
                                <Camera className="h-5 w-5 text-gray-400 group-hover:text-[#EB4724] transition-colors" />
                            )}
                            <input
                                type="text"
                                name="clientImage"
                                placeholder="Image URL..."
                                className="absolute inset-0 opacity-0 cursor-pointer"
                                readOnly
                            />
                        </div>
                        <p className="text-[10px] text-gray-500 mt-1">Upload Photo</p>
                        <input
                            type="text"
                            name="clientImage"
                            value={formData.clientImage}
                            onChange={handleInputChange}
                            placeholder="Image URL..."
                            className="mt-1 w-2/3 text-[10px] border border-gray-200 rounded px-2 py-0.5 focus:outline-none focus:border-[#EB4724]"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-0.5">
                            <label className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Client Name <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                name="clientName"
                                required
                                value={formData.clientName}
                                onChange={handleInputChange}
                                className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#EB4724] focus:border-[#EB4724] transition-all"
                                placeholder="Name"
                            />
                        </div>
                        <div className="space-y-0.5">
                            <label className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Client Title <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                name="clientTitle"
                                required
                                value={formData.clientTitle}
                                onChange={handleInputChange}
                                className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#EB4724] focus:border-[#EB4724] transition-all"
                                placeholder="Title"
                            />
                        </div>
                    </div>

                    <div className="space-y-0.5">
                        <label className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Message <span className="text-red-500">*</span></label>
                        <textarea
                            name="message"
                            required
                            rows={3}
                            value={formData.message}
                            onChange={handleInputChange}
                            className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#EB4724] focus:border-[#EB4724] transition-all resize-none"
                            placeholder="Testimonial message..."
                        />
                    </div>

                    <div className="flex justify-end gap-2 pt-3 border-t border-gray-100 mt-4">
                        <button
                            type="button"
                            onClick={() => setIsModalOpen(false)}
                            className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-3 py-1.5 text-xs font-medium text-white bg-[#651313] rounded-lg hover:bg-[#500f0f] transition-colors shadow-sm"
                        >
                            Save
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
