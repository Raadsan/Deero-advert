"use client";
export const dynamic = 'force-static';

import React, { useState, useEffect } from "react";
import DataTable from "@/components/layout/DataTable";
import Modal from "@/components/layout/Modal";
import DeleteConfirmModal from "@/components/layout/DeleteConfirmModal";
import { Edit, Trash2, UserPlus } from "lucide-react";
import {
  getAllUsers,
  createUser,
  deleteUser,
  updateUser,
} from "@/api-client/usersApi";
import { getAllRoles } from "@/api-client/roleApi";

export default function UsersPage() {
  const [data, setData] = useState([]);
  const [roles, setRoles] = useState<any[]>([]); // roles state
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deletingName, setDeletingName] = useState("");
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    password: "",
    phone: "",
    role: "", // Add role to state
    id: "", // for editing
  });
  const [isEditing, setIsEditing] = useState(false);

  // Fetch users and roles from backend
  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch users first
      try {
        const userRes = await getAllUsers();
        // Handle users data structure (direct array or nested in data)
        const users = Array.isArray(userRes.data) ? userRes.data : (userRes.data?.data || []);
        setData(users.reverse());
      } catch (uErr) {
        console.error("Failed to fetch users", uErr);
      }

      // Fetch roles separately
      try {
        const roleRes = await getAllRoles();
        // Handle roles data structure
        if (roleRes.roles) {
          setRoles(roleRes.roles);
        } else if (Array.isArray(roleRes)) {
          setRoles(roleRes);
        }
      } catch (rErr) {
        console.error("Failed to fetch roles", rErr);
        // Fallback empty roles or simple error toast could be added here
      }
    } catch (error) {
      console.error("Failed to fetch users or roles", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await getAllUsers();
      const users = Array.isArray(res.data) ? res.data : (res.data?.data || []);
      setData(users.reverse());
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle Create / Update
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await updateUser(formData.id, formData);
      } else {
        // Use the typed role or default to 'user'
        await createUser({ ...formData, role: formData.role || "user" });
      }
      await fetchUsers();
      closeModal();
    } catch (err) {
      const error = err as any; // <-- cast to any
      alert(error.response?.data?.message || "Operation failed");
    }
  };

  const handleDelete = (id: string, name: string) => {
    setDeletingId(id);
    setDeletingName(name);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!deletingId) return;
    try {
      await deleteUser(deletingId);
      await fetchUsers();
    } catch (err) {
      const error = err as any;
      alert(error.response?.data?.message || "Failed to delete user");
    } finally {
      setIsDeleteModalOpen(false);
      setDeletingId(null);
      setDeletingName("");
    }
  };

  const handleEdit = (user: any) => {
    setFormData({
      id: user._id,
      fullname: user.fullname,
      email: user.email,
      password: "", // optional: leave empty for no change
      phone: user.phone,
      role: user.role?._id || user.role, // Use ID for radio matching
    });
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsEditing(false);
    setFormData({ fullname: "", email: "", password: "", phone: "", role: "", id: "" });
  };


  const columns = [
    {
      label: "Fullname",
      key: "fullname",
      render: (row: any) => (
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center text-[#651313] font-bold text-xs uppercase border border-gray-200">
            {row.fullname?.charAt(0) || '?'}
            {row.fullname?.split(" ")[1]?.charAt(0) || ''}
          </div>
          <span className="font-medium text-gray-900">{row.fullname}</span>
        </div>
      ),
    },
    { label: "Email", key: "email" },
    { label: "Phone", key: "phone" },
    {
      label: "Password",
      key: "password",
      render: () => <span className="font-mono text-gray-400">•••••••••••</span>,
    },
    {
      label: "Role",
      key: "role",
      render: (row: any) => {
        const roleName = typeof row.role === 'object' ? row.role?.name : row.role;
        return (
          <span className={`px-2 py-0.5 rounded-full text-xs font-medium 
          ${roleName === "admin"
              ? "bg-red-50 text-red-700 border border-red-100"
              : roleName === "manager"
                ? "bg-blue-50 text-blue-700 border border-blue-100"
                : "bg-gray-50 text-gray-600 border border-gray-100"}`}
          >
            {roleName}
          </span>
        )
      },
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
            onClick={() => handleDelete(row._id, row.fullname)}
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
        title="Users Management"
        columns={columns}
        data={data}
        onAddClick={() => setIsModalOpen(true)}
        onRefresh={fetchData}
        loading={loading}
        disableUpdatingOverlay={true}
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        itemName={deletingName}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={isEditing ? "Edit User" : "Add New User"}
      >
        <form onSubmit={handleSubmit} className="space-y-2" autoComplete="off">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-0.5">
              <label className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">
                Fullname <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="fullname"
                required
                value={formData.fullname}
                onChange={handleInputChange}
                className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#EB4724] focus:border-[#EB4724] transition-all"
                placeholder="John Doe"
              />
            </div>

            <div className="space-y-0.5">
              <label className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#EB4724] focus:border-[#EB4724] transition-all"
                placeholder="john@example.com"
                autoComplete="off"
              />
            </div>

            <div className="space-y-0.5">
              <label className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">
                Phone
              </label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#EB4724] focus:border-[#EB4724] transition-all"
                placeholder="+252 61 8553566"
              />
            </div>

            <div className="space-y-0.5">
              <label className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">
                Password {isEditing ? "(leave blank to keep current)" : <span className="text-red-500">*</span>}
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#EB4724] focus:border-[#EB4724] transition-all"
                placeholder="••••••••"
                autoComplete="new-password"
                required={!isEditing}
              />
            </div>

            <div className="space-y-0.5 col-span-1 sm:col-span-2">
              <label className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">
                Role
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#EB4724] focus:border-[#EB4724] transition-all bg-white"
              >
                <option value="">Select a role</option>
                {roles
                  .filter((role: any) => role.name.toLowerCase() !== 'user') // Hide 'user' role
                  .map((role: any) => (
                    <option key={role._id} value={role._id}>
                      {role.name.charAt(0).toUpperCase() + role.name.slice(1)}
                    </option>
                  ))}
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-gray-100 mt-4">
            <button
              type="button"
              onClick={closeModal}
              className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-3 py-1.5 text-xs font-medium text-white bg-[#651313] rounded-lg hover:bg-[#500f0f] transition-colors shadow-sm"
            >
              {isEditing ? "Update User" : "Create User"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

