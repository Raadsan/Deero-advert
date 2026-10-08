"use client";
export const dynamic = 'force-static';

import { useState, useEffect } from "react";
import DataTable from "@/components/layout/DataTable";
import { getAllTransactions } from "@/api-client/transactionApi";
import { getAllUsers } from "@/api-client/usersApi";
import { Globe } from "lucide-react";

interface Domain {
    _id: string;
    name?: string; // Fallback
    domainName?: string; // New field
    description?: string; // For parsing
    domain?: {
        _id: string;
        name: string;
        status: string;
        price?: number;
        expiryDate?: string;
    };
    user: any; // Can be ID or populated object
    status: string;
    registrationDate?: string;
    expiryDate?: string;
    price?: number;
    amount?: number;
    createdAt: string;
}

interface User {
    _id: string;
    name?: string;
    fullname?: string;
    email: string;
    phone?: string;
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
            const [transRes, usersRes] = await Promise.all([
                getAllTransactions(),
                getAllUsers()
            ]);

            if (transRes.data) {
                const allTrans = transRes.data.transactions || (Array.isArray(transRes.data) ? transRes.data : []);
                // Filter for domain related transactions
                const domainTrans = allTrans.filter((t: any) =>
                    ["register", "transfer", "renew"].includes(t.type) &&
                    t.status?.toLowerCase() === "completed"
                );
                setDomains(domainTrans);
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
        if (!status) return "text-gray-600 bg-gray-50";
        switch (status.toLowerCase()) {
            case "registered":
            case "completed": return "text-green-600 bg-green-50";
            case "transferred": return "text-blue-600 bg-blue-50";
            case "available": return "text-gray-600 bg-gray-50";
            case "pending": return "text-orange-600 bg-orange-50";
            default: return "text-gray-600 bg-gray-50";
        }
    };

    const getUserName = (user: any) => {
        if (!user) return "-";
        if (typeof user === 'string') {
            const foundUser = users.find(u => u._id === user);
            return foundUser ? (foundUser.fullname || foundUser.name) : "Unknown User";
        }
        return user.fullname || user.name || user.email || "Unknown User";
    };

    const getUserEmail = (user: any) => {
        if (!user) return "-";
        if (typeof user === 'string') {
            const foundUser = users.find(u => u._id === user);
            return foundUser ? foundUser.email : "-";
        }
        return user.email || "-";
    };

    const getUserPhone = (user: any) => {
        if (!user) return "-";
        if (typeof user === 'string') {
            const foundUser = users.find(u => u._id === user);
            return foundUser ? (foundUser.phone || "-") : "-";
        }
        return user.phone || "-";
    };

    return (
        <div className="space-y-6">
            <DataTable
                title="Request Domains"
                columns={[
                    {
                        label: "Domain Name",
                        key: "name",
                        render: (row: Domain) => {
                            let name = row.domainName || row.domain?.name || row.name;

                            // Fallback logic
                            if (!name || (typeof name === 'string' && name.length === 24 && /^[0-9a-fA-F]{24}$/.test(name))) {
                                if (row.description) {
                                    if (row.description.includes("Payment for domain - ")) {
                                        name = row.description.replace("Payment for domain - ", "").trim();
                                    } else if (row.description.includes("Domain Registration: ")) {
                                        name = row.description.replace("Domain Registration: ", "").trim();
                                    }
                                }
                            }
                            // Fallback for ID display if still not found (better than nothing, or stay '-')
                            if (!name && row.domain?._id) name = row.domain._id;
                            if (!name && row.name) name = row.name;

                            return (
                                <div className="flex items-center gap-2">
                                    <div className="p-1.5 rounded bg-blue-50 text-blue-600">
                                        <Globe className="h-4 w-4" />
                                    </div>
                                    <span className="font-medium text-gray-900">{name || "-"}</span>
                                </div>
                            );
                        },
                    },
                    {
                        label: "User Name",
                        key: "fullname",
                        render: (row: Domain) => (
                            <span className="text-gray-900 font-medium">{getUserName(row.user)}</span>
                        ),
                    },
                    {
                        label: "User Email",
                        key: "useremail",
                        render: (row: Domain) => (
                            <span className="text-gray-500">{getUserEmail(row.user)}</span>
                        ),
                    },
                    {
                        label: "Phone",
                        key: "userphone",
                        render: (row: Domain) => (
                            <span className="text-gray-500">{getUserPhone(row.user)}</span>
                        ),
                    },
                    {
                        label: "Status",
                        key: "status",
                        render: (row: Domain) => (
                            <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(row.status || row.domain?.status || "")}`}>
                                {(row.status || row.domain?.status || "PENDING").toUpperCase()}
                            </span>
                        ),
                    },
                    {
                        label: "Price",
                        key: "price",
                        render: (row: Domain) => {
                            const price = row.domain?.price || row.price || 0;
                            return <span className="font-medium text-gray-500">${price.toFixed(2)}</span>;
                        },
                    },
                    {
                        label: "Amount paid",
                        key: "amount",
                        render: (row: Domain) => {
                            const amountPaid = row.amount ?? row.price ?? 0;
                            return <span className="font-bold text-gray-900">${amountPaid.toFixed(2)}</span>;
                        },
                    },
                    {
                        label: "Registration / Expiry",
                        key: "dates",
                        render: (row: Domain) => {
                            const regDate = row.registrationDate || row.createdAt;
                            const expDate = row.expiryDate || row.domain?.expiryDate;
                            return (
                                <div className="flex flex-col text-xs text-gray-500">
                                    <span>Reg: {regDate ? new Date(regDate).toLocaleDateString() : "-"}</span>
                                    <span>Exp: {expDate ? new Date(expDate).toLocaleDateString() : "-"}</span>
                                </div>
                            );
                        },
                    }
                ]}
                data={domains}
                showAddButton={false}
                onRefresh={fetchData}
                loading={loading}
            />
        </div>
    );
}

