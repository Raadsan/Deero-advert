"use client";
export const dynamic = 'force-static';

import { useEffect, useState } from "react";
import DataTable from "@/components/layout/DataTable";
import Modal from "@/components/layout/Modal";
import DeleteConfirmModal from "@/components/layout/DeleteConfirmModal";
import { Edit, Trash2, Camera } from "lucide-react";
import Image from "next/image";
import {
  getAllBlogs,
  createBlog,
  updateBlog,
  deleteBlog,
} from "@/api-client/blogsApi";
import { getImageUrl } from "@/utils/url";

export default function AdminBlogsPage() {
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingBlogId, setEditingBlogId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deletingTitle, setDeletingTitle] = useState("");
  const [form, setForm] = useState({
    title: "",
    slug: "",
    content: "",
    author: "",
    featuredImage: null as File | null,
    featuredImagePreview: "",
    publishedDate: "",
  });

  // ✅ Fetch blogs from backend
  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const res = await getAllBlogs();
      const dataArr = Array.isArray(res.data) ? res.data : (res.data?.data || []);

      setRows(
        dataArr.reverse().map((b: any) => ({
          _id: b._id,
          title: b.title,
          slug: b.slug,
          content: b.content,
          author: b.author, // string
          featuredImage: getImageUrl(b.featured_image || b.featuredImage),
          publishedDate: b.published_date || b.publishedDate || null,
        }))
      );
    } catch (err) {
      console.error("Failed to load blogs", err);
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const truncate = (s: string, n = 100) => (s?.length > n ? s.slice(0, n) + "..." : s);

  // Handle file input changes
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 50 * 1024 * 1024) {
        alert("File is too large. Please select an image smaller than 50MB.");
        e.target.value = ""; // clear input
        return;
      }
      setForm((prev) => ({
        ...prev,
        featuredImage: file,
        featuredImagePreview: URL.createObjectURL(file),
      }));
    }
  };

  // ✅ Save blog (create or update)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Create FormData
    const formDataToSend = new FormData();
    formDataToSend.append("title", form.title);
    formDataToSend.append(
      "slug",
      form.slug || form.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
    );
    formDataToSend.append("content", form.content);
    formDataToSend.append("author", form.author);

    // Add featured image file if present
    if (form.featuredImage) {
      formDataToSend.append("featured_image", form.featuredImage);
    }

    // Add published date
    if (form.publishedDate) {
      formDataToSend.append("published_date", form.publishedDate);
    }

    try {
      if (editingBlogId) {
        await updateBlog(editingBlogId, formDataToSend);
      } else {
        await createBlog(formDataToSend);
      }

      setIsModalOpen(false);
      setEditingBlogId(null);
      setForm({
        title: "",
        slug: "",
        content: "",
        author: "",
        featuredImage: null,
        featuredImagePreview: "",
        publishedDate: "",
      });

      fetchBlogs(); // reload
    } catch (err: any) {
      console.error("Failed to save blog", err);
      alert(err.response?.data?.message || "Failed to save blog");
    }
  };

  // ✅ Delete blog
  const handleDelete = (id: string, title: string) => {
    setDeletingId(id);
    setDeletingTitle(title);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!deletingId) return;
    try {
      await deleteBlog(deletingId);
      fetchBlogs();
    } catch (err) {
      console.error("Failed to delete blog", err);
    } finally {
      setIsDeleteModalOpen(false);
      setDeletingId(null);
      setDeletingTitle("");
    }
  };

  // ✅ Open modal for edit
  const handleEdit = (blog: any) => {
    setEditingBlogId(blog._id);
    const featuredUrl = blog.featuredImage || "";

    setForm({
      title: blog.title,
      slug: blog.slug,
      content: blog.content,
      author: blog.author || "",
      featuredImage: null,
      featuredImagePreview: featuredUrl,
      publishedDate: blog.publishedDate ? blog.publishedDate.slice(0, 10) : "",
    });
    setIsModalOpen(true);
  };

  const columns = [
    { label: "Title", key: "title", width: "240px" },
    { label: "Slug", key: "slug", width: "180px" },
    {
      label: "Content",
      key: "content",
      render: (r: any) => <span className="text-sm text-gray-700">{truncate(r.content, 120)}</span>,
    },
    {
      label: "Author",
      key: "author",
      width: "150px",
      render: (r: any) => <span className="font-medium text-gray-900">{r.author || "-"}</span>,
    },
    {
      label: "Featured",
      key: "featuredImage",
      width: "110px",
      render: (r: any) =>
        r.featuredImage ? (
          <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-full border border-gray-100 bg-gray-50">
            <Image
              src={r.featuredImage}
              alt="feat"
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
    { label: "Published", key: "publishedDate", width: "160px", render: (r: any) => (r.publishedDate ? new Date(r.publishedDate).toLocaleDateString() : "-") },
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
        title="Blogs"
        columns={columns}
        data={rows}
        showAddButton
        onAddClick={() => setIsModalOpen(true)}
        onRefresh={fetchBlogs}
        loading={loading}
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        itemName={deletingTitle}
      />

      <Modal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); setEditingBlogId(null); setForm({ title: "", slug: "", content: "", author: "", featuredImage: null, featuredImagePreview: "", publishedDate: "" }); }} title={editingBlogId ? "Edit Blog" : "Add Blog"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-0.5">
              <label className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">
                Title <span className="text-red-500">*</span>
              </label>
              <input required value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#EB4724] focus:border-[#EB4724]" />
            </div>
            <div className="space-y-0.5">
              <label className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">
                Slug
              </label>
              <input value={form.slug} onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))} className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#EB4724] focus:border-[#EB4724]" />
            </div>
          </div>

          <div className="space-y-0.5">
            <label className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">
              Content <span className="text-red-500">*</span>
            </label>
            <textarea required value={form.content} onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))} className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#EB4724] focus:border-[#EB4724]" rows={6} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-0.5">
              <label className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">
                Author Name <span className="text-red-500">*</span>
              </label>
              <input required value={form.author} onChange={(e) => setForm((f) => ({ ...f, author: e.target.value }))} className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#EB4724] focus:border-[#EB4724]" />
            </div>
            <div className="space-y-0.5">
              <label className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">
                Published Date
              </label>
              <input type="date" value={form.publishedDate} onChange={(e) => setForm((f) => ({ ...f, publishedDate: e.target.value }))} className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#EB4724] focus:border-[#EB4724]" />
            </div>
          </div>

          {/* Featured Image Upload */}
          <div className="space-y-0.5">
            <label className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">
              Featured Image {!editingBlogId && <span className="text-red-500">*</span>}
            </label>
            <div className="flex items-center gap-3">
              <div className="relative h-32 w-48 rounded-lg bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors group overflow-hidden">
                {form.featuredImagePreview ? (
                  <img
                    src={form.featuredImagePreview}
                    alt="Featured Preview"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <Camera className="h-8 w-8 text-gray-400 group-hover:text-[#EB4724] transition-colors" />
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
                  {form.featuredImage
                    ? form.featuredImage.name
                    : editingBlogId
                      ? "Click to change featured image (optional)"
                      : "Click to upload featured image"}
                </p>
                {form.featuredImage && (
                  <button
                    type="button"
                    onClick={() => {
                      setForm((prev) => ({
                        ...prev,
                        featuredImage: null,
                        featuredImagePreview: editingBlogId ? prev.featuredImagePreview : "",
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
            <button type="button" onClick={() => { setIsModalOpen(false); setEditingBlogId(null); setForm({ title: "", slug: "", content: "", author: "", featuredImage: null, featuredImagePreview: "", publishedDate: "" }); }} className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">Cancel</button>
            <button type="submit" className="px-4 py-1.5 text-xs font-medium text-white bg-[#651313] rounded-lg hover:bg-[#500f0f]">{editingBlogId ? "Update Blog" : "Create Blog"}</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

