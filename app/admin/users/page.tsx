"use client";

import React, { useState } from "react";
import DataTable from "@/components/admin/DataTable";
import Modal from "@/components/admin/Modal";
import { Pencil, Trash2, UserPlus } from "lucide-react";

// Placeholder data
const initialUsers = [
    {
        id: 1,
        fullname: "Admin User",
        email: "admin@deero.com",
        password: "password123", // In a real app, never send raw passwords to frontend
        role: "Administrator",
    },
    {
        id: 2,
        fullname: "Editor User",
        email: "editor@deero.com",
        password: "password123",
        role: "Editor",
    },
    {
        id: 3,
        fullname: "Viewer User",
        email: "viewer@deero.com",
        password: "password123",
        role: "Viewer",
    },
];

export default function UsersPage() {
    const [data, setData] = useState(initialUsers);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        fullname: "",
        email: "",
        password: "",
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newId = data.length + 1;
        const newUser = { id: newId, ...formData, role: "Viewer" };
        setData([newUser, ...data]);
        setIsModalOpen(false);
        setFormData({ fullname: "", email: "", password: "" });
    };

    const columns = [
        {
            label: "Fullname",
            key: "fullname",
            render: (row: any) => (
                <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center text-[#651313] font-bold text-xs uppercase border border-gray-200">
                        {row.fullname.charAt(0)}
                        {row.fullname.split(" ")[1]?.charAt(0)}
                    </div>
                    <span className="font-medium text-gray-900">{row.fullname}</span>
                </div>
            )
        },
        {
            label: "Email",
            key: "email",
        },
        {
            label: "Password",
            key: "password",
            render: (row: any) => (
                <span className="font-mono text-gray-400">•••••••••••</span>
            )
        },
        {
            label: "Role",
            key: "role",
            render: (row: any) => (
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium 
                    ${row.role === 'Administrator' ? 'bg-red-50 text-red-700 border border-red-100' :
                        row.role === 'Editor' ? 'bg-blue-50 text-blue-700 border border-blue-100' :
                            'bg-gray-50 text-gray-600 border border-gray-100'}`}>
                    {row.role}
                </span>
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
                title="Users Management"
                columns={columns}
                data={data}
                onAddClick={() => setIsModalOpen(true)}
            />

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Add New User"
            >
                <form onSubmit={handleSubmit} className="space-y-2">
                    <div className="space-y-0.5">
                        <label className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Fullname <span className="text-red-500">*</span></label>
                        <input
                            type="text"
                            name="fullname"
                            required
                            value={formData.fullname}
                            onChange={handleInputChange}
                            className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#EB4724] focus:border-[#EB4724] transition-all"
                            placeholder="John Doe"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-0.5">
                            <label className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Email <span className="text-red-500">*</span></label>
                            <input
                                type="email"
                                name="email"
                                required
                                value={formData.email}
                                onChange={handleInputChange}
                                className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#EB4724] focus:border-[#EB4724] transition-all"
                                placeholder="john@example.com"
                            />
                        </div>
                        <div className="space-y-0.5">
                            <label className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Password <span className="text-red-500">*</span></label>
                            <input
                                type="password"
                                name="password"
                                required
                                value={formData.password}
                                onChange={handleInputChange}
                                className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#EB4724] focus:border-[#EB4724] transition-all"
                                placeholder="••••••••"
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
                            Create User
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
