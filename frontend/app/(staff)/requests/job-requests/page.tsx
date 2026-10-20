"use client";
export const dynamic = 'force-static';

import { useEffect, useState } from "react";
import DataTable from "@/components/layout/DataTable";
import DeleteConfirmModal from "@/components/layout/DeleteConfirmModal";
import { Trash2, CheckCircle, XCircle, Clock, FileText, ExternalLink, User, Mail, Phone, Briefcase, Eye } from "lucide-react";
import { getAllApplications, updateApplicationStatus, deleteApplication } from "@/api-client/applicationApi";
import Modal from "@/components/layout/Modal";
import { getImageUrl } from "@/utils/url";

export default function JobRequestsPage() {
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<any[]>([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedApp, setSelectedApp] = useState<any>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getAllApplications();
      const data = res.data?.data || res.data || [];
      setRows(Array.isArray(data) ? data.reverse() : []);
    } catch (err) {
      console.error("Failed to load job requests", err);
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
      await updateApplicationStatus(id, status);
      if (selectedApp && (selectedApp.id === id || selectedApp._id === id)) {
        setSelectedApp({ ...selectedApp, status });
      }
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

  const handleView = (row: any) => {
    setSelectedApp(row);
    setIsViewModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!deletingId) return;
    try {
      await deleteApplication(deletingId);
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
    switch (status?.toLowerCase()) {
      case "accepted":
        return <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-[10px] font-bold flex items-center gap-1 w-fit"><CheckCircle className="w-3 h-3" /> Accepted</span>;
      case "rejected":
        return <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-[10px] font-bold flex items-center gap-1 w-fit"><XCircle className="w-3 h-3" /> Rejected</span>;
      default:
        return <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded-full text-[10px] font-bold flex items-center gap-1 w-fit"><Clock className="w-3 h-3" /> Pending</span>;
    }
  };

  const columns = [
    {
      label: "Full Name",
      key: "fullName",
      width: "180px",
      render: (r: any) => <p className="font-bold text-gray-800 flex items-center gap-1.5"><User className="w-3 h-3 text-[#EB4724]" /> {r.fullName}</p>
    },
    {
      label: "Email",
      key: "email",
      render: (r: any) => <p className="text-[11px] text-gray-600 flex items-center gap-1.5"><Mail className="w-3 h-3" /> {r.email}</p>
    },
    {
      label: "Phone",
      key: "phone",
      render: (r: any) => <p className="text-[11px] text-gray-600 flex items-center gap-1.5"><Phone className="w-3 h-3" /> {r.phone}</p>
    },
    {
      label: "Position",
      key: "position",
      width: "180px",
      render: (r: any) => (
        <div className="flex flex-col gap-0.5">
          <p className="font-semibold text-gray-700 flex items-center gap-1.5"><Briefcase className="w-3 h-3 text-[#EB4724]" /> {r.position}</p>
          {r.career && <p className="text-[10px] text-gray-400 uppercase tracking-tighter">Ref: {r.career.title}</p>}
        </div>
      )
    },
    {
      label: "Documents",
      key: "documents",
      render: (r: any) => (
        <div className="flex flex-wrap gap-2">
          {r.cvUrl && (
            <a href={getImageUrl(r.cvUrl) || "#"} target="_blank" rel="noopener noreferrer" className="p-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors flex items-center gap-1 text-[10px] font-bold shadow-sm border border-blue-100" title="View CV">
              <FileText className="w-3 h-3" /> CV
            </a>
          )}
          {r.portfolioUrl && (
            <a href={getImageUrl(r.portfolioUrl) || "#"} target="_blank" rel="noopener noreferrer" className="p-1.5 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition-colors flex items-center gap-1 text-[10px] font-bold shadow-sm border border-purple-100" title="View Portfolio">
              <ExternalLink className="w-3 h-3" /> Port.
            </a>
          )}
          {r.certificateUrl && (
            <a href={getImageUrl(r.certificateUrl) || "#"} target="_blank" rel="noopener noreferrer" className="p-1.5 bg-orange-50 text-orange-600 rounded-lg hover:bg-orange-100 transition-colors flex items-center gap-1 text-[10px] font-bold shadow-sm border border-orange-100" title="View Certificate">
              <CheckCircle className="w-3 h-3" /> Cert.
            </a>
          )}
        </div>
      )
    },
    { label: "Status", key: "status", render: (r: any) => getStatusBadge(r.status) },
    { label: "Date", key: "createdAt", render: (r: any) => new Date(r.createdAt).toLocaleDateString() },
    {
      label: "Actions",
      key: "actions",
      width: "200px",
      render: (r: any) => (
        <div className="flex gap-2">
          <button
            onClick={() => handleView(r)}
            className="p-2 rounded-lg hover:bg-blue-50 text-blue-600 transition-colors"
            title="View Details"
          >
            <Eye className="h-4 w-4" />
          </button>
          {r.status?.toLowerCase() === "pending" && (
            <>
              <button
                onClick={() => handleStatusUpdate(r.id || r._id, "accepted")}
                className="p-2 rounded-lg hover:bg-green-50 text-green-600 transition-colors"
                title="Accept Application"
              >
                <CheckCircle className="h-4 w-4" />
              </button>
              <button
                onClick={() => handleStatusUpdate(r.id || r._id, "rejected")}
                className="p-2 rounded-lg hover:bg-red-50 text-red-600 transition-colors"
                title="Reject"
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
      <DataTable title="Job Application Requests" columns={columns} data={rows} onRefresh={fetchData} loading={loading} enableLastFilter />
      <DeleteConfirmModal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} onConfirm={confirmDelete} itemName="this job application" />

      {/* View Details Modal */}
      <Modal isOpen={isViewModalOpen} onClose={() => setIsViewModalOpen(false)} title="Application Details">
        {selectedApp && (
          <div className="space-y-6 py-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-[#EB4724]/10 rounded-full flex items-center justify-center text-[#EB4724]">
                  <User className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-gray-800">{selectedApp.fullName}</h3>
                  <p className="text-sm text-gray-500">{selectedApp.email}</p>
                </div>
              </div>
              {getStatusBadge(selectedApp.status)}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Position</p>
                <p className="text-sm font-semibold text-gray-700">{selectedApp.position}</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Phone</p>
                <p className="text-sm font-semibold text-gray-700">{selectedApp.phone}</p>
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Attached Documents</p>
              <div className="grid grid-cols-1 gap-2">
                {selectedApp.cvUrl && (
                  <a href={getImageUrl(selectedApp.cvUrl) || "#"} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-xl hover:border-blue-500 hover:shadow-sm transition-all group">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-blue-500" />
                      <span className="text-sm font-medium text-gray-700">Curriculum Vitae (CV)</span>
                    </div>
                    <ExternalLink className="w-4 h-4 text-gray-300 group-hover:text-blue-500" />
                  </a>
                )}
                {selectedApp.portfolioUrl && (
                  <a href={getImageUrl(selectedApp.portfolioUrl) || "#"} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-xl hover:border-purple-500 hover:shadow-sm transition-all group">
                    <div className="flex items-center gap-3">
                      <ExternalLink className="w-5 h-5 text-purple-500" />
                      <span className="text-sm font-medium text-gray-700">Portfolio</span>
                    </div>
                    <ExternalLink className="w-4 h-4 text-gray-300 group-hover:text-purple-500" />
                  </a>
                )}
                {selectedApp.certificateUrl && (
                  <a href={getImageUrl(selectedApp.certificateUrl) || "#"} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-xl hover:border-orange-500 hover:shadow-sm transition-all group">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-orange-500" />
                      <span className="text-sm font-medium text-gray-700">Education Certificate</span>
                    </div>
                    <ExternalLink className="w-4 h-4 text-gray-300 group-hover:text-orange-500" />
                  </a>
                )}
              </div>
            </div>

            <div className="flex justify-start items-center pt-4 border-t border-gray-100">
              <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">Received on: {new Date(selectedApp.createdAt).toLocaleString()}</p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
