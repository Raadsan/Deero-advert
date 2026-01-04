"use client";

import { useEffect, useState } from "react";
import DataTable from "@/components/layout/DataTable";
import Modal from "@/components/layout/Modal";
import { Pencil, Trash2, Camera } from "lucide-react";
import {
  getAllBlogs,
  createBlog,
  updateBlog,
  deleteBlog,
} from "../../../api/blogsApi";

export default function AdminBlogsPage() {
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBlogId, setEditingBlogId] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: "",
    slug: "",
    content: "",
    authorName: "",
    authorAvatar: null as File | null,
    authorAvatarPreview: "",
    featuredImage: null as File | null,
    featuredImagePreview: "",
    categories: "",
    publishedDate: "",
  });

  // ✅ Fetch blogs from backend
  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const res = await getAllBlogs();
      const dataArr = Array.isArray(res.data) ? res.data : (res.data?.data || []);

      setRows(
        dataArr.map((b: any) => ({
          _id: b._id,
          title: b.title,
          slug: b.slug,
          content: b.content,
          author: b.author,
          featuredImage: b.featured_image || b.featuredImage || "",
          categories: b.categories,
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
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: "avatar" | "featured") => {
    const file = e.target.files?.[0];
    if (file) {
      if (type === "avatar") {
        setForm((prev) => ({
          ...prev,
          authorAvatar: file,
          authorAvatarPreview: URL.createObjectURL(file),
        }));
      } else {
        setForm((prev) => ({
          ...prev,
          featuredImage: file,
          featuredImagePreview: URL.createObjectURL(file),
        }));
      }
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

    // Always send author name (required for backend to merge with avatar)
    if (form.authorName) {
      formDataToSend.append("author", JSON.stringify({ name: form.authorName }));
    }

    // Add avatar file if present
    if (form.authorAvatar) {
      formDataToSend.append("author_avatar", form.authorAvatar);
    }

    // Add featured image file if present
    if (form.featuredImage) {
      formDataToSend.append("featured_image", form.featuredImage);
    }

    // Add categories
    if (form.categories) {
      formDataToSend.append("categories", form.categories);
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
        authorName: "",
        authorAvatar: null,
        authorAvatarPreview: "",
        featuredImage: null,
        featuredImagePreview: "",
        categories: "",
        publishedDate: "",
      });

      fetchBlogs(); // reload
    } catch (err: any) {
      console.error("Failed to save blog", err);
      alert(err.response?.data?.message || "Failed to save blog");
    }
  };

  // ✅ Delete blog
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this blog?")) return;
    try {
      await deleteBlog(id);
      fetchBlogs();
    } catch (err) {
      console.error("Failed to delete blog", err);
    }
  };

  // ✅ Open modal for edit
  const handleEdit = (blog: any) => {
    setEditingBlogId(blog._id);
    const avatarUrl = blog.author?.avatar || "";
    const featuredUrl = blog.featuredImage || "";

    setForm({
      title: blog.title,
      slug: blog.slug,
      content: blog.content,
      authorName: blog.author?.name || "",
      authorAvatar: null,
      authorAvatarPreview: avatarUrl.startsWith("/") ? avatarUrl : `/${avatarUrl}`,
      featuredImage: null,
      featuredImagePreview: featuredUrl.startsWith("/") ? featuredUrl : `/${featuredUrl}`,
      categories: blog.categories?.join(", ") || "",
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
      width: "220px",
      render: (r: any) => (
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-gray-100 overflow-hidden flex-shrink-0">
            {r.author?.avatar ? <img src={r.author.avatar} alt={r.author.name} className="w-full h-full object-cover" /> : <div className="h-full w-full bg-gray-200" />}
          </div>
          <div>
            <div className="font-medium text-gray-900">{r.author?.name || "-"}</div>
          </div>
        </div>
      ),
    },
    {
      label: "Featured",
      key: "featuredImage",
      width: "110px",
      render: (r: any) =>
        r.featuredImage ? (
          <div className="w-16 h-10 rounded overflow-hidden">
            <img src={r.featuredImage.startsWith("/") ? r.featuredImage : `/${r.featuredImage}`} alt="feat" className="w-full h-full object-cover" />
          </div>
        ) : (
          <span className="text-gray-400">-</span>
        ),
    },
    { label: "Categories", key: "categories", render: (r: any) => (Array.isArray(r.categories) ? r.categories.join(", ") : "-") },
    { label: "Published", key: "publishedDate", width: "160px", render: (r: any) => (r.publishedDate ? new Date(r.publishedDate).toLocaleDateString() : "-") },
    {
      label: "Actions",
      key: "actions",
      width: "120px",
      render: (r: any) => (
        <div className="flex gap-2">
          <button
            className="p-2 rounded-lg hover:bg-orange-50 text-[#EB4724] transition-colors"
            title="Edit"
            onClick={() => handleEdit(r)}
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button
            className="p-2 rounded-lg hover:bg-red-50 text-red-500 transition-colors"
            title="Delete"
            onClick={() => handleDelete(r._id)}
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 p-6">


      <DataTable
        title="Blogs"
        columns={columns}
        data={rows}
        showAddButton
        onAddClick={() => setIsModalOpen(true)}
        loading={loading}
      />

      <Modal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); setEditingBlogId(null); setForm({ title: "", slug: "", content: "", authorName: "", authorAvatar: null, authorAvatarPreview: "", featuredImage: null, featuredImagePreview: "", categories: "", publishedDate: "" }); }} title={editingBlogId ? "Edit Blog" : "Add Blog"}>
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
                Author Name
              </label>
              <input value={form.authorName} onChange={(e) => setForm((f) => ({ ...f, authorName: e.target.value }))} className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#EB4724] focus:border-[#EB4724]" />
            </div>
            <div className="space-y-0.5">
              <label className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">
                Categories (comma separated)
              </label>
              <input value={form.categories} onChange={(e) => setForm((f) => ({ ...f, categories: e.target.value }))} className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#EB4724] focus:border-[#EB4724]" />
            </div>
          </div>

          {/* Author Avatar Upload */}
          <div className="space-y-0.5">
            <label className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">
              Author Avatar {!editingBlogId && <span className="text-red-500">*</span>}
            </label>
            <div className="flex items-center gap-3">
              <div className="relative h-20 w-20 rounded-full bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors group overflow-hidden">
                {form.authorAvatarPreview ? (
                  <img
                    src={form.authorAvatarPreview}
                    alt="Avatar Preview"
                    className="h-full w-full object-cover rounded-full"
                  />
                ) : (
                  <Camera className="h-6 w-6 text-gray-400 group-hover:text-[#EB4724] transition-colors" />
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, "avatar")}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-500">
                  {form.authorAvatar
                    ? form.authorAvatar.name
                    : editingBlogId
                      ? "Click to change avatar (optional)"
                      : "Click to upload avatar"}
                </p>
                {form.authorAvatar && (
                  <button
                    type="button"
                    onClick={() => {
                      setForm((prev) => ({
                        ...prev,
                        authorAvatar: null,
                        authorAvatarPreview: editingBlogId ? prev.authorAvatarPreview : "",
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
                  onChange={(e) => handleFileChange(e, "featured")}
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

          <div className="space-y-0.5">
            <label className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">
              Published Date
            </label>
            <input type="date" value={form.publishedDate} onChange={(e) => setForm((f) => ({ ...f, publishedDate: e.target.value }))} className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#EB4724] focus:border-[#EB4724]" />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-gray-100 mt-4">
            <button type="button" onClick={() => { setIsModalOpen(false); setEditingBlogId(null); setForm({ title: "", slug: "", content: "", authorName: "", authorAvatar: null, authorAvatarPreview: "", featuredImage: null, featuredImagePreview: "", categories: "", publishedDate: "" }); }} className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">Cancel</button>
            <button type="submit" className="px-4 py-1.5 text-xs font-medium text-white bg-[#651313] rounded-lg hover:bg-[#500f0f]">{editingBlogId ? "Update Blog" : "Create Blog"}</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
