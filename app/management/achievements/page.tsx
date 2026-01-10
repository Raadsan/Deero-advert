"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import DataTable from "@/components/layout/DataTable";
import Modal from "@/components/layout/Modal";
import DeleteConfirmModal from "@/components/layout/DeleteConfirmModal";
import { Edit, Trash2, Camera } from "lucide-react";
import {
  getAllAchievements,
  createAchievement,
  updateAchievement,
  deleteAchievement,
  Achievement,
} from "../../../api/achievementApi";

export default function AchievementsPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deletingName, setDeletingName] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    count: "",
    icon: null as File | null,
    iconPreview: "",
  });

  // ✅ Fetch achievements from backend
  const fetchAchievements = async () => {
    setLoading(true);
    try {
      const res = await getAllAchievements();
      // Safely access the array from the response
      const achievements = Array.isArray(res.data?.data) ? res.data.data : [];
      setData(
        achievements.map((a: Achievement) => ({
          id: a._id,
          title: a.title,
          count: a.count,
          icon: a.icon?.startsWith("/") ? a.icon : `/${a.icon}`,
        }))
      );
    } catch (err) {
      console.error("Failed to load achievements", err);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAchievements();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle file input change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        icon: file,
        iconPreview: URL.createObjectURL(file),
      }));
    }
  };

  // ✅ Create or update achievement
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Create FormData
      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title);
      formDataToSend.append("count", formData.count);

      // Add icon file if present
      if (formData.icon) {
        formDataToSend.append("icon", formData.icon);
      }

      if (editingId) {
        // Icon is optional for update (only update if new file is selected)
        await updateAchievement(editingId, formDataToSend);
      } else {
        // Icon is required for create
        if (!formData.icon) {
          alert("Icon is required");
          return;
        }
        await createAchievement(formDataToSend);
      }

      setIsModalOpen(false);
      setEditingId(null);
      setFormData({ title: "", count: "", icon: null, iconPreview: "" });
      fetchAchievements(); // reload table
    } catch (err: any) {
      console.error("Failed to save achievement", err);
      alert(err.response?.data?.message || "Failed to save achievement");
    }
  };

  // ✅ Delete achievement
  const handleDelete = (id: string, title: string) => {
    setDeletingId(id);
    setDeletingName(title);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!deletingId) return;
    try {
      await deleteAchievement(deletingId);
      fetchAchievements();
    } catch (err) {
      console.error("Failed to delete achievement", err);
    } finally {
      setIsDeleteModalOpen(false);
      setDeletingId(null);
      setDeletingName("");
    }
  };

  // ✅ Edit achievement
  const handleEdit = (achievement: any) => {
    setEditingId(achievement.id);
    const iconUrl = achievement.icon.startsWith("/") ? achievement.icon : `/${achievement.icon}`;
    setFormData({
      title: achievement.title,
      count: achievement.count.toString(),
      icon: null,
      iconPreview: iconUrl,
    });
    setIsModalOpen(true);
  };

  const columns = [
    {
      label: "Icon",
      key: "icon",
      render: (row: any) => (
        <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-lg bg-gray-50 p-2 border border-gray-100">
          <Image
            src={row.icon}
            alt={row.title}
            width={40}
            height={40}
            className="h-full w-full object-contain"
          />
        </div>
      ),
    },
    { label: "Title", key: "title" },
    {
      label: "Count",
      key: "count",
      render: (row: any) => <span className="font-bold text-[#651313]">{row.count}</span>,
    },
    {
      label: "Actions",
      key: "actions",
      width: "150px",
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
            onClick={() => handleDelete(row.id, row.title)}
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
        title="Achievements"
        columns={columns}
        data={data}
        showAddButton
        onAddClick={() => setIsModalOpen(true)}
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
          setFormData({ title: "", count: "", icon: null, iconPreview: "" });
        }}
        title={editingId ? "Edit Achievement" : "Add Achievement"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-0.5">
              <label className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                required
                value={formData.title}
                onChange={handleInputChange}
                className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#EB4724] focus:border-[#EB4724]"
              />
            </div>
            <div className="space-y-0.5">
              <label className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">
                Count <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="count"
                required
                value={formData.count}
                onChange={handleInputChange}
                className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#EB4724] focus:border-[#EB4724]"
              />
            </div>
          </div>

          {/* Icon Upload */}
          <div className="space-y-0.5">
            <label className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">
              Icon {!editingId && <span className="text-red-500">*</span>}
            </label>
            <div className="flex items-center gap-3">
              <div className="relative h-20 w-20 rounded-lg bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors group overflow-hidden">
                {formData.iconPreview ? (
                  <img
                    src={formData.iconPreview}
                    alt="Icon Preview"
                    className="h-full w-full object-cover"
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
                  {formData.icon
                    ? formData.icon.name
                    : editingId
                      ? "Click to change icon (required)"
                      : "Click to upload icon"}
                </p>
                {formData.icon && (
                  <button
                    type="button"
                    onClick={() => {
                      setFormData((prev) => ({
                        ...prev,
                        icon: null,
                        iconPreview: editingId ? prev.iconPreview : "",
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

          <div className="flex justify-end gap-2 pt-3 border-t border-gray-100 mt-4">
            <button
              type="button"
              onClick={() => {
                setIsModalOpen(false);
                setEditingId(null);
                setFormData({ title: "", count: "", icon: null, iconPreview: "" });
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
    </div>
  );
}
