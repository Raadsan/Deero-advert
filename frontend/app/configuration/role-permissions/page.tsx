"use client";

import { useState, useEffect } from "react";

export default function RolePermissionsPage() {
    const [permissions, setPermissions] = useState([]);
    const [loading, setLoading] = useState(true);

    return (
        <div className="p-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Role Permissions</h1>
                <p className="mt-1 text-sm text-gray-600">
                    Assign permissions and menu access to roles
                </p>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
                <p className="text-gray-600">Role permissions interface coming soon...</p>
            </div>
        </div>
    );
}
