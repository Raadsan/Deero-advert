"use client";

import { useEffect, useState } from "react";
import DataTable from "../../../components/admin/DataTable";
import Modal from "../../../components/admin/Modal";
import { Pencil, Trash2 } from "lucide-react";
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
    authorAvatar: "",
    featuredImage: "",
    categories: "",
    publishedDate: "",
  });

  // ✅ Fetch blogs from backend
  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const res = await getAllBlogs();
      const data = Array.isArray(res.data.data) ? res.data.data : res.data;

      setRows(
        data.map((b: any) => ({
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

  // ✅ Save blog (create or update)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      title: form.title,
      slug:
        form.slug ||
        form.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
      content: form.content,
      author: { name: form.authorName, avatar: form.authorAvatar },
      featured_image: form.featuredImage,
      categories: form.categories ? form.categories.split(",").map((s) => s.trim()) : [],
      published_date: form.publishedDate || null,
    };

    try {
      if (editingBlogId) {
        await updateBlog(editingBlogId, payload);
      } else {
        await createBlog(payload);
      }

      setIsModalOpen(false);
      setEditingBlogId(null);
      setForm({
        title: "",
        slug: "",
        content: "",
        authorName: "",
        authorAvatar: "",
        featuredImage: "",
        categories: "",
        publishedDate: "",
      });

      fetchBlogs(); // reload
    } catch (err) {
      console.error("Failed to save blog", err);
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
    setForm({
      title: blog.title,
      slug: blog.slug,
      content: blog.content,
      authorName: blog.author?.name || "",
      authorAvatar: blog.author?.avatar || "",
      featuredImage: blog.featuredImage || "",
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
      <h1 className="text-2xl font-bold text-[#651313]">Blogs</h1>

      {loading ? (
        <div className="p-6 bg-white rounded shadow-sm">Loading blogs...</div>
      ) : (
        <>
          <DataTable title="Blogs" columns={columns} data={rows} showAddButton onAddClick={() => setIsModalOpen(true)} />

          <Modal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); setEditingBlogId(null); }} title={editingBlogId ? "Edit Blog" : "Add Blog"}>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium">Title</label>
                  <input required value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} className="w-full px-3 py-2 border rounded" />
                </div>
                <div>
                  <label className="text-xs font-medium">Slug</label>
                  <input value={form.slug} onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))} className="w-full px-3 py-2 border rounded" />
                </div>
                <div>
                  <label className="text-xs font-medium">Author Name</label>
                  <input value={form.authorName} onChange={(e) => setForm((f) => ({ ...f, authorName: e.target.value }))} className="w-full px-3 py-2 border rounded" />
                </div>
                <div>
                  <label className="text-xs font-medium">Featured Image URL</label>
                  <input value={form.featuredImage} onChange={(e) => setForm((f) => ({ ...f, featuredImage: e.target.value }))} className="w-full px-3 py-2 border rounded" />
                </div>
              </div>

              <div>
                <label className="text-xs font-medium">Content</label>
                <textarea required value={form.content} onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))} className="w-full px-3 py-2 border rounded" rows={6} />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium">Categories (comma separated)</label>
                  <input value={form.categories} onChange={(e) => setForm((f) => ({ ...f, categories: e.target.value }))} className="w-full px-3 py-2 border rounded" />
                </div>
                <div>
                  <label className="text-xs font-medium">Published Date</label>
                  <input type="date" value={form.publishedDate} onChange={(e) => setForm((f) => ({ ...f, publishedDate: e.target.value }))} className="w-full px-3 py-2 border rounded" />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button type="button" onClick={() => { setIsModalOpen(false); setEditingBlogId(null); }} className="px-3 py-1.5 bg-white border rounded">Cancel</button>
                <button type="submit" className="px-4 py-1.5 bg-[#651313] text-white rounded">{editingBlogId ? "Update Blog" : "Create Blog"}</button>
              </div>
            </form>
          </Modal>
        </>
      )}
    </div>
  );
}
