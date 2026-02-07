"use client";

import { useEffect, useState } from "react";
import DataTable from "@/components/layout/DataTable";
import Modal from "@/components/layout/Modal";
import DeleteConfirmModal from "@/components/layout/DeleteConfirmModal";
import { Edit, Trash2, Camera, Plus, X } from "lucide-react";
import Image from "next/image";
import { getAllServices, createService, updateService, deleteService } from "@/api/serviceApi";
import { getImageUrl } from "@/utils/url";

type Service = any;

interface Package {
  packageTitle: string;
  price: number | string;
  features: string[];
}

export default function AdminServicesPage() {
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deletingName, setDeletingName] = useState("");
  const truncate = (s: string, n = 80) => (s?.length > n ? s.slice(0, n) + "..." : s);
  const [formData, setFormData] = useState({
    serviceTitle: "",
    serviceIcon: null as File | null,
    serviceIconPreview: "",
    packages: [] as Package[],
  });

  // Fetch services
  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getAllServices();
      const data: Service[] = Array.isArray(res.data?.data) ? [...res.data.data].reverse() : [];

      const flattened: any[] = [];

      data.forEach((svc) => {
        if (Array.isArray(svc.packages) && svc.packages.length > 0) {
          svc.packages.forEach((pkg: any) => {
            flattened.push({
              _id: pkg._id || svc._id,
              serviceId: svc._id,
              serviceTitle: svc.serviceTitle,
              serviceIcon: getImageUrl(svc.serviceIcon),
              packageTitle: pkg.packageTitle,
              price: pkg.price,
              features: pkg.features,
              createdAt: svc.createdAt,
            });
          });
        } else {
          flattened.push({
            _id: svc._id,
            serviceId: svc._id,
            serviceTitle: svc.serviceTitle,
            serviceIcon: getImageUrl(svc.serviceIcon),
            packageTitle: "-",
            price: "-",
            features: [],
            createdAt: svc.createdAt,
          });
        }
      });

      setRows(flattened);
    } catch (err) {
      console.error("Failed to load services", err);
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Add new package
  const addPackage = () => {
    setFormData((prev) => ({
      ...prev,
      packages: [...prev.packages, { packageTitle: "", price: "", features: [""] }],
    }));
  };

  // Remove package
  const removePackage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      packages: prev.packages.filter((_, i) => i !== index),
    }));
  };

  // Update package field
  const updatePackage = (index: number, field: keyof Package, value: string | number) => {
    setFormData((prev) => {
      const updated = [...prev.packages];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, packages: updated };
    });
  };

  // Add feature to package
  const addFeature = (packageIndex: number) => {
    setFormData((prev) => {
      const updated = [...prev.packages];
      updated[packageIndex].features.push("");
      return { ...prev, packages: updated };
    });
  };

  // Remove feature from package
  const removeFeature = (packageIndex: number, featureIndex: number) => {
    setFormData((prev) => {
      const updated = [...prev.packages];
      updated[packageIndex].features = updated[packageIndex].features.filter(
        (_, i) => i !== featureIndex
      );
      return { ...prev, packages: updated };
    });
  };

  // Update feature in package
  const updateFeature = (packageIndex: number, featureIndex: number, value: string) => {
    setFormData((prev) => {
      const updated = [...prev.packages];
      updated[packageIndex].features[featureIndex] = value;
      return { ...prev, packages: updated };
    });
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
        serviceIcon: file,
        serviceIconPreview: URL.createObjectURL(file),
      }));
    }
  };

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Validate packages
      if (!formData.packages || formData.packages.length === 0) {
        alert("At least one package is required");
        return;
      }

      // Validate and format packages
      const packagesData = formData.packages.map((pkg, index) => {
        if (!pkg.packageTitle.trim()) {
          throw new Error(`Package ${index + 1}: Title is required`);
        }
        if (!pkg.price || pkg.price === "") {
          throw new Error(`Package ${index + 1}: Price is required`);
        }
        const priceNum = Number(pkg.price);
        if (isNaN(priceNum) || priceNum < 0) {
          throw new Error(`Package ${index + 1}: Price must be a valid number`);
        }
        const features = pkg.features.filter((f) => f.trim() !== "");
        if (features.length === 0) {
          throw new Error(`Package ${index + 1}: At least one feature is required`);
        }
        return {
          packageTitle: pkg.packageTitle.trim(),
          price: priceNum,
          features: features,
        };
      });

      // Create FormData
      const formDataToSend = new FormData();
      formDataToSend.append("serviceTitle", formData.serviceTitle);
      formDataToSend.append("packages", JSON.stringify(packagesData));

      // Add file if it's a new file (not editing or file changed)
      if (formData.serviceIcon) {
        formDataToSend.append("serviceIcon", formData.serviceIcon);
      }

      if (editingId) {
        await updateService(editingId, formDataToSend);
      } else {
        if (!formData.serviceIcon) {
          alert("Service icon is required");
          return;
        }
        await createService(formDataToSend);
      }

      // Reset form and close modal
      setIsModalOpen(false);
      setEditingId(null);
      setFormData({
        serviceTitle: "",
        serviceIcon: null,
        serviceIconPreview: "",
        packages: [],
      });

      // Reload data
      fetchData();
    } catch (err: any) {
      console.error("Failed to save service", err);
      alert(err.message || err.response?.data?.message || "Failed to save service");
    }
  };

  // Handle delete
  const handleDelete = (row: any) => {
    setDeletingId(row.serviceId);
    setDeletingName(row.serviceTitle);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!deletingId) return;
    try {
      await deleteService(deletingId);
      fetchData();
    } catch (err) {
      console.error("Failed to delete service", err);
      alert("Failed to delete service");
    } finally {
      setIsDeleteModalOpen(false);
      setDeletingId(null);
      setDeletingName("");
    }
  };

  // Handle edit
  const handleEdit = async (row: any) => {
    try {
      // Fetch full service data to get packages
      const res = await getAllServices();
      const services = Array.isArray(res.data?.data) ? res.data.data : [];
      const service = services.find((s: any) => s._id === row.serviceId);

      if (service) {
        setEditingId(service._id);
        // Convert packages to form format (ensure features is array of strings)
        const packages = (service.packages || []).map((pkg: any) => ({
          packageTitle: pkg.packageTitle || "",
          price: pkg.price || "",
          features: Array.isArray(pkg.features) ? pkg.features : [],
        }));

        setFormData({
          serviceTitle: service.serviceTitle,
          serviceIcon: null,
          serviceIconPreview: getImageUrl(service.serviceIcon) || "",
          packages: packages.length > 0 ? packages : [{ packageTitle: "", price: "", features: [""] }],
        });
        setIsModalOpen(true);
      }
    } catch (err) {
      console.error("Failed to load service for editing", err);
    }
  };

  const columns = [
    { label: "Service Title", key: "serviceTitle", width: "220px" },
    {
      label: "Icon",
      key: "serviceIcon",
      width: "80px",
      render: (row: any) =>
        row.serviceIcon ? (
          <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-full border border-gray-100 bg-gray-50">
            <Image
              src={row.serviceIcon}
              alt="icon"
              width={48}
              height={48}
              unoptimized
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <span className="text-gray-400">-</span>
        ),
    },
    { label: "Package", key: "packageTitle", width: "220px" },
    {
      label: "Price",
      key: "price",
      width: "120px",
      render: (r: any) => (r.price === "-" ? "-" : `$${r.price}`),
    },
    {
      label: "Features",
      key: "features",
      render: (r: any) => {
        const text = Array.isArray(r.features) ? r.features.join(", ") : (r.features || "");
        return <span title={text}>{truncate(text, 100)}</span>;
      },
    },
    {
      label: "Actions",
      key: "actions",
      width: "140px",
      render: (r: any) => (
        <div className="flex gap-2">
          <button
            onClick={() => handleEdit(r)}
            className="p-2 rounded-lg hover:bg-blue-50 text-blue-600 transition-colors"
            title="Edit"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleDelete(r)}
            className="p-2 rounded-lg hover:bg-red-50 text-red-600 transition-colors"
            title="Delete"
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
        title="Services"
        columns={columns}
        data={rows}
        showAddButton
        onAddClick={() => {
          setIsModalOpen(true);
          setEditingId(null);
          setFormData({
            serviceTitle: "",
            serviceIcon: null,
            serviceIconPreview: "",
            packages: [{ packageTitle: "", price: "", features: [""] }],
          });
        }}
        onRefresh={fetchData}
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
            serviceTitle: "",
            serviceIcon: null,
            serviceIconPreview: "",
            packages: [],
          });
        }}
        title={editingId ? "Edit Service" : "Add New Service"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Service Title */}
          <div className="space-y-0.5">
            <label className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">
              Service Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="serviceTitle"
              required
              value={formData.serviceTitle}
              onChange={handleInputChange}
              className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#EB4724] focus:border-[#EB4724]"
              placeholder="e.g., Web Development"
            />
          </div>

          {/* Service Icon Upload */}
          <div className="space-y-0.5">
            <label className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">
              Service Icon {!editingId && <span className="text-red-500">*</span>}
            </label>
            <div className="flex items-center gap-3">
              <div className="relative h-20 w-20 rounded-lg bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors group overflow-hidden">
                {formData.serviceIconPreview ? (
                  <img
                    src={formData.serviceIconPreview}
                    alt="Preview"
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
                  {formData.serviceIcon
                    ? formData.serviceIcon.name
                    : editingId
                      ? "Click to change icon (optional)"
                      : "Click to upload icon"}
                </p>
                {formData.serviceIcon && (
                  <button
                    type="button"
                    onClick={() => {
                      setFormData((prev) => ({
                        ...prev,
                        serviceIcon: null,
                        serviceIconPreview: editingId ? prev.serviceIconPreview : "",
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

          {/* Packages Dynamic Form */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">
                Packages <span className="text-red-500">*</span>
              </label>
              <button
                type="button"
                onClick={addPackage}
                className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-[#651313] bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
              >
                <Plus className="h-3 w-3" />
                Add Package
              </button>
            </div>

            <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
              {formData.packages.map((pkg, pkgIndex) => (
                <div
                  key={pkgIndex}
                  className="p-4 border border-gray-200 rounded-lg bg-gray-50 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-semibold text-gray-700">
                      Package {pkgIndex + 1}
                    </h4>
                    {formData.packages.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removePackage(pkgIndex)}
                        className="p-1 text-red-500 hover:bg-red-50 rounded transition-colors"
                        title="Remove Package"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-0.5">
                      <label className="text-[10px] text-gray-600">Package Title *</label>
                      <input
                        type="text"
                        value={pkg.packageTitle}
                        onChange={(e) =>
                          updatePackage(pkgIndex, "packageTitle", e.target.value)
                        }
                        placeholder="e.g., Basic Package"
                        className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#EB4724] focus:border-[#EB4724]"
                        required
                      />
                    </div>
                    <div className="space-y-0.5">
                      <label className="text-[10px] text-gray-600">Price *</label>
                      <input
                        type="number"
                        value={pkg.price}
                        onChange={(e) =>
                          updatePackage(pkgIndex, "price", e.target.value)
                        }
                        placeholder="e.g., 99"
                        min="0"
                        step="0.01"
                        className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#EB4724] focus:border-[#EB4724]"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] text-gray-600">Features *</label>
                      <button
                        type="button"
                        onClick={() => addFeature(pkgIndex)}
                        className="flex items-center gap-1 px-2 py-0.5 text-[10px] text-[#651313] bg-white border border-gray-300 hover:bg-gray-50 rounded transition-colors"
                      >
                        <Plus className="h-3 w-3" />
                        Add Feature
                      </button>
                    </div>
                    <div className="space-y-2">
                      {pkg.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center gap-2">
                          <input
                            type="text"
                            value={feature}
                            onChange={(e) =>
                              updateFeature(pkgIndex, featureIndex, e.target.value)
                            }
                            placeholder={`Feature ${featureIndex + 1}`}
                            className="flex-1 px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#EB4724] focus:border-[#EB4724]"
                          />
                          {pkg.features.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeFeature(pkgIndex, featureIndex)}
                              className="p-1 text-red-500 hover:bg-red-50 rounded transition-colors"
                              title="Remove Feature"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-gray-100 mt-4">
            <button
              type="button"
              onClick={() => {
                setIsModalOpen(false);
                setEditingId(null);
                setFormData({
                  serviceTitle: "",
                  serviceIcon: null,
                  serviceIconPreview: "",
                  packages: [],
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
    </div>
  );
}
