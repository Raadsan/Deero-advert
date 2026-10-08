"use client";

import { useEffect, useState } from "react";
import DataTable from "@/components/layout/DataTable";
import Modal from "@/components/layout/Modal";
import DeleteConfirmModal from "@/components/layout/DeleteConfirmModal";
import { Edit, Trash2, Camera, Plus, X } from "lucide-react";
import Image from "next/image";
import {
  getAllCaseStudies,
  createCaseStudy,
  updateCaseStudy,
  deleteCaseStudy,
} from "@/api-client/caseStudyApi";
import { getImageUrl } from "@/utils/url";
import { compressImage } from "@/utils/compressImage";

export default function AdminCaseStudyPage() {
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deletingTitle, setDeletingTitle] = useState("");
  
  const [form, setForm] = useState({
    title: "",
    category: "",
    client: "",
    duration: "",
    challenge: "",
    solution: "",
    result: "",
    services: [] as string[],
    newService: "",
    image: null as File | null,
    imagePreview: "",
    author: "DEERO ADVERT",
    publishedDate: new Date().toISOString().split('T')[0],
  });

  // ✅ Fetch case studies from backend
  const fetchCaseStudies = async () => {
    setLoading(true);
    try {
      const res = await getAllCaseStudies();
      const dataArr = Array.isArray(res.data) ? res.data : (res.data?.data || []);

      setRows(
        dataArr.reverse().map((cs: any) => ({
          ...cs,
          _id: cs.id || cs._id,
          displayImage: getImageUrl(cs.image),
        }))
      );
    } catch (err) {
      console.error("Failed to load case studies", err);
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCaseStudies();
  }, []);

  // Handle file input changes
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const compressed = await compressImage(file);
      setForm((prev) => ({
        ...prev,
        image: compressed,
        imagePreview: URL.createObjectURL(compressed),
      }));
    }
  };

  const addService = () => {
    if (form.newService.trim()) {
      setForm(prev => ({
        ...prev,
        services: [...prev.services, prev.newService.trim()],
        newService: ""
      }));
    }
  };

  const removeService = (index: number) => {
    setForm(prev => ({
      ...prev,
      services: prev.services.filter((_, i) => i !== index)
    }));
  };

  // ✅ Save case study (create or update)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    formDataToSend.append("title", form.title);
    formDataToSend.append("category", form.category);
    formDataToSend.append("client", form.client);
    formDataToSend.append("duration", form.duration);
    formDataToSend.append("challenge", form.challenge);
    formDataToSend.append("solution", form.solution);
    formDataToSend.append("result", form.result);
    formDataToSend.append("services", JSON.stringify(form.services));
    formDataToSend.append("author", form.author);
    formDataToSend.append("publishedDate", form.publishedDate);

    if (form.image) {
      formDataToSend.append("image", form.image);
    }

    try {
      if (editingId) {
        await updateCaseStudy(editingId, formDataToSend);
      } else {
        await createCaseStudy(formDataToSend);
      }

      closeModal();
      fetchCaseStudies();
    } catch (err: any) {
      console.error("Failed to save case study", err);
      alert(err.response?.data?.message || "Failed to save case study");
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setForm({
      title: "",
      category: "",
      client: "",
      duration: "",
      challenge: "",
      solution: "",
      result: "",
      services: [],
      newService: "",
      image: null,
      imagePreview: "",
      author: "DEERO ADVERT",
      publishedDate: new Date().toISOString().split('T')[0],
    });
  };

  // ✅ Delete case study
  const handleDelete = (id: string, title: string) => {
    setDeletingId(id);
    setDeletingTitle(title);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!deletingId) return;
    try {
      await deleteCaseStudy(deletingId);
      fetchCaseStudies();
    } catch (err) {
      console.error("Failed to delete case study", err);
    } finally {
      setIsDeleteModalOpen(false);
      setDeletingId(null);
      setDeletingTitle("");
    }
  };

  // ✅ Open modal for edit
  const handleEdit = (cs: any) => {
    setEditingId(cs._id);
    setForm({
      title: cs.title,
      category: cs.category,
      client: cs.client,
      duration: cs.duration || "",
      challenge: cs.challenge,
      solution: cs.solution,
      result: cs.result,
      services: Array.isArray(cs.services) ? cs.services : (typeof cs.services === 'string' ? JSON.parse(cs.services) : []),
      newService: "",
      image: null,
      imagePreview: cs.displayImage,
      author: cs.author || "DEERO ADVERT",
      publishedDate: cs.publishedDate ? cs.publishedDate.slice(0, 10) : new Date().toISOString().split('T')[0],
    });
    setIsModalOpen(true);
  };

  const columns = [
    { label: "Title", key: "title", width: "200px" },
    { label: "Category", key: "category", width: "150px" },
    { label: "Client", key: "client", width: "150px" },
    {
      label: "Image",
      key: "displayImage",
      width: "100px",
      render: (r: any) =>
        r.displayImage ? (
          <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg border border-gray-100 bg-gray-50">
            <Image
              src={r.displayImage}
              alt="cs"
              width={48}
              height={48}
              unoptimized
              className="h-full w-full object-cover"
            />
          </div>
        ) : (
          <span className="text-gray-400">-</span>
        ),
    },
    {
      label: "Actions",
      key: "actions",
      width: "120px",
      render: (r: any) => (
        <div className="flex gap-2">
          <button
            className="p-2 rounded-lg hover:bg-blue-50 text-blue-600 transition-colors"
            onClick={() => handleEdit(r)}
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            className="p-2 rounded-lg hover:bg-red-50 text-red-600 transition-colors"
            onClick={() => handleDelete(r._id, r.title)}
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
        title="Case Studies"
        columns={columns}
        data={rows}
        showAddButton
        onAddClick={() => setIsModalOpen(true)}
        onRefresh={fetchCaseStudies}
        loading={loading}
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        itemName={deletingTitle}
      />

      <Modal isOpen={isModalOpen} onClose={closeModal} title={editingId ? "Edit Case Study" : "Add Case Study"} maxWidth="max-w-4xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Title</label>
                <input required value={form.title} onChange={(e) => setForm(f => ({ ...f, title: e.target.value }))} className="w-full px-4 py-2 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#EB4724] outline-none" placeholder="e.g. Digital Transformation for Golis" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Category</label>
                  <input required value={form.category} onChange={(e) => setForm(f => ({ ...f, category: e.target.value }))} className="w-full px-4 py-2 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#EB4724] outline-none" placeholder="Web Dev" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Client</label>
                  <input required value={form.client} onChange={(e) => setForm(f => ({ ...f, client: e.target.value }))} className="w-full px-4 py-2 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#EB4724] outline-none" placeholder="Golis Telecom" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Duration</label>
                  <input value={form.duration} onChange={(e) => setForm(f => ({ ...f, duration: e.target.value }))} className="w-full px-4 py-2 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#EB4724] outline-none" placeholder="6 Months" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Published Date</label>
                  <input type="date" value={form.publishedDate} onChange={(e) => setForm(f => ({ ...f, publishedDate: e.target.value }))} className="w-full px-4 py-2 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#EB4724] outline-none" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Featured Image</label>
                <div className="relative h-48 w-full rounded-2xl bg-gray-50 border-2 border-dashed border-gray-200 flex items-center justify-center cursor-pointer hover:bg-gray-100 transition-all group overflow-hidden">
                  {form.imagePreview ? (
                    <img src={form.imagePreview} alt="Preview" className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                      <Camera className="h-8 w-8 text-gray-300 group-hover:text-[#EB4724]" />
                      <span className="text-xs text-gray-400">Click to upload</span>
                    </div>
                  )}
                  <input type="file" accept="image/*" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Challenge</label>
                <textarea required value={form.challenge} onChange={(e) => setForm(f => ({ ...f, challenge: e.target.value }))} className="w-full px-4 py-2 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#EB4724] outline-none h-24 resize-none" placeholder="Describe the problem..." />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Solution</label>
                <textarea required value={form.solution} onChange={(e) => setForm(f => ({ ...f, solution: e.target.value }))} className="w-full px-4 py-2 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#EB4724] outline-none h-24 resize-none" placeholder="Describe your approach..." />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Result</label>
                <textarea required value={form.result} onChange={(e) => setForm(f => ({ ...f, result: e.target.value }))} className="w-full px-4 py-2 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#EB4724] outline-none h-24 resize-none" placeholder="Describe the outcome..." />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Services Delivered</label>
            <div className="flex gap-2">
              <input value={form.newService} onChange={(e) => setForm(f => ({ ...f, newService: e.target.value }))} className="flex-grow px-4 py-2 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#EB4724] outline-none" placeholder="e.g. UI/UX Design" />
              <button type="button" onClick={addService} className="bg-[#EB4724] text-white p-2 rounded-xl hover:bg-[#d43d1d] transition-colors">
                <Plus className="h-5 w-5" />
              </button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {form.services.map((s, i) => (
                <span key={i} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-2 border border-gray-200">
                  {s}
                  <button type="button" onClick={() => removeService(i)} className="text-gray-400 hover:text-red-500">
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
            <button type="button" onClick={closeModal} className="px-6 py-2 text-sm font-bold text-gray-500 hover:bg-gray-50 rounded-xl transition-colors">Cancel</button>
            <button type="submit" className="px-8 py-2 text-sm font-bold text-white bg-[#651313] hover:bg-[#500f0f] rounded-xl shadow-lg transition-colors">
              {editingId ? "Update Case Study" : "Create Case Study"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
