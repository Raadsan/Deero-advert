"use client";
export const dynamic = 'force-static';

import { useState, useEffect } from "react";
import DataTable from "@/components/layout/DataTable";
import Modal from "@/components/layout/Modal";
import DeleteConfirmModal from "@/components/layout/DeleteConfirmModal";
import { getAllMenus, createMenu, updateMenu, deleteMenu } from "@/api-client/menuApi";
import { Menu } from "@/types/menu";
import { Trash2, Edit, Plus, ChevronDown, ChevronRight } from "lucide-react";

export default function MenusPage() {
    const [menus, setMenus] = useState<Menu[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [editingMenu, setEditingMenu] = useState<Menu | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [deletingName, setDeletingName] = useState("");
    const [formData, setFormData] = useState({
        title: "",
        icon: "",
        url: "",
        isCollapsible: false,
        subMenus: [] as Array<{ _id?: string; title: string; url: string }>,
    });

    useEffect(() => {
        fetchMenus();
    }, []);

    const fetchMenus = async () => {
        try {
            setLoading(true);
            const response = await getAllMenus();
            if (response.success && response.menus) {
                setMenus(response.menus);
            }
        } catch (error) {
            console.error("Error fetching menus:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingMenu) {
                await updateMenu(editingMenu._id, formData);
            } else {
                await createMenu(formData);
            }
            setShowModal(false);
            setFormData({ title: "", icon: "", url: "", isCollapsible: false, subMenus: [] });
            setEditingMenu(null);
            fetchMenus();
        } catch (error: any) {
            console.error("Error saving menu:", error);
            alert(error.response?.data?.message || "Error saving menu");
        }
    };

    const handleEdit = (menu: Menu) => {
        setEditingMenu(menu);
        setFormData({
            title: menu.title,
            icon: menu.icon || "",
            url: menu.url || "",
            isCollapsible: menu.isCollapsible,
            subMenus: menu.subMenus.map(sm => ({ _id: sm._id, title: sm.title, url: sm.url })),
        });
        setShowModal(true);
    };

    const handleDelete = (id: string, title: string) => {
        setDeletingId(id);
        setDeletingName(title);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!deletingId) return;
        try {
            await deleteMenu(deletingId);
            fetchMenus();
        } catch (error: any) {
            alert(error.response?.data?.message || "Error deleting menu");
        } finally {
            setIsDeleteModalOpen(false);
            setDeletingId(null);
            setDeletingName("");
        }
    };

    const addSubMenu = () => {
        setFormData({
            ...formData,
            subMenus: [...formData.subMenus, { title: "", url: "" }],
        });
    };

    const removeSubMenu = (index: number) => {
        setFormData({
            ...formData,
            subMenus: formData.subMenus.filter((_, i) => i !== index),
        });
    };

    const updateSubMenu = (index: number, field: "title" | "url", value: string) => {
        const newSubMenus = [...formData.subMenus];
        newSubMenus[index][field] = value;
        setFormData({ ...formData, subMenus: newSubMenus });
    };

    return (
        <div className="space-y-6">


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
                    title="Menu Management"
                    columns={[
                        {
                            label: "Title",
                            key: "title",
                            render: (row: Menu) => (
                                <div className="flex items-center gap-2">
                                    {row.isCollapsible ? (
                                        <ChevronDown className="h-4 w-4 text-gray-400" />
                                    ) : (
                                        <ChevronRight className="h-4 w-4 text-gray-400" />
                                    )}
                                    <span className="font-medium text-gray-900">{row.title}</span>
                                </div>
                            ),
                        },
                        {
                            label: "Icon",
                            key: "icon",
                            render: (row: Menu) => (
                                <span className="text-sm text-gray-600">{row.icon || "-"}</span>
                            ),
                        },
                        {
                            label: "URL",
                            key: "url",
                            render: (row: Menu) => (
                                <span className="text-sm text-gray-600 font-mono">{row.url || "-"}</span>
                            ),
                        },
                        {
                            label: "Type",
                            key: "isCollapsible",
                            render: (row: Menu) => (
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${row.isCollapsible
                                    ? "bg-purple-100 text-purple-700"
                                    : "bg-blue-100 text-blue-700"
                                    }`}>
                                    {row.isCollapsible ? "Collapsible" : "Direct Link"}
                                </span>
                            ),
                        },
                        {
                            label: "Submenus",
                            key: "subMenus",
                            render: (row: Menu) => (
                                <span className="text-sm text-gray-600">
                                    {row.subMenus?.length || 0} items
                                </span>
                            ),
                        },
                        {
                            label: "Actions",
                            key: "actions",
                            width: "150px",
                            render: (row: Menu) => (
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => handleEdit(row)}
                                        className="rounded p-2 text-blue-600 hover:bg-blue-50 transition-colors"
                                        title="Edit"
                                    >
                                        <Edit className="h-4 w-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(row._id, row.title)}
                                        className="rounded p-2 text-red-600 hover:bg-red-50 transition-colors"
                                        title="Delete"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            ),
                        },
                    ]}
                    data={menus}
                    onAddClick={() => {
                        setEditingMenu(null);
                        setFormData({ title: "", icon: "", url: "", isCollapsible: false, subMenus: [] });
                        setShowModal(true);
                    }}
                    onRefresh={fetchMenus}
                    loading={loading}
                />
            )}

            <DeleteConfirmModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                itemName={deletingName}
            />

            {/* Modal */}
            <Modal
                isOpen={showModal}
                onClose={() => {
                    setShowModal(false);
                    setEditingMenu(null);
                    setFormData({ title: "", icon: "", url: "", isCollapsible: false, subMenus: [] });
                }}
                title={editingMenu ? "Edit Menu" : "Add New Menu"}
                maxWidth="max-w-4xl"
            >
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                Menu Title *
                            </label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-[#EB4724] focus:outline-none focus:ring-1 focus:ring-[#EB4724]"
                                required
                            />
                        </div>
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                Icon Name
                            </label>
                            <input
                                type="text"
                                value={formData.icon}
                                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-[#EB4724] focus:outline-none focus:ring-1 focus:ring-[#EB4724]"
                                placeholder="e.g., settings, dashboard"
                            />
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            URL Path
                        </label>
                        <input
                            type="text"
                            value={formData.url}
                            onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-[#EB4724] focus:outline-none focus:ring-1 focus:ring-[#EB4724]"
                            placeholder="/path/to/page"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={formData.isCollapsible}
                                onChange={(e) => setFormData({ ...formData, isCollapsible: e.target.checked })}
                                className="rounded border-gray-300 text-[#651313] focus:ring-[#EB4724]"
                            />
                            <span className="text-sm font-medium text-gray-700">Collapsible (has submenus)</span>
                        </label>
                    </div>

                    {formData.isCollapsible && (
                        <div className="mb-4">
                            <div className="flex items-center justify-between mb-2">
                                <label className="block text-sm font-medium text-gray-700">
                                    Submenus
                                </label>
                                <button
                                    type="button"
                                    onClick={addSubMenu}
                                    className="text-sm text-[#651313] hover:text-[#EB4724]"
                                >
                                    + Add Submenu
                                </button>
                            </div>
                            <div className="space-y-2">
                                {formData.subMenus.map((submenu, index) => (
                                    <div key={index} className="flex gap-2">
                                        <input
                                            type="text"
                                            value={submenu.title}
                                            onChange={(e) => updateSubMenu(index, "title", e.target.value)}
                                            placeholder="Submenu title"
                                            className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#EB4724] focus:outline-none focus:ring-1 focus:ring-[#EB4724]"
                                        />
                                        <input
                                            type="text"
                                            value={submenu.url}
                                            onChange={(e) => updateSubMenu(index, "url", e.target.value)}
                                            placeholder="/submenu/path"
                                            className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#EB4724] focus:outline-none focus:ring-1 focus:ring-[#EB4724]"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeSubMenu(index)}
                                            className="rounded p-2 text-red-600 hover:bg-red-50"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={() => {
                                setShowModal(false);
                                setEditingMenu(null);
                                setFormData({ title: "", icon: "", url: "", isCollapsible: false, subMenus: [] });
                            }}
                            className="rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="rounded-lg bg-[#651313] px-4 py-2 text-white hover:bg-[#EB4724] transition-colors"
                        >
                            {editingMenu ? "Update" : "Create"}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}

