"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import DataTable from "@/components/admin/DataTable";
import Modal from "@/components/admin/Modal";
import { Pencil, Trash2, Camera } from "lucide-react";
import {
  getAllTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
} from "../../../api/testmonialApi";

export default function TestimonialsPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    clientName: "",
    clientTitle: "",
    clientImage: "",
    message: "",
  });

  // ✅ Fetch testimonials from backend
  const fetchTestimonials = async () => {
    setLoading(true);
    try {
      const res = await getAllTestimonials();
      const testimonials = Array.isArray(res.data.data) ? res.data.data : res.data;
      setData(
        testimonials.map((t: any) => ({
          id: t._id,
          clientName: t.clientName,
          clientTitle: t.clientTitle,
          clientImage: t.clientImage.startsWith("/")
            ? t.clientImage
            : `/${t.clientImage}`,
          message: t.message,
        }))
      );
    } catch (err) {
      console.error("Failed to load testimonials", err);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Add or update testimonial
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { ...formData };
    try {
      if (editingId) {
        await updateTestimonial(editingId, payload);
      } else {
        await createTestimonial(payload);
      }
      setIsModalOpen(false);
      setEditingId(null);
      setFormData({ clientName: "", clientTitle: "", clientImage: "", message: "" });
      fetchTestimonials(); // reload table
    } catch (err) {
      console.error("Failed to save testimonial", err);
    }
  };

  // ✅ Delete testimonial
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this testimonial?")) return;
    try {
      await deleteTestimonial(id);
      fetchTestimonials();
    } catch (err) {
      console.error("Failed to delete testimonial", err);
    }
  };

  // ✅ Edit testimonial
  const handleEdit = (testimonial: any) => {
    setEditingId(testimonial.id);
    setFormData({
      clientName: testimonial.clientName,
      clientTitle: testimonial.clientTitle,
      clientImage: testimonial.clientImage,
      message: testimonial.message,
    });
    setIsModalOpen(true);
  };

  const columns = [
    {
      label: "Client Image",
      key: "clientImage",
      render: (row: any) => (
        <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-full border border-gray-100 bg-gray-50">
          <Image
            src={row.clientImage || "/placeholder-user.jpg"}
            alt={row.clientName}
            width={48}
            height={48}
            className="h-full w-full object-cover"
          />
        </div>
      ),
    },
    { label: "Client Name", key: "clientName" },
    { label: "Client Title", key: "clientTitle" },
    {
      label: "Message",
      key: "message",
      width: "40%",
      render: (row: any) => <p className="line-clamp-2 text-gray-600 italic">"{row.message}"</p>,
    },
    {
      label: "Actions",
      key: "actions",
      width: "100px",
      render: (row: any) => (
        <div className="flex gap-2">
          <button
            className="p-2 rounded-lg hover:bg-orange-50 text-[#EB4724] transition-colors"
            title="Edit"
            onClick={() => handleEdit(row)}
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button
            className="p-2 rounded-lg hover:bg-red-50 text-red-500 transition-colors"
            title="Delete"
            onClick={() => handleDelete(row.id)}
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <DataTable
        title="Testimonials"
        columns={columns}
        data={data}
        showAddButton
        onAddClick={() => setIsModalOpen(true)}
        loading={loading}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditingId(null); }}
        title={editingId ? "Edit Testimonial" : "Add New Testimonial"}
      >
        <form onSubmit={handleSubmit} className="space-y-2">
          {/* Image input */}
          <div className="flex flex-col items-center justify-center mb-3">
            <div className="relative h-16 w-16 rounded-full bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors group">
              {formData.clientImage ? (
                <img src={formData.clientImage} alt="Preview" className="h-full w-full rounded-full object-cover" />
              ) : (
                <Camera className="h-5 w-5 text-gray-400 group-hover:text-[#EB4724] transition-colors" />
              )}
              <input
                type="text"
                name="clientImage"
                placeholder="Image URL..."
                className="absolute inset-0 opacity-0 cursor-pointer"
                readOnly
              />
            </div>
            <p className="text-[10px] text-gray-500 mt-1">Upload Photo</p>
            <input
              type="text"
              name="clientImage"
              value={formData.clientImage}
              onChange={handleInputChange}
              placeholder="Image URL..."
              className="mt-1 w-2/3 text-[10px] border border-gray-200 rounded px-2 py-0.5 focus:outline-none focus:border-[#EB4724]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-0.5">
              <label className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">
                Client Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="clientName"
                required
                value={formData.clientName}
                onChange={handleInputChange}
                className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#EB4724] focus:border-[#EB4724]"
              />
            </div>
            <div className="space-y-0.5">
              <label className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">
                Client Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="clientTitle"
                required
                value={formData.clientTitle}
                onChange={handleInputChange}
                className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#EB4724] focus:border-[#EB4724]"
              />
            </div>
          </div>

          <div className="space-y-0.5">
            <label className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">
              Message <span className="text-red-500">*</span>
            </label>
            <textarea
              name="message"
              required
              rows={3}
              value={formData.message}
              onChange={handleInputChange}
              className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#EB4724] focus:border-[#EB4724] resize-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-gray-100 mt-4">
            <button
              type="button"
              onClick={() => { setIsModalOpen(false); setEditingId(null); }}
              className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-3 py-1.5 text-xs font-medium text-white bg-[#651313] rounded-lg hover:bg-[#500f0f]"
            >
              {editingId ? "Update" : "Save"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
