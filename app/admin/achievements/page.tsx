"use client";

import React, { useState } from "react";
import Image from "next/image";
import DataTable from "@/components/admin/DataTable";
import Modal from "@/components/admin/Modal";
import { Pencil, Trash2, Camera } from "lucide-react";

// Placeholder data
const initialAchievements = [
    {
        id: 1,
        title: "Projects Completed",
        count: 150,
        icon: "/home-images/deliver.svg",
    },
    {
        id: 2,
        title: "Happy Clients",
        count: 120,
        icon: "/home-images/feedback.svg",
    },
    {
        id: 3,
        title: "Awards Won",
        count: 15,
        icon: "/home-images/innovation.svg",
    },
];

export default function AchievementsPage() {
    const [data, setData] = useState(initialAchievements);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        count: "",
        icon: "" // URL for image
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Simulate adding data
        const newId = data.length + 1;
        const newAchievement = {
            id: newId,
            title: formData.title,
            count: Number(formData.count),
            icon: formData.icon || "/placeholder-icon.svg"
        };
        setData([newAchievement, ...data]);
        setIsModalOpen(false);
        setFormData({ title: "", count: "", icon: "" }); // Reset form
    };

    const columns = [
        {
            label: "Icon",
            key: "icon",
            render: (row: any) => (
                <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-lg bg-gray-50 p-2 border border-gray-100">
                    <Image
                        src={row.icon}
                        alt={row.title}
                        width={40}
                        height={40}
                        className="h-full w-full object-contain"
                        onError={(e) => {
                            (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${row.title}&background=random`;
                        }}
                    />
                </div>
            )
        },
        {
            label: "Title",
            key: "title",
        },
        {
            label: "Count",
            key: "count",
            render: (row: any) => (
                <span className="font-bold text-[#651313]">{row.count}</span>
            )
        },
        {
            label: "Actions",
            key: "actions",
            width: "150px",
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
                title="Achievements"
                columns={columns}
                data={data}
                onAddClick={() => setIsModalOpen(true)}
            />

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Add Achievement"
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Icon Upload Placeholder - Compact Style */}
                    <div className="flex flex-col items-center justify-center mb-4">
                        <div className="relative h-16 w-16 rounded-lg bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors group">
                            {formData.icon ? (
                                <img src={formData.icon} alt="Preview" className="h-full w-full rounded-lg object-contain p-2" />
                            ) : (
                                <Camera className="h-5 w-5 text-gray-400 group-hover:text-[#EB4724] transition-colors" />
                            )}
                            <input
                                type="text"
                                name="icon"
                                placeholder="Icon URL..."
                                className="absolute inset-0 opacity-0 cursor-pointer"
                                readOnly
                            />
                        </div>
                        <p className="text-[10px] text-gray-500 mt-1">Upload Icon</p>
                        <input
                            type="text"
                            name="icon"
                            value={formData.icon}
                            onChange={handleInputChange}
                            placeholder="Icon URL..."
                            className="mt-1 w-2/3 text-[10px] border border-gray-200 rounded px-2 py-0.5 focus:outline-none focus:border-[#EB4724]"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-0.5">
                            <label className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Title <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                name="title"
                                required
                                value={formData.title}
                                onChange={handleInputChange}
                                className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#EB4724] focus:border-[#EB4724] transition-all"
                                placeholder="e.g. Clients"
                            />
                        </div>
                        <div className="space-y-0.5">
                            <label className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Count <span className="text-red-500">*</span></label>
                            <input
                                type="number"
                                name="count"
                                required
                                value={formData.count}
                                onChange={handleInputChange}
                                className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#EB4724] focus:border-[#EB4724] transition-all"
                                placeholder="123"
                            />
                        </div>
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
