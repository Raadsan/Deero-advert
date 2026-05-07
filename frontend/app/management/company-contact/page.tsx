"use client";

import React, { useEffect, useState, useMemo } from "react";
import DataTable from "@/components/layout/DataTable";
import Modal from "@/components/layout/Modal";
import DeleteConfirmModal from "@/components/layout/DeleteConfirmModal";
import { Edit, Trash2, Phone, Mail, MapPin } from "lucide-react";
import {
    getCompanyContacts,
    syncCompanyContacts,
} from "@/api-client/companyContactApi";

// ----------------------------------------------------------------
// Types
// ----------------------------------------------------------------
type ContactType = "phone" | "email" | "address";

interface GroupedContact {
    type: ContactType;
    values: string; // comma-separated display string
    rawValues: string[]; // individual values for the edit modal
}

// ----------------------------------------------------------------
// Page
// ----------------------------------------------------------------
export default function CompanyContactPage() {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    // Form state — we always edit/create a full group by type
    const [editingType, setEditingType] = useState<ContactType>("phone");
    const [valuesText, setValuesText] = useState(""); // one per line in the textarea
    const [isAddMode, setIsAddMode] = useState(false);

    // Deletion state
    const [deletingType, setDeletingType] = useState<ContactType | null>(null);

    // ----------------------------------------------------------------
    // Fetch
    // ----------------------------------------------------------------
    const fetchContacts = async () => {
        setLoading(true);
        try {
            const res = await getCompanyContacts();
            setData(res.data || []);
        } catch (err) {
            console.error("Failed to load contact info", err);
            setData([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchContacts();
    }, []);

    // ----------------------------------------------------------------
    // Group raw records by type for table display
    // ----------------------------------------------------------------
    const groupedData: GroupedContact[] = useMemo(() => {
        const groups: Record<string, string[]> = {};
        data.forEach((item) => {
            if (!groups[item.type]) groups[item.type] = [];
            groups[item.type].push(item.value);
        });
        return (Object.entries(groups) as [ContactType, string[]][]).map(
            ([type, rawValues]) => ({
                type,
                values: rawValues.join(", "),
                rawValues,
            })
        );
    }, [data]);

    // ----------------------------------------------------------------
    // Handlers
    // ----------------------------------------------------------------
    const openAddModal = () => {
        // Default to the first type that hasn't been added yet, or "phone"
        const existingTypes = groupedData.map((g) => g.type);
        const remaining = (["phone", "email", "address"] as ContactType[]).filter(
            (t) => !existingTypes.includes(t)
        );
        const defaultType = remaining[0] ?? "phone";
        setEditingType(defaultType);
        setValuesText("");
        setIsAddMode(true);
        setIsModalOpen(true);
    };

    const openEditModal = (group: GroupedContact) => {
        setEditingType(group.type);
        setValuesText(group.rawValues.join("\n"));
        setIsAddMode(false);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setValuesText("");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const values = valuesText
                .split("\n")
                .map((v) => v.trim())
                .filter((v) => v !== "");

            if (values.length === 0) {
                alert("Please enter at least one value.");
                return;
            }

            await syncCompanyContacts(editingType, values);
            closeModal();
            fetchContacts();
        } catch (err: any) {
            console.error("Failed to save contact info", err);
            const errorMessage =
                err.response?.data?.error ||
                err.response?.data?.message ||
                "Failed to save contact info";
            alert(errorMessage);
        }
    };

    const handleDeleteClick = (type: ContactType) => {
        setDeletingType(type);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!deletingType) return;
        try {
            // Syncing with an empty array deletes all entries of that type
            await syncCompanyContacts(deletingType, []);
            fetchContacts();
        } catch (err) {
            console.error("Failed to delete contact info", err);
        } finally {
            setIsDeleteModalOpen(false);
            setDeletingType(null);
        }
    };

    // ----------------------------------------------------------------
    // Table columns
    // ----------------------------------------------------------------
    const columns = [
        {
            label: "Type",
            key: "type",
            render: (row: GroupedContact) => (
                <div className="flex items-center gap-2 capitalize font-medium">
                    {row.type === "phone" && <Phone className="h-4 w-4 text-blue-500" />}
                    {row.type === "email" && <Mail className="h-4 w-4 text-green-500" />}
                    {row.type === "address" && <MapPin className="h-4 w-4 text-red-500" />}
                    {row.type}
                </div>
            ),
        },
        {
            label: "Value",
            key: "values",
            width: "60%",
            render: (row: GroupedContact) => (
                <p className="text-gray-600">{row.values}</p>
            ),
        },
        {
            label: "Actions",
            key: "actions",
            width: "100px",
            render: (row: GroupedContact) => (
                <div className="flex gap-2">
                    <button
                        className="p-2 rounded-lg hover:bg-blue-50 text-blue-600 transition-colors"
                        title={`Edit all ${row.type} entries`}
                        onClick={() => openEditModal(row)}
                    >
                        <Edit className="h-4 w-4" />
                    </button>
                    <button
                        className="p-2 rounded-lg hover:bg-red-50 text-red-600 transition-colors"
                        title={`Delete all ${row.type} entries`}
                        onClick={() => handleDeleteClick(row.type)}
                    >
                        <Trash2 className="h-4 w-4" />
                    </button>
                </div>
            ),
        },
    ];

    // ----------------------------------------------------------------
    // Render
    // ----------------------------------------------------------------
    return (
        <div className="space-y-6">
            <DataTable
                title="Company Contact Information"
                columns={columns}
                data={groupedData}
                showAddButton
                onAddClick={openAddModal}
                onRefresh={fetchContacts}
                loading={loading}
            />

            <DeleteConfirmModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                itemName={`all ${deletingType} contacts`}
            />

            <Modal
                isOpen={isModalOpen}
                onClose={closeModal}
                title={isAddMode ? "Add Contact Info" : `Edit ${editingType} contacts`}
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Type selector — only shown when adding new */}
                    {isAddMode && (
                        <div className="space-y-0.5">
                            <label className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">
                                Type <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={editingType}
                                onChange={(e) => setEditingType(e.target.value as ContactType)}
                                className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#EB4724] focus:border-[#EB4724]"
                            >
                                <option value="phone">Phone</option>
                                <option value="email">Email</option>
                                <option value="address">Address</option>
                            </select>
                        </div>
                    )}

                    {/* Values textarea — one value per line */}
                    <div className="space-y-0.5">
                        <label className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">
                            {editingType === "address" ? "Address" : `${editingType} numbers`}{" "}
                            <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            required
                            rows={5}
                            value={valuesText}
                            onChange={(e) => setValuesText(e.target.value)}
                            placeholder={
                                editingType === "phone"
                                    ? "+252 618 553566\n+252 615 123456"
                                    : editingType === "email"
                                    ? "info@example.com\nsupport@example.com"
                                    : "Enter full address..."
                            }
                            className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#EB4724] focus:border-[#EB4724] resize-none font-mono"
                        />
                        {editingType !== "address" && (
                            <p className="text-[10px] text-gray-400 mt-1">
                                Enter one item per line. All will appear together in a single row.
                            </p>
                        )}
                    </div>

                    <div className="flex justify-end gap-2 pt-3 border-t border-gray-100 mt-4">
                        <button
                            type="button"
                            onClick={closeModal}
                            className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-3 py-1.5 text-xs font-medium text-white bg-[#651313] rounded-lg hover:bg-[#500f0f]"
                        >
                            Save
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
