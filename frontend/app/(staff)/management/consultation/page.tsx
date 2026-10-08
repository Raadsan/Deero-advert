"use client";

import React, { useEffect, useState } from "react";
import DataTable from "@/components/layout/DataTable";
import DeleteConfirmModal from "@/components/layout/DeleteConfirmModal";
import { Trash2, Mail, Phone, MapPin, Briefcase, Calendar } from "lucide-react";
import { getConsultations, updateConsultationStatus, deleteConsultation } from "@/api-client/consultationApi";
import { toast } from "react-hot-toast";

const STATUS_OPTIONS = ["pending", "contacted", "completed"];

const statusStyle: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700 border border-yellow-200",
  contacted: "bg-blue-100 text-blue-700 border border-blue-200",
  completed: "bg-green-100 text-green-700 border border-green-200",
};

export default function ConsultationManagementPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [deletingName, setDeletingName] = useState("");
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getConsultations();
      setData(res.data || []);
    } catch {
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleStatusChange = async (id: number, status: string) => {
    setUpdatingId(id);
    try {
      await updateConsultationStatus(id, status);
      toast.success("Status updated");
      fetchData();
    } catch {
      toast.error("Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  };

  const confirmDelete = async () => {
    if (!deletingId) return;
    try {
      await deleteConsultation(deletingId);
      toast.success("Consultation deleted");
      fetchData();
    } catch {
      toast.error("Failed to delete");
    } finally {
      setIsDeleteModalOpen(false);
      setDeletingId(null);
    }
  };

  const columns = [
    {
      label: "#",
      key: "id",
      width: "5%",
      render: (_: any, index: number) => (
        <span className="text-gray-400 text-sm">{index + 1}</span>
      ),
    },
    {
      label: "Name",
      key: "name",
      width: "18%",
      render: (row: any) => (
        <span className="font-semibold text-gray-800 text-sm">{row.name}</span>
      ),
    },
    {
      label: "Contact",
      key: "contact",
      width: "22%",
      render: (row: any) => (
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-gray-600">
            <Mail className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
            <span className="truncate">{row.email}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-gray-600">
            <Phone className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
            <span>{row.phone}</span>
          </div>
        </div>
      ),
    },
    {
      label: "Location",
      key: "location",
      width: "12%",
      render: (row: any) => (
        <div className="flex items-center gap-1.5 text-xs text-gray-600">
          <MapPin className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
          <span>{row.location}</span>
        </div>
      ),
    },
    {
      label: "Service",
      key: "service",
      width: "18%",
      render: (row: any) => (
        <div className="flex items-center gap-1.5">
          <Briefcase className="w-3.5 h-3.5 text-[#EB4724] flex-shrink-0" />
          <span className="text-xs text-gray-700 font-medium">{row.service}</span>
        </div>
      ),
    },
    {
      label: "Date",
      key: "createdAt",
      width: "12%",
      render: (row: any) => (
        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <Calendar className="w-3.5 h-3.5 text-gray-400" />
          <span>{new Date(row.createdAt).toLocaleDateString()}</span>
        </div>
      ),
    },
    {
      label: "Status",
      key: "status",
      width: "13%",
      render: (row: any) => (
        <select
          value={row.status}
          disabled={updatingId === row.id}
          onChange={(e) => handleStatusChange(row.id, e.target.value)}
          className={`text-xs font-semibold px-2 py-1 rounded-full cursor-pointer border-none focus:outline-none focus:ring-1 focus:ring-[#EB4724] ${statusStyle[row.status] || "bg-gray-100 text-gray-600"}`}
        >
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s} className="bg-white text-gray-800">
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </option>
          ))}
        </select>
      ),
    },
    {
      label: "Actions",
      key: "actions",
      width: "80px",
      render: (row: any) => (
        <button
          className="p-2 rounded-lg hover:bg-red-50 text-red-500 transition-colors"
          onClick={() => {
            setDeletingId(row.id);
            setDeletingName(row.name);
            setIsDeleteModalOpen(true);
          }}
        >
          <Trash2 className="h-4 w-4" />
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {STATUS_OPTIONS.map((status) => {
          const count = data.filter((d) => d.status === status).length;
          const icons: Record<string, string> = { pending: "🕐", contacted: "📞", completed: "✅" };
          const colors: Record<string, string> = {
            pending: "bg-yellow-50 border-yellow-200 text-yellow-700",
            contacted: "bg-blue-50 border-blue-200 text-blue-700",
            completed: "bg-green-50 border-green-200 text-green-700",
          };
          return (
            <div key={status} className={`rounded-xl border p-4 flex items-center gap-4 ${colors[status]}`}>
              <span className="text-3xl">{icons[status]}</span>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider opacity-70">{status}</p>
                <p className="text-2xl font-bold">{count}</p>
              </div>
            </div>
          );
        })}
      </div>

      <DataTable
        title="Consultation Requests"
        columns={columns}
        data={data}
        showAddButton={false}
        onRefresh={fetchData}
        loading={loading}
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        itemName={deletingName}
      />
    </div>
  );
}
