"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import DataTable from "@/components/admin/DataTable";
import Modal from "@/components/admin/Modal";
import { Pencil, Trash2, Camera } from "lucide-react";
import {
  getAllAchievements,
  createAchievement,
  updateAchievement,
  deleteAchievement,
} from "../../../api/achievementApi";

export default function AchievementsPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    count: "",
    icon: "", // URL for image
  });

  // ✅ Fetch achievements from backend
  const fetchAchievements = async () => {
    setLoading(true);
    try {
      const res = await getAllAchievements();
      const achievements = Array.isArray(res.data.data) ? res.data.data : res.data;
      setData(
        achievements.map((a: any) => ({
          id: a._id,
          title: a.title,
          count: a.count,
          icon: a.icon.startsWith("/") ? a.icon : `/${a.icon}`,
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

  // ✅ Create or update achievement
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        title: formData.title,
        count: Number(formData.count),
        icon: formData.icon,
      };
      if (editingId) {
        await updateAchievement(editingId, payload);
      } else {
        await createAchievement(payload);
      }
      setIsModalOpen(false);
      setEditingId(null);
      setFormData({ title: "", count: "", icon: "" });
      fetchAchievements(); // reload table
    } catch (err) {
      console.error("Failed to save achievement", err);
    }
  };

  // ✅ Delete achievement
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this achievement?")) return;
    try {
      await deleteAchievement(id);
      fetchAchievements();
    } catch (err) {
      console.error("Failed to delete achievement", err);
    }
  };

  // ✅ Edit achievement
  const handleEdit = (achievement: any) => {
    setEditingId(achievement.id);
    setFormData({
      title: achievement.title,
      count: achievement.count.toString(),
      icon: achievement.icon,
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
        title="Achievements"
        columns={columns}
        data={data}
        showAddButton
        onAddClick={() => setIsModalOpen(true)}
        loading={loading}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditingId(null); }}
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

          <div className="space-y-0.5">
            <label className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">
              Icon URL
            </label>
            <input
              type="text"
              name="icon"
              value={formData.icon}
              onChange={handleInputChange}
              placeholder="https://example.com/icon.png"
              className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#EB4724] focus:border-[#EB4724]"
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
