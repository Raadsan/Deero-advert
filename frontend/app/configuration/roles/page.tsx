"use client";

import { useState, useEffect } from "react";
import DataTable from "@/components/admin/DataTable";
import { getAllRoles, createRole, updateRole, deleteRole, Role } from "@/api/roleApi";
import { Trash2, Edit, Plus } from "lucide-react";

export default function RolesPage() {
    const [roles, setRoles] = useState<Role[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingRole, setEditingRole] = useState<Role | null>(null);
    const [formData, setFormData] = useState({ name: "", description: "" });

    useEffect(() => {
        fetchRoles();
    }, []);

    const fetchRoles = async () => {
        try {
            setLoading(true);
            const response = await getAllRoles();
            if (response.success && response.roles) {
                setRoles(response.roles);
            }
        } catch (error) {
            console.error("Error fetching roles:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingRole) {
                await updateRole(editingRole._id, formData);
            } else {
                await createRole(formData);
            }
            setShowModal(false);
            setFormData({ name: "", description: "" });
            setEditingRole(null);
            fetchRoles();
        } catch (error: any) {
            console.error("Error saving role:", error);
            alert(error.response?.data?.message || "Error saving role");
        }
    };

    const handleEdit = (role: Role) => {
        setEditingRole(role);
        setFormData({ name: role.name, description: role.description || "" });
        setShowModal(true);
    };

    const handleDelete = async (id: string) => {
        if (confirm("Are you sure you want to delete this role?")) {
            try {
                await deleteRole(id);
                fetchRoles();
            } catch (error: any) {
                alert(error.response?.data?.message || "Error deleting role");
            }
        }
    };

    return (
        <div className="p-6">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Role Management</h1>
                    <p className="mt-1 text-sm text-gray-600">
                        Manage user roles and access levels
                    </p>
                </div>
                <button
                    onClick={() => {
                        setEditingRole(null);
                        setFormData({ name: "", description: "" });
                        setShowModal(true);
                    }}
                    className="flex items-center gap-2 rounded-lg bg-[#651313] px-4 py-2 text-white hover:bg-[#EB4724] transition-colors"
                >
                    <Plus className="h-5 w-5" />
                    Add Role
                </button>
            </div>

            {loading ? (
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="animate-pulse space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-12 bg-gray-200 rounded"></div>
                        ))}
                    </div>
                </div>
            ) : (
                <DataTable
                    title="System Roles"
                    columns={[
                        {
                            label: "Name",
                            key: "name",
                            render: (row: Role) => (
                                <span className="font-medium text-gray-900 capitalize">{row.name}</span>
                            ),
                        },
                        {
                            label: "Description",
                            key: "description",
                            render: (row: Role) => (
                                <span className="text-gray-600">{row.description || "-"}</span>
                            ),
                        },
                        {
                            label: "Created",
                            key: "createdAt",
                            render: (row: Role) => (
                                <span className="text-gray-600">
                                    {row.createdAt
                                        ? new Date(row.createdAt).toLocaleDateString()
                                        : "-"}
                                </span>
                            ),
                        },
                        {
                            label: "Actions",
                            key: "actions",
                            width: "150px",
                            render: (row: Role) => (
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => handleEdit(row)}
                                        className="rounded p-2 text-blue-600 hover:bg-blue-50 transition-colors"
                                        title="Edit"
                                    >
                                        <Edit className="h-4 w-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(row._id)}
                                        className="rounded p-2 text-red-600 hover:bg-red-50 transition-colors"
                                        title="Delete"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            ),
                        },
                    ]}
                    data={roles}
                    showAddButton={false}
                />
            )}

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
                        <h2 className="mb-4 text-xl font-bold text-gray-900">
                            {editingRole ? "Edit Role" : "Add New Role"}
                        </h2>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Role Name *
                                </label>
                                <select
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-[#EB4724] focus:outline-none focus:ring-1 focus:ring-[#EB4724]"
                                    required
                                >
                                    <option value="">Select a role</option>
                                    <option value="admin">Admin</option>
                                    <option value="manager">Manager</option>
                                    <option value="user">User</option>
                                </select>
                            </div>
                            <div className="mb-4">
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Description
                                </label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-[#EB4724] focus:outline-none focus:ring-1 focus:ring-[#EB4724]"
                                    rows={3}
                                />
                            </div>
                            <div className="flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowModal(false);
                                        setEditingRole(null);
                                        setFormData({ name: "", description: "" });
                                    }}
                                    className="rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="rounded-lg bg-[#651313] px-4 py-2 text-white hover:bg-[#EB4724] transition-colors"
                                >
                                    {editingRole ? "Update" : "Create"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
