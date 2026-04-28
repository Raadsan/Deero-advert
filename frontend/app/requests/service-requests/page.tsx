"use client";
export const dynamic = 'force-static';

import { useEffect, useState } from "react";
import DataTable from "@/components/layout/DataTable";
import DeleteConfirmModal from "@/components/layout/DeleteConfirmModal";
import { Trash2, CheckCircle, XCircle, Clock } from "lucide-react";
import { getAllTransactions, updateTransaction, deleteTransaction } from "@/api-client/transactionApi";

export default function ServiceRequestsPage() {
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<any[]>([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getAllTransactions();
      const allTransactions = res.data?.transactions || [];
      const serviceRequests = allTransactions
        .filter((t: any) => t.type === "service_payment")
        .reverse();
      setRows(serviceRequests);
    } catch (err) {
      console.error("Failed to load service requests", err);
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleStatusUpdate = async (id: string, status: string) => {
    try {
      await updateTransaction(id, { status });
      fetchData();
    } catch (err) {
      console.error("Failed to update status", err);
      alert("Failed to update status");
    }
  };

  const handleDelete = (row: any) => {
    setDeletingId(row.id || row._id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!deletingId) return;
    try {
      await deleteTransaction(deletingId);
      fetchData();
    } catch (err) {
      console.error("Failed to delete request", err);
      alert("Failed to delete request");
    } finally {
      setIsDeleteModalOpen(false);
      setDeletingId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Completed</span>;
      case "failed":
        return <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold flex items-center gap-1"><XCircle className="w-3 h-3" /> Failed</span>;
      default:
        return <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-bold flex items-center gap-1"><Clock className="w-3 h-3" /> Pending</span>;
    }
  };

  const columns = [
    { label: "Service", key: "service", width: "200px", render: (r: any) => r.service?.serviceTitle || r.description || "N/A" },
    { 
        label: "User", 
        key: "user", 
        render: (r: any) => (
            <div>
                <p className="font-bold text-gray-800">{r.user?.fullname || "Unknown"}</p>
                <p className="text-[10px] text-gray-500">{r.user?.email || ""}</p>
            </div>
        )
    },
    { label: "Amount", key: "amount", render: (r: any) => `$${r.amount} ${r.currency || "USD"}` },
    { label: "Payment", key: "paymentMethod" },
    { label: "Status", key: "status", render: (r: any) => getStatusBadge(r.status) },
    { label: "Date", key: "createdAt", render: (r: any) => new Date(r.createdAt).toLocaleDateString() },
    {
      label: "Actions",
      key: "actions",
      width: "180px",
      render: (r: any) => (
        <div className="flex gap-2">
          {r.status === "pending" && (
            <>
              <button
                onClick={() => handleStatusUpdate(r.id || r._id, "completed")}
                className="p-2 rounded-lg hover:bg-green-50 text-green-600 transition-colors"
                title="Mark Completed"
              >
                <CheckCircle className="h-4 w-4" />
              </button>
              <button
                onClick={() => handleStatusUpdate(r.id || r._id, "failed")}
                className="p-2 rounded-lg hover:bg-red-50 text-red-600 transition-colors"
                title="Mark Failed"
              >
                <XCircle className="h-4 w-4" />
              </button>
            </>
          )}
          <button
            onClick={() => handleDelete(r)}
            className="p-2 rounded-lg hover:bg-red-50 text-red-600 transition-colors"
            title="Delete"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <DataTable title="Service Requests" columns={columns} data={rows} onRefresh={fetchData} loading={loading} />
      <DeleteConfirmModal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} onConfirm={confirmDelete} itemName="this service request" />
    </div>
  );
}
