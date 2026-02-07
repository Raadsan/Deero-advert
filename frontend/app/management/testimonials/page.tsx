"use client";
export const dynamic = 'force-static';

import React, { useEffect, useState } from "react";
import Image from "next/image";
import DataTable from "@/components/layout/DataTable";
import Modal from "@/components/layout/Modal";
import DeleteConfirmModal from "@/components/layout/DeleteConfirmModal";
import { Edit, Trash2, Camera, Star as StarIcon } from "lucide-react";
import {
  getAllTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
} from "@/api-client/testimonialApi";
import { getImageUrl } from "@/utils/url";

export default function TestimonialsPage() {
  const [data, setData] = useState<any[]>([]);
  const truncate = (s: string, n = 120) => (s?.length > n ? s.slice(0, n) + "..." : s);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deletingName, setDeletingName] = useState("");
  const [formData, setFormData] = useState({
    clientName: "",
    clientTitle: "",
    clientImage: null as File | null,
    clientImagePreview: "",
    message: "",
    rating: 5,
  });

  // ✅ Fetch testimonials from backend
  const fetchTestimonials = async () => {
    setLoading(true);
    try {
      const res = await getAllTestimonials();
      const items = Array.isArray(res) ? res : [];

      setData(
        items.reverse().map((t: any) => ({
          id: t._id,
          clientName: t.clientName,
          clientTitle: t.clientTitle,
          clientImage: getImageUrl(t.clientImage),
          message: t.message,
          rating: t.rating || 5,
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

  // Handle file input change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Add file size check (50MB)
      if (file.size > 50 * 1024 * 1024) {
        alert("File is too large. Please select an image smaller than 50MB.");
        e.target.value = ""; // clear input
        return;
      }
      setFormData((prev) => ({
        ...prev,
        clientImage: file,
        clientImagePreview: URL.createObjectURL(file),
      }));
    }
  };

  // ✅ Add or update testimonial
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Create FormData
    const formDataToSend = new FormData();
    formDataToSend.append("clientName", formData.clientName);
    formDataToSend.append("clientTitle", formData.clientTitle);
    formDataToSend.append("message", formData.message);
    formDataToSend.append("rating", formData.rating.toString());

    // Add client image file if present
    if (formData.clientImage) {
      formDataToSend.append("clientImage", formData.clientImage);
    }

    try {
      if (editingId) {
        // Client image is optional for update (only update if new file is selected)
        await updateTestimonial(editingId, formDataToSend);
      } else {
        // Client image is required for create
        if (!formData.clientImage) {
          alert("Client image is required");
          return;
        }
        await createTestimonial(formDataToSend);
      }
      setIsModalOpen(false);
      setEditingId(null);
      setFormData({
        clientName: "",
        clientTitle: "",
        clientImage: null,
        clientImagePreview: "",
        message: "",
        rating: 5,
      });
      fetchTestimonials(); // reload table
    } catch (err: any) {
      console.error("Failed to save testimonial", err);
      alert(err.response?.data?.message || "Failed to save testimonial");
    }
  };

  // ✅ Delete testimonial
  const handleDelete = (id: string, name: string) => {
    setDeletingId(id);
    setDeletingName(name);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!deletingId) return;
    try {
      await deleteTestimonial(deletingId);
      fetchTestimonials();
    } catch (err) {
      console.error("Failed to delete testimonial", err);
    } finally {
      setIsDeleteModalOpen(false);
      setDeletingId(null);
      setDeletingName("");
    }
  };

  // ✅ Edit testimonial
  const handleEdit = (testimonial: any) => {
    setEditingId(testimonial.id);
    const imageUrl = testimonial.clientImage || "";
    setFormData({
      clientName: testimonial.clientName,
      clientTitle: testimonial.clientTitle,
      clientImage: null,
      clientImagePreview: imageUrl,
      message: testimonial.message,
      rating: testimonial.rating || 5,
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
            unoptimized
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
      render: (row: any) => <p className="text-gray-600 italic">"{truncate(row.message, 150)}"</p>,
    },
    {
      label: "Rating",
      key: "rating",
      render: (row: any) => (
        <div className="flex gap-1">
          {[...Array(5)].map((_, i) => (
            <StarIcon
              key={i}
              className={`h-4 w-4 ${i < row.rating ? "text-[#EB4724] fill-[#EB4724]" : "text-gray-300 fill-gray-300"
                }`}
            />
          ))}
        </div>
      ),
    },
    {
      label: "Actions",
      key: "actions",
      width: "100px",
      render: (row: any) => (
        <div className="flex gap-2">
          <button
            className="p-2 rounded-lg hover:bg-blue-50 text-blue-600 transition-colors"
            title="Edit"
            onClick={() => handleEdit(row)}
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            className="p-2 rounded-lg hover:bg-red-50 text-red-600 transition-colors"
            title="Delete"
            onClick={() => handleDelete(row.id, row.clientName)}
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
        onRefresh={fetchTestimonials}
        loading={loading}
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        itemName={deletingName}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingId(null);
          setFormData({
            clientName: "",
            clientTitle: "",
            clientImage: null,
            clientImagePreview: "",
            message: "",
            rating: 5,
          });
        }}
        title={editingId ? "Edit Testimonial" : "Add New Testimonial"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Client Image Upload */}
          <div className="space-y-0.5">
            <label className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">
              Client Image {!editingId && <span className="text-red-500">*</span>}
            </label>
            <div className="flex items-center gap-3">
              <div className="relative h-20 w-20 rounded-full bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors group overflow-hidden">
                {formData.clientImagePreview ? (
                  <img
                    src={formData.clientImagePreview}
                    alt="Client Preview"
                    className="h-full w-full rounded-full object-cover"
                  />
                ) : (
                  <Camera className="h-6 w-6 text-gray-400 group-hover:text-[#EB4724] transition-colors" />
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-500">
                  {formData.clientImage
                    ? formData.clientImage.name
                    : editingId
                      ? "Click to change image (required)"
                      : "Click to upload client image"}
                </p>
                {formData.clientImage && (
                  <button
                    type="button"
                    onClick={() => {
                      setFormData((prev) => ({
                        ...prev,
                        clientImage: null,
                        clientImagePreview: editingId ? prev.clientImagePreview : "",
                      }));
                    }}
                    className="text-xs text-red-500 hover:text-red-700 mt-1"
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
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

          <div className="space-y-0.5">
            <label className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">
              Rating <span className="text-red-500">*</span>
            </label>
            <select
              name="rating"
              required
              value={formData.rating}
              onChange={(e) => setFormData(prev => ({ ...prev, rating: parseInt(e.target.value) }))}
              className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#EB4724] focus:border-[#EB4724]"
            >
              {[1, 2, 3, 4, 5].map((num) => (
                <option key={num} value={num}>
                  {num} Star{num > 1 ? "s" : ""}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-gray-100 mt-4">
            <button
              type="button"
              onClick={() => {
                setIsModalOpen(false);
                setEditingId(null);
                setFormData({
                  clientName: "",
                  clientTitle: "",
                  clientImage: null,
                  clientImagePreview: "",
                  message: "",
                  rating: 5,
                });
              }}
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
    </div >
  );
}

