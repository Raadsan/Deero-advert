"use client";

import { useState, useEffect } from "react";
import DataTable from "@/components/layout/DataTable";
import { getAllDomains } from "@/api/domainApi";
import { getAllUsers } from "@/api/usersApi";
import { Globe } from "lucide-react";

interface Domain {
    _id: string;
    name: string;
    user: any; // Can be ID or populated object
    status: string;
    registrationDate?: string;
    expiryDate?: string;
    price: number;
    createdAt: string;
}

interface User {
    _id: string;
    name: string;
    email: string;
    role?: any; // Role object or ID
}

export default function DomainsPage() {
    const [domains, setDomains] = useState<Domain[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    // Search/Filter state could be added here if not handled by DataTable

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [domainsRes, usersRes] = await Promise.all([
                getAllDomains(),
                getAllUsers()
            ]);

            if (domainsRes.data) {
                // Handle different response structures if needed
                setDomains(Array.isArray(domainsRes.data) ? domainsRes.data : domainsRes.data.domains || []);
            }

            if (usersRes.data) {
                const allUsers = Array.isArray(usersRes.data) ? usersRes.data : usersRes.data.users || [];
                // Filter to only show standard "user" role
                const filteredUsers = allUsers.filter((u: User) => {
                    const roleName = u.role?.name || u.role;
                    return roleName === 'user';
                });
                setUsers(filteredUsers);
            }

        } catch (error) {
            console.error("Error fetching data:", error);
            // alert("Failed to load domains"); // Optional: suppress initial load error to avoid annoyance
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case "registered": return "text-green-600 bg-green-50";
            case "transferred": return "text-blue-600 bg-blue-50";
            case "available": return "text-gray-600 bg-gray-50";
            default: return "text-gray-600 bg-gray-50";
        }
    };

    const getUserName = (user: any) => {
        if (!user) return "-";
        if (typeof user === 'string') {
            const foundUser = users.find(u => u._id === user);
            return foundUser ? foundUser.name : "Unknown User";
        }
        return user.name || user.email || "Unknown User";
    };

    return (
        <div className="p-6">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Domain Management</h1>
                    <p className="mt-1 text-sm text-gray-600">
                        Manage registered domains and registrations
                    </p>
                </div>
            </div>

            <DataTable
                title="Registered Domains"
                columns={[
                    {
                        label: "Domain Name",
                        key: "name",
                        render: (row: Domain) => (
                            <div className="flex items-center gap-2">
                                <div className="p-1.5 rounded bg-blue-50 text-blue-600">
                                    <Globe className="h-4 w-4" />
                                </div>
                                <span className="font-medium text-gray-900">{row.name}</span>
                            </div>
                        ),
                    },
                    {
                        label: "User",
                        key: "user",
                        render: (row: Domain) => (
                            <span className="text-gray-700">{getUserName(row.user)}</span>
                        ),
                    },
                    {
                        label: "Status",
                        key: "status",
                        render: (row: Domain) => (
                            <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(row.status)}`}>
                                {row.status.toUpperCase()}
                            </span>
                        ),
                    },
                    {
                        label: "Price",
                        key: "price",
                        render: (row: Domain) => (
                            <span className="font-medium text-gray-900">${row.price}</span>
                        ),
                    },
                    {
                        label: "Registration / Expiry",
                        key: "dates",
                        render: (row: Domain) => (
                            <div className="flex flex-col text-xs text-gray-500">
                                <span>Reg: {row.registrationDate ? new Date(row.registrationDate).toLocaleDateString() : "-"}</span>
                                <span>Exp: {row.expiryDate ? new Date(row.expiryDate).toLocaleDateString() : "-"}</span>
                            </div>
                        ),
                    }
                ]}
                data={domains}
                showAddButton={false}
                loading={loading}
            />
        </div>
    );
}
