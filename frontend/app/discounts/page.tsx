"use client";

import { useState, useEffect } from "react";
import DataTable from "@/components/layout/DataTable";
import { getAllDiscounts, deleteDiscount, updateDiscountStatus } from "@/api-client/discountApi";
import { TrashIcon, CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";
import toast from 'react-hot-toast';

export default function DiscountManagementPage() {
    const [discounts, setDiscounts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

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

    const handleToggleStatus = async (id: string, currentStatus: string) => {
        try {
            const newStatus = currentStatus === "active" ? "inactive" : "active";
            await updateDiscountStatus(id, newStatus);
            toast.success(`Discount ${newStatus === "active" ? "activated" : "deactivated"} successfully`);
            fetchDiscounts();
        } catch (error) {
            console.error("Failed to update status", error);
            toast.error("Failed to update status");
        }
    };

    const columns = [
        { 
            label: "Target", 
            key: "targetType",
            render: (row: any) => (
                <div className="flex flex-col">
                    <span className="font-bold text-[#651313] uppercase text-xs">{row.targetType}</span>
                    <span className="text-[10px] text-gray-500 truncate max-w-[150px]" title={row.targetId}>ID: {row.targetId}</span>
                </div>
            )
        },
        { 
            label: "User", 
            key: "user",
            render: (row: any) => row.user ? (
                <div className="flex flex-col">
                    <span className="text-sm font-medium">{row.user.fullname}</span>
                    <span className="text-[10px] text-gray-400">{row.user.email}</span>
                </div>
            ) : <span className="text-xs font-bold text-green-600 uppercase">Global (All Users)</span>
        },
        { 
            label: "Discount", 
            key: "discountValue",
            render: (row: any) => (
                <span className="font-black text-[#EB4724]">
                    {row.discountType === "percentage" ? `${row.discountValue}%` : `$${row.discountValue}`}
                </span>
            )
        },
        { 
            label: "Validity", 
            key: "startDate",
            render: (row: any) => (
                <div className="text-[10px] text-gray-600">
                    <div>S: {row.startDate ? new Date(row.startDate).toLocaleDateString() : "N/A"}</div>
                    <div>E: {row.endDate ? new Date(row.endDate).toLocaleDateString() : "N/A"}</div>
                </div>
            )
        },
        { 
            label: "Status", 
            key: "status", 
            render: (row: any) => (
                <button 
                    onClick={() => handleToggleStatus(row._id || row.id, row.status)}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-colors ${
                        row.status === "active" 
                        ? "bg-green-100 text-green-700 hover:bg-green-200" 
                        : "bg-red-100 text-red-700 hover:bg-red-200"
                    }`}
                >
                    {row.status === "active" ? (
                        <><CheckCircleIcon className="h-3 w-3" /> Active</>
                    ) : (
                        <><XCircleIcon className="h-3 w-3" /> Inactive</>
                    )}
                </button>
            )
        },
        {
            label: "Actions",
            key: "actions",
            render: (row: any) => (
                <button
                    onClick={() => handleDelete(row._id || row.id)}
                    className="p-1.5 hover:bg-red-50 text-red-600 rounded-lg transition-colors"
                    title="Delete"
                >
                    <TrashIcon className="h-4 w-4" />
                </button>
            ),
        },
    ];

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
        </div>
    );
}
