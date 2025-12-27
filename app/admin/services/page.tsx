"use client";

import { useEffect, useState } from "react";
import DataTable from "../../../components/admin/DataTable";
import { Pencil, Trash2 } from "lucide-react";
import { getAllServices } from "../../../api/serviceApi"; // <-- import your API

type Service = any;

export default function AdminServicesPage() {
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getAllServices(); // fetch from backend
        const data: Service[] = Array.isArray(res.data.data) ? res.data.data : res.data;

        const flattened: any[] = [];

        data.forEach((svc) => {
          if (Array.isArray(svc.packages) && svc.packages.length > 0) {
            svc.packages.forEach((pkg: any) => {
              flattened.push({
                _id: pkg._id || svc._id,
                serviceId: svc._id,
                serviceTitle: svc.serviceTitle,
                serviceIcon: svc.serviceIcon,
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
              serviceIcon: svc.serviceIcon,
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
        setRows([]); // optionally, keep empty if backend fails
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const columns = [
    { label: "Service Title", key: "serviceTitle", width: "220px" },
    {
      label: "Icon",
      key: "serviceIcon",
      width: "80px",
      render: (row: any) =>
        row.serviceIcon ? (
          <div className="w-10 h-10 rounded overflow-hidden">
            <img
              src={row.serviceIcon.startsWith("/") ? row.serviceIcon : `/${row.serviceIcon}`}
              alt="icon"
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <span className="text-gray-400">-</span>
        ),
    },
    { label: "Package", key: "packageTitle", width: "220px" },
    { label: "Price", key: "price", width: "120px", render: (r: any) => (r.price === "-" ? "-" : `$${r.price}`) },
    { label: "Features", key: "features", render: (r: any) => (Array.isArray(r.features) ? r.features.join(", ") : r.features) },
    {
      label: "Actions",
      key: "actions",
      width: "140px",
      render: (r: any) => (
        <div className="flex gap-2">
          <button className="p-2 rounded-lg hover:bg-orange-50 text-[#EB4724] transition-colors" title="Edit">
            <Pencil className="h-4 w-4" />
          </button>
          <button className="p-2 rounded-lg hover:bg-red-50 text-red-500 transition-colors" title="Delete">
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-bold text-[#651313]">Services</h1>

      {loading ? (
        <div className="p-6 bg-white rounded shadow-sm">Loading services...</div>
      ) : (
        <DataTable title="Services" columns={columns} data={rows} showAddButton onAddClick={() => {}} />
      )}
    </div>
  );
}
