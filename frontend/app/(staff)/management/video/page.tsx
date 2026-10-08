"use client";
export const dynamic = 'force-static';

import { useEffect, useState } from "react";
import DataTable from "@/components/layout/DataTable";
import Modal from "@/components/layout/Modal";
import DeleteConfirmModal from "@/components/layout/DeleteConfirmModal";
import { Edit, Trash2, Video, Upload, Play, X } from "lucide-react";
import {
  getAllVideos,
  createVideo,
  updateVideo,
  deleteVideo,
} from "@/api-client/videoApi";
import { getImageUrl } from "@/utils/url";

export default function AdminVideosPage() {
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingVideoId, setEditingVideoId] = useState<string | number | null>(null);
  const [deletingId, setDeletingId] = useState<string | number | null>(null);
  const [deletingTitle, setDeletingTitle] = useState("");
  
  const [form, setForm] = useState({
    title: "",
    videoFile: null as File | null,
    videoPreview: "",
    url: "", // For external links if needed, though we focus on upload
  });

  // ✅ Fetch videos from backend
  const fetchVideos = async () => {
    setLoading(true);
    try {
      const res = await getAllVideos();
      const dataArr = Array.isArray(res.data) ? res.data : (res.data?.data || []);

      setRows(
        dataArr.reverse().map((v: any) => ({
          _id: v.id || v._id,
          title: v.title,
          url: getImageUrl(v.url),
          createdAt: v.createdAt,
        }))
      );
    } catch (err) {
      console.error("Failed to load videos", err);
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  // Handle file input changes
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 50 * 1024 * 1024) {
        alert("Video size must be less than 50MB");
        return;
      }
      setForm((prev) => ({
        ...prev,
        videoFile: file,
        videoPreview: URL.createObjectURL(file),
      }));
    }
  };

  // ✅ Save video (create or update)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    formDataToSend.append("title", form.title);

    if (form.videoFile) {
      formDataToSend.append("video", form.videoFile);
    } else if (form.url) {
        formDataToSend.append("url", form.url);
    }

    try {
      if (editingVideoId) {
        await updateVideo(editingVideoId, formDataToSend);
      } else {
        await createVideo(formDataToSend);
      }

      closeModal();
      fetchVideos(); // reload
    } catch (err: any) {
      console.error("Failed to save video", err);
      alert(err.response?.data?.message || "Failed to save video");
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingVideoId(null);
    setForm({
      title: "",
      videoFile: null,
      videoPreview: "",
      url: "",
    });
  };

  // ✅ Delete video
  const handleDelete = (id: string | number, title: string) => {
    setDeletingId(id);
    setDeletingTitle(title);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!deletingId) return;
    try {
      await deleteVideo(deletingId);
      fetchVideos();
    } catch (err) {
      console.error("Failed to delete video", err);
    } finally {
      setIsDeleteModalOpen(false);
      setDeletingId(null);
      setDeletingTitle("");
    }
  };

  // ✅ Open modal for edit
  const handleEdit = (video: any) => {
    setEditingVideoId(video._id);
    setForm({
      title: video.title,
      videoFile: null,
      videoPreview: video.url,
      url: video.url,
    });
    setIsModalOpen(true);
  };

  const columns = [
    { label: "Title", key: "title", width: "240px" },
    {
      label: "Preview",
      key: "url",
      width: "180px",
      render: (r: any) => (
        <div className="relative h-16 w-28 overflow-hidden rounded-lg border border-gray-200 bg-black flex items-center justify-center group cursor-pointer"
             onClick={() => window.open(r.url, '_blank')}>
          <video src={r.url} className="h-full w-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" />
          <Play className="absolute h-6 w-6 text-white opacity-80 group-hover:scale-110 transition-transform" />
        </div>
      ),
    },
    { label: "Created At", key: "createdAt", width: "160px", render: (r: any) => new Date(r.createdAt).toLocaleDateString() },
    {
      label: "Actions",
      key: "actions",
      width: "120px",
      render: (r: any) => (
        <div className="flex gap-2">
          <button
            className="p-2 rounded-lg hover:bg-blue-50 text-blue-600 transition-colors"
            title="Edit"
            onClick={() => handleEdit(r)}
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            className="p-2 rounded-lg hover:bg-red-50 text-red-600 transition-colors"
            title="Delete"
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
        title="Video Management"
        columns={columns}
        data={rows}
        showAddButton
        onAddClick={() => setIsModalOpen(true)}
        onRefresh={fetchVideos}
        loading={loading}
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        itemName={deletingTitle}
      />

      <Modal isOpen={isModalOpen} onClose={closeModal} title={editingVideoId ? "Edit Video" : "Add Video"}>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-1">
            <label className="text-xs uppercase font-bold text-gray-500 tracking-wider">
              Video Title <span className="text-red-500">*</span>
            </label>
            <input 
              required 
              value={form.title} 
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} 
              placeholder="Enter video title"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#EB4724] focus:border-[#EB4724]" 
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs uppercase font-bold text-gray-500 tracking-wider">
              Upload Video {!editingVideoId && <span className="text-red-500">*</span>}
            </label>
            <div className="relative group">
              <div className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-lg transition-colors ${form.videoPreview ? 'border-green-300 bg-green-50' : 'border-gray-300 hover:border-[#EB4724] bg-gray-50'}`}>
                <div className="space-y-1 text-center">
                  {form.videoPreview ? (
                    <div className="relative w-full max-w-xs mx-auto">
                      <video src={form.videoPreview} className="rounded-lg shadow-sm max-h-48 w-full" controls />
                      <button 
                        type="button"
                        onClick={() => setForm(f => ({ ...f, videoFile: null, videoPreview: editingVideoId ? f.videoPreview : "" }))}
                        className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full shadow-md hover:bg-red-600 transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <Upload className="mx-auto h-12 w-12 text-gray-400 group-hover:text-[#EB4724] transition-colors" />
                      <div className="flex text-sm text-gray-600">
                        <label className="relative cursor-pointer rounded-md font-medium text-[#EB4724] hover:text-[#d33e1f] focus-within:outline-none">
                          <span>Upload a file</span>
                          <input 
                            type="file" 
                            className="sr-only" 
                            accept="video/*" 
                            onChange={handleFileChange}
                            required={!editingVideoId}
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">MP4, WebM up to 50MB</p>
                    </>
                  )}
                </div>
              </div>
            </div>
            {form.videoFile && (
              <p className="mt-2 text-xs text-green-600 flex items-center gap-1">
                <Play className="h-3 w-3" /> {form.videoFile.name} ({(form.videoFile.size / (1024 * 1024)).toFixed(2)} MB)
              </p>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 mt-6">
            <button 
              type="button" 
              onClick={closeModal} 
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={!form.title || (!editingVideoId && !form.videoFile)}
              className="px-6 py-2 text-sm font-medium text-white bg-[#651313] rounded-lg hover:bg-[#500f0f] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm flex items-center gap-2"
            >
              {editingVideoId ? "Update Video" : "Create Video"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
