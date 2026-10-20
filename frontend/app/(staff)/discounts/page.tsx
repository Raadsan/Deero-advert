"use client";

import { useState, useEffect } from "react";
import DataTable from "@/components/layout/DataTable";
import Modal from "@/components/layout/Modal";
import ConfirmModal from "@/components/layout/ConfirmModal";
import { getAllDiscounts, deleteDiscount, updateDiscountStatus } from "@/api-client/discountApi";
import { TrashIcon, CheckCircleIcon, XCircleIcon, EyeIcon } from "@heroicons/react/24/outline";
import toast from "react-hot-toast";

export default function DiscountManagementPage() {
    const [discounts, setDiscounts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [viewingDiscount, setViewingDiscount] = useState<any>(null);
    const [statusConfirm, setStatusConfirm] = useState<{
        open: boolean;
        id: string;
        currentStatus: string;
    }>({ open: false, id: "", currentStatus: "" });

    const fetchDiscounts = async () => {
        try {
            setLoading(true);
            const res: any = await getAllDiscounts();
            setDiscounts(res.data?.discounts || res.data || []);
        } catch (error) {
            console.error("Failed to load discounts", error);
            toast.error("Failed to load discounts");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDiscounts();
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this discount?")) return;
        try {
            await deleteDiscount(id);
            toast.success("Discount deleted successfully");
            fetchDiscounts();
        } catch (error) {
            console.error("Failed to delete discount", error);
            toast.error("Failed to delete discount");
        }
    };

    const confirmToggleStatus = async () => {
        const { id, currentStatus } = statusConfirm;
        try {
            const newStatus = currentStatus === "active" ? "inactive" : "active";
            await updateDiscountStatus(id, newStatus);
            toast.success(
                `Discount ${newStatus === "active" ? "activated" : "deactivated"} successfully`
            );
            fetchDiscounts();
        } catch (error) {
            console.error("Failed to update status", error);
            toast.error("Failed to update status");
        }
    };

    const getTargetLabel = (row: any) =>
        row.targetName || (row.targetId ? `ID: ${row.targetId}` : "All");

    const columns = [
        {
            label: "Target",
            key: "targetType",
            render: (row: any) => {
                return (
                    <div className="flex flex-col">
                        <span className="font-bold text-[#651313] uppercase text-xs">{row.targetType}</span>
                        <span
                            className="text-[11px] text-gray-700 font-medium truncate max-w-[180px]"
                            title={getTargetLabel(row)}
                        >
                            {getTargetLabel(row)}
                        </span>
                        
                    </div>
                );
            },
        },
        {
            label: "Platform",
            key: "platform",
            render: (row: any) => {
                const plat = (row.platform || "all").toLowerCase();
                if (plat === "website" || plat === "web") {
                    return (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-black">
                             Web Only
                        </span>
                    );
                }
                if (plat === "app") {
                    return (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-black">
                         App Only
                        </span>
                    );
                }
                return (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-black">
                         Both
                    </span>
                );
            },
        },
        {
            label: "User",
            key: "user",
            render: (row: any) =>
                row.user ? (
                    <div className="flex flex-col">
                        <span className="text-sm font-medium">
                            {row.user.name || row.user.fullname}
                        </span>
                        <span className="text-[10px] text-gray-400">{row.user.email}</span>
                    </div>
                ) : (
                    <span className="text-xs font-bold text-green-600 uppercase">
                        Global (All Users)
                    </span>
                ),
        },
        {
            label: "Discount",
            key: "discountValue",
            render: (row: any) => (
                <span className="font-black text-[#EB4724]">
                    {row.discountType === "percentage"
                        ? `${row.discountValue}%`
                        : `$${row.discountValue}`}
                </span>
            ),
        },
        {
            label: "Validity",
            key: "startDate",
            render: (row: any) => (
                <div className="text-[10px] text-gray-600">
                    <div>S: {row.startDate ? new Date(row.startDate).toLocaleDateString() : "N/A"}</div>
                    <div>E: {row.endDate ? new Date(row.endDate).toLocaleDateString() : "N/A"}</div>
                </div>
            ),
        },
        {
            label: "Status",
            key: "status",
            render: (row: any) => (
                <button
                    onClick={() =>
                        setStatusConfirm({
                            open: true,
                            id: row._id || row.id,
                            currentStatus: row.status,
                        })
                    }
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-colors ${
                        row.status === "active"
                            ? "bg-green-100 text-green-700 hover:bg-green-200"
                            : "bg-red-100 text-red-700 hover:bg-red-200"
                    }`}
                >
                    {row.status === "active" ? (
                        <>
                            <CheckCircleIcon className="h-3 w-3" /> Active
                        </>
                    ) : (
                        <>
                            <XCircleIcon className="h-3 w-3" /> Inactive
                        </>
                    )}
                </button>
            ),
        },
        {
            label: "Actions",
            key: "actions",
            render: (row: any) => (
                <div className="flex items-center gap-1">
                    <button
                        onClick={() => setViewingDiscount(row)}
                        className="p-1.5 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors"
                        title="View Details"
                    >
                        <EyeIcon className="h-4 w-4" />
                    </button>
                    <button
                        onClick={() => handleDelete(row._id || row.id)}
                        className="p-1.5 hover:bg-red-50 text-red-600 rounded-lg transition-colors"
                        title="Delete"
                    >
                        <TrashIcon className="h-4 w-4" />
                    </button>
                </div>
            ),
        },
    ];

    const nextStatus =
        statusConfirm.currentStatus === "active" ? "inactive" : "active";

    return (
        <div className="space-y-6">
            <DataTable
                title="All Active Discounts"
                columns={columns}
                data={discounts}
                loading={loading}
                onRefresh={fetchDiscounts}
                showAddButton={false}
            />

            <ConfirmModal
                isOpen={statusConfirm.open}
                onClose={() => setStatusConfirm({ open: false, id: "", currentStatus: "" })}
                onConfirm={confirmToggleStatus}
                title="Change Discount Status"
                message={`Are you sure you want to mark this discount as ${nextStatus}?`}
                confirmLabel={nextStatus === "active" ? "Yes, Activate" : "Yes, Deactivate"}
                confirmVariant={nextStatus === "inactive" ? "danger" : "primary"}
            />

            <Modal
                isOpen={!!viewingDiscount}
                onClose={() => setViewingDiscount(null)}
                title="Discount Details"
            >
                {viewingDiscount && (
                    <div className="space-y-4 py-2">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                                    Target Type
                                </p>
                                <p className="text-sm font-semibold text-gray-800 uppercase">
                                    {viewingDiscount.targetType}
                                </p>
                            </div>
                            <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                                    Package / Name
                                </p>
                                <p className="text-sm font-semibold text-gray-800">
                                    {getTargetLabel(viewingDiscount)}
                                </p>
                            </div>
                            <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                                    Target ID
                                </p>
                                <p className="text-sm font-semibold text-gray-800">
                                    {viewingDiscount.targetId || "All"}
                                </p>
                            </div>
                            <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                                    Discount
                                </p>
                                <p className="text-sm font-black text-[#EB4724]">
                                    {viewingDiscount.discountType === "percentage"
                                        ? `${viewingDiscount.discountValue}%`
                                        : `$${viewingDiscount.discountValue}`}
                                </p>
                            </div>
                            <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                                    Platform
                                </p>
                                <p className="text-sm font-semibold text-gray-800 capitalize">
                                    {viewingDiscount.platform || "all"}
                                </p>
                            </div>
                            <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                                    Status
                                </p>
                                <p
                                    className={`text-sm font-bold uppercase ${
                                        viewingDiscount.status === "active"
                                            ? "text-green-600"
                                            : "text-red-600"
                                    }`}
                                >
                                    {viewingDiscount.status}
                                </p>
                            </div>
                            <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 sm:col-span-2">
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                                    User
                                </p>
                                <p className="text-sm font-semibold text-gray-800">
                                    {viewingDiscount.user
                                        ? `${viewingDiscount.user.name || viewingDiscount.user.fullname} (${viewingDiscount.user.email})`
                                        : "Global (All Users)"}
                                </p>
                            </div>
                            <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                                    Start Date
                                </p>
                                <p className="text-sm font-semibold text-gray-800">
                                    {viewingDiscount.startDate
                                        ? new Date(viewingDiscount.startDate).toLocaleDateString()
                                        : "N/A"}
                                </p>
                            </div>
                            <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                                    End Date
                                </p>
                                <p className="text-sm font-semibold text-gray-800">
                                    {viewingDiscount.endDate
                                        ? new Date(viewingDiscount.endDate).toLocaleDateString()
                                        : "N/A"}
                                </p>
                            </div>
                        </div>

                        <div className="flex justify-end pt-3 border-t border-gray-100">
                            <button
                                onClick={() => setViewingDiscount(null)}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
}
