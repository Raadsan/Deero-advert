"use client";
export const dynamic = 'force-static';

import React, { useEffect, useState } from "react";
import Image from "next/image";
import DataTable from "@/components/layout/DataTable";
import Modal from "@/components/layout/Modal";
import DeleteConfirmModal from "@/components/layout/DeleteConfirmModal";
import { Trash2, Camera, X, Pencil } from "lucide-react";
import { getApproaches, createApproach, updateApproach, deleteApproach } from "@/api-client/approachApi";
import { getImageUrl } from "@/utils/url";
import { compressImage } from "@/utils/compressImage";
import { toast } from "react-hot-toast";

const emptyForm = { title: "", sortOrder: 0, isActive: true, icon: null as File | null, iconPreview: "" };

export default function ApproachesPage() {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [deletingId, setDeletingId] = useState<number | null>(null);
    const [deletingName, setDeletingName] = useState("");
    const [formData, setFormData] = useState(emptyForm);

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await getApproaches();
            setData((res.data || []).map((i: any) => ({ ...i, icon: getImageUrl(i.icon) })));
        } catch { setData([]); } finally { setLoading(false); }
    };

    useEffect(() => { fetchData(); }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value }));
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            const compressed = await compressImage(e.target.files[0]);
            setFormData(prev => ({ ...prev, icon: compressed, iconPreview: URL.createObjectURL(compressed) }));
            e.target.value = "";
        }
    };

    const resetForm = () => { setFormData(emptyForm); setEditingId(null); };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const fd = new FormData();
        fd.append("title", formData.title);
        fd.append("sortOrder", formData.sortOrder.toString());
        fd.append("isActive", formData.isActive.toString());
        if (formData.icon) fd.append("icon", formData.icon);
        try {
            editingId ? await updateApproach(editingId, fd) : await createApproach(fd);
            toast.success(editingId ? "Updated" : "Created");
            setIsModalOpen(false); resetForm(); fetchData();
        } catch (err: any) { toast.error(err.response?.data?.message || "Failed"); }
    };

    const handleEdit = (row: any) => {
        setEditingId(row.id);
        setFormData({ title: row.title, sortOrder: row.sortOrder, isActive: row.isActive, icon: null, iconPreview: row.icon || "" });
        setIsModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!deletingId) return;
        try { await deleteApproach(deletingId); toast.success("Deleted"); fetchData(); }
        catch { toast.error("Failed to delete"); }
        finally { setIsDeleteModalOpen(false); setDeletingId(null); }
    };

    const columns = [
        { label: "Icon", key: "icon", width: "10%", render: (row: any) => <div className="h-10 w-10 relative bg-gray-100 rounded overflow-hidden">{row.icon ? <Image src={row.icon} alt="" fill unoptimized className="object-contain" /> : <span className="text-gray-400 text-xs">—</span>}</div> },
        { label: "Title", key: "title", width: "55%" },
        { label: "Order", key: "sortOrder", width: "10%" },
        { label: "Status", key: "isActive", render: (row: any) => <span className={`px-2 py-1 text-xs font-semibold rounded-full ${row.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>{row.isActive ? "Active" : "Inactive"}</span> },
        { label: "Actions", key: "actions", width: "100px", render: (row: any) => <div className="flex gap-2"><button className="p-2 rounded-lg hover:bg-blue-50 text-blue-600" onClick={() => handleEdit(row)}><Pencil className="h-4 w-4" /></button><button className="p-2 rounded-lg hover:bg-red-50 text-red-600" onClick={() => { setDeletingId(row.id); setDeletingName(row.title); setIsDeleteModalOpen(true); }}><Trash2 className="h-4 w-4" /></button></div> },
    ];

    return (
        <div className="space-y-6">
            <DataTable title="Our Approaches" columns={columns} data={data} showAddButton onAddClick={() => { resetForm(); setIsModalOpen(true); }} onRefresh={fetchData} loading={loading} />
            <DeleteConfirmModal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} onConfirm={confirmDelete} itemName={deletingName} />
            <Modal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); resetForm(); }} title={editingId ? "Edit Approach" : "Add Approach"}>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Icon Image</label>
                        <div className="flex gap-4">
                            {formData.iconPreview ? (
                                <div className="relative h-24 w-24 rounded-lg border border-gray-200 overflow-hidden group bg-gray-50">
                                    <img src={formData.iconPreview} alt="preview" className="h-full w-full object-contain" />
                                    <button type="button" onClick={() => setFormData(p => ({ ...p, icon: null, iconPreview: "" }))} className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 opacity-0 group-hover:opacity-100"><X className="h-3 w-3" /></button>
                                </div>
                            ) : (
                                <label className="flex flex-col items-center justify-center h-24 w-24 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 cursor-pointer">
                                    <Camera className="h-6 w-6 text-gray-400" />
                                    <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                                </label>
                            )}
                        </div>
                    </div>
                    <div className="space-y-0.5">
                        <label className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Title <span className="text-red-500">*</span></label>
                        <input type="text" name="title" required value={formData.title} onChange={handleInputChange} className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#EB4724]" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-0.5">
                            <label className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Sort Order</label>
                            <input type="number" name="sortOrder" value={formData.sortOrder} onChange={handleInputChange} className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#EB4724]" />
                        </div>
                        <div className="flex items-center space-x-2 pt-5">
                            <input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleInputChange} className="h-4 w-4 text-[#EB4724] border-gray-300 rounded" />
                            <label className="text-sm font-medium text-gray-700">Active</label>
                        </div>
                    </div>
                    <div className="flex justify-end gap-2 pt-3 border-t border-gray-100 mt-4">
                        <button type="button" onClick={() => { setIsModalOpen(false); resetForm(); }} className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">Cancel</button>
                        <button type="submit" className="px-3 py-1.5 text-xs font-medium text-white bg-[#651313] rounded-lg hover:bg-[#500f0f]">Save</button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
