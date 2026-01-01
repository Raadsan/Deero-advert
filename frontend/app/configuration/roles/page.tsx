"use client";

import { useState, useEffect } from "react";

export default function RolesPage() {
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(true);

    return (
        <div className="p-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Role Management</h1>
                <p className="mt-1 text-sm text-gray-600">
                    Manage user roles and access levels
                </p>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
                <p className="text-gray-600">Role management interface coming soon...</p>
            </div>
        </div>
    );
}
