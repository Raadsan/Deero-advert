"use client";

import { useState, useEffect } from "react";
import {
    getAllRolePermissions,
    createOrUpdatePermissions,
    deleteRolePermissions,
    RolePermission,
} from "@/api/rolePermissionApi";
import { getAllRoles, Role } from "@/api/roleApi";
import { getAllMenus } from "@/api/menuApi";
import { Menu } from "@/types/menu";
import { Trash2, Edit, Plus, Save, Shield, Lock, Check, X } from "lucide-react";

export default function RolePermissionsPage() {
    const [permissions, setPermissions] = useState<RolePermission[]>([]);
    const [roles, setRoles] = useState<Role[]>([]);
    const [menus, setMenus] = useState<Menu[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [selectedRole, setSelectedRole] = useState<string>("");
    const [selectedMenus, setSelectedMenus] = useState<{
        [menuId: string]: {
            enabled: boolean;
            subMenus: string[];
        };
    }>({});

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [permRes, roleRes, menuRes] = await Promise.all([
                getAllRolePermissions(),
                getAllRoles(),
                getAllMenus(),
            ]);

            if (permRes.success && permRes.permissions) {
                setPermissions(permRes.permissions);
            }
            if (roleRes.success && roleRes.roles) {
                setRoles(roleRes.roles);
            }
            if (menuRes.success && menuRes.menus) {
                setMenus(menuRes.menus);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    // Helper function to get submenu title by ID
    const getSubMenuTitle = (menuId: string, subMenuId: string): string => {
        const menu = menus.find(m => m._id === menuId);
        if (!menu) return subMenuId;
        const submenu = menu.subMenus.find(sm => sm._id === subMenuId);
        return submenu?.title || subMenuId;
    };

    const handleEdit = (perm: RolePermission) => {
        setSelectedRole(perm.role._id);
        const menuMap: any = {};

        perm.menusAccess.forEach((ma) => {
            if (ma.menuId) {
                menuMap[ma.menuId._id] = {
                    enabled: true,
                    subMenus: ma.subMenus.map((sm) => sm.subMenuId),
                };
            }
        });

        setSelectedMenus(menuMap);
        setShowModal(true);
    };

    const handleDelete = async (id: string) => {
        if (confirm("Are you sure you want to delete these permissions?")) {
            try {
                await deleteRolePermissions(id);
                fetchData();
            } catch (error: any) {
                alert(error.response?.data?.message || "Error deleting permissions");
            }
        }
    };

    const toggleMenu = (menuId: string) => {
        setSelectedMenus((prev) => ({
            ...prev,
            [menuId]: {
                enabled: !prev[menuId]?.enabled,
                subMenus: prev[menuId]?.subMenus || [],
            },
        }));
    };

    const toggleSubMenu = (menuId: string, subMenuId: string) => {
        setSelectedMenus((prev) => {
            const current = prev[menuId] || { enabled: true, subMenus: [] };
            const subMenus = current.subMenus.includes(subMenuId)
                ? current.subMenus.filter((id) => id !== subMenuId)
                : [...current.subMenus, subMenuId];

            return {
                ...prev,
                [menuId]: { ...current, subMenus },
            };
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const menusAccess = Object.entries(selectedMenus)
                .filter(([_, data]) => data.enabled)
                .map(([menuId, data]) => ({
                    menuId,
                    subMenus: data.subMenus.map((smId) => ({ subMenuId: smId })),
                }));

            await createOrUpdatePermissions({
                role: selectedRole,
                menusAccess,
            });

            setShowModal(false);
            setSelectedRole("");
            setSelectedMenus({});
            fetchData();
        } catch (error: any) {
            console.error("Error saving permissions:", error);
            alert(error.response?.data?.message || "Error saving permissions");
        }
    };

    const getRoleColor = (roleName: string) => {
        const colors: Record<string, string> = {
            admin: "from-purple-500 to-purple-700",
            manager: "from-blue-500 to-blue-700",
            user: "from-green-500 to-green-700",
        };
        return colors[roleName.toLowerCase()] || "from-gray-500 to-gray-700";
    };

    const getRoleBadgeColor = (roleName: string) => {
        const colors: Record<string, string> = {
            admin: "bg-purple-100 text-purple-700 border-purple-200",
            manager: "bg-blue-100 text-blue-700 border-blue-200",
            user: "bg-green-100 text-green-700 border-green-200",
        };
        return colors[roleName.toLowerCase()] || "bg-gray-100 text-gray-700 border-gray-200";
    };

    return (
        <div className="p-6">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-3 rounded-xl bg-gradient-to-br from-[#651313] to-[#EB4724] shadow-lg">
                                <Shield className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">Role Permissions</h1>
                                <p className="text-sm text-gray-500 mt-1">
                                    Manage menu access and permissions for each role
                                </p>
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={() => {
                            setSelectedRole("");
                            setSelectedMenus({});
                            setShowModal(true);
                        }}
                        className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#651313] to-[#EB4724] px-6 py-3 text-white font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
                    >
                        <Plus className="h-5 w-5" />
                        Assign Permissions
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="bg-white rounded-2xl shadow-lg p-6 animate-pulse">
                            <div className="h-24 bg-gray-200 rounded-xl mb-4"></div>
                            <div className="space-y-3">
                                <div className="h-4 bg-gray-200 rounded"></div>
                                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {permissions.map((perm) => (
                        <div
                            key={perm._id}
                            className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100"
                        >
                            {/* Role Header with Gradient */}
                            <div className={`bg-gradient-to-br ${getRoleColor(perm.role.name)} p-6 relative overflow-hidden`}>
                                <div className="absolute top-0 right-0 opacity-10">
                                    <Lock className="h-32 w-32 transform rotate-12" />
                                </div>
                                <div className="relative z-10">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-white text-sm font-medium">
                                            <Shield className="h-4 w-4" />
                                            Role
                                        </span>
                                        <div className="flex gap-1">
                                            <button
                                                onClick={() => handleEdit(perm)}
                                                className="rounded-lg p-2 bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-colors"
                                                title="Edit"
                                            >
                                                <Edit className="h-4 w-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(perm._id)}
                                                className="rounded-lg p-2 bg-white/20 backdrop-blur-sm text-white hover:bg-red-500 transition-colors"
                                                title="Delete"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>
                                    <h3 className="text-2xl font-bold text-white capitalize mb-1">
                                        {perm.role.name}
                                    </h3>
                                    <p className="text-white/80 text-sm">
                                        {perm.role.description || "No description"}
                                    </p>
                                </div>
                            </div>

                            {/* Permissions Content */}
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                                        Accessible Menus
                                    </h4>
                                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                                        {perm.menusAccess.length} menus
                                    </span>
                                </div>

                                <div className="space-y-3">
                                    {perm.menusAccess.length > 0 ? (
                                        perm.menusAccess.map((ma) => (
                                            <div key={ma._id} className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-4 border border-gray-200 hover:border-[#EB4724] transition-colors">
                                                {/* Main Menu */}
                                                <div className="flex items-center gap-2 mb-2">
                                                    <div className="w-2 h-2 rounded-full bg-[#651313]"></div>
                                                    <span className="font-semibold text-gray-900">
                                                        {ma.menuId?.title || "Unknown"}
                                                    </span>
                                                </div>

                                                {/* Submenus */}
                                                {ma.subMenus.length > 0 && (
                                                    <div className="ml-4 space-y-1.5 mt-2">
                                                        {ma.subMenus.map((sm) => {
                                                            const subMenuTitle = getSubMenuTitle(ma.menuId?._id || "", sm.subMenuId);
                                                            return (
                                                                <div
                                                                    key={sm._id}
                                                                    className="flex items-center gap-2 text-sm"
                                                                >
                                                                    <Check className="h-3 w-3 text-green-600" />
                                                                    <span className="text-gray-700">{subMenuTitle}</span>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                )}

                                                {ma.subMenus.length === 0 && ma.menuId && ma.menuId.isCollapsible && (
                                                    <div className="ml-4 mt-1">
                                                        <span className="text-xs text-gray-400 italic">All submenus</span>
                                                    </div>
                                                )}
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-8">
                                            <X className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                                            <p className="text-sm text-gray-400">No menus assigned</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}

                    {permissions.length === 0 && (
                        <div className="col-span-full">
                            <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl shadow-lg p-16 text-center border-2 border-dashed border-gray-300">
                                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Shield className="h-10 w-10 text-gray-400" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-700 mb-2">No Permissions Configured</h3>
                                <p className="text-gray-500 mb-6">
                                    Get started by assigning menu permissions to roles
                                </p>
                                <button
                                    onClick={() => {
                                        setSelectedRole("");
                                        setSelectedMenus({});
                                        setShowModal(true);
                                    }}
                                    className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#651313] to-[#EB4724] px-6 py-3 text-white font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
                                >
                                    <Plus className="h-5 w-5" />
                                    Assign Permissions
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Enhanced Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="w-full max-w-4xl rounded-2xl bg-white shadow-2xl max-h-[90vh] overflow-hidden flex flex-col">
                        {/* Modal Header */}
                        <div className="bg-gradient-to-r from-[#651313] to-[#EB4724] p-6 text-white">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-white/20 backdrop-blur-sm rounded-lg">
                                    <Shield className="h-6 w-6" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold">Assign Menu Permissions</h2>
                                    <p className="text-white/80 text-sm mt-1">
                                        Select a role and configure their menu access
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Modal Body */}
                        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
                            <div className="p-6 space-y-6">
                                {/* Role Selection */}
                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-gray-900 uppercase tracking-wide">
                                        Select Role *
                                    </label>
                                    <select
                                        value={selectedRole}
                                        onChange={(e) => setSelectedRole(e.target.value)}
                                        className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 font-medium focus:border-[#EB4724] focus:outline-none focus:ring-2 focus:ring-[#EB4724]/20 transition-all"
                                        required
                                    >
                                        <option value="">Choose a role...</option>
                                        {roles.map((role) => (
                                            <option key={role._id} value={role._id}>
                                                {role.name.toUpperCase()} {role.description && `- ${role.description}`}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Menu Selection */}
                                <div>
                                    <label className="mb-3 block text-sm font-semibold text-gray-900 uppercase tracking-wide">
                                        Configure Menu Access
                                    </label>
                                    <div className="space-y-3 max-h-96 overflow-y-auto bg-gray-50 rounded-xl p-4 border-2 border-gray-200">
                                        {menus.map((menu) => (
                                            <div
                                                key={menu._id}
                                                className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 hover:border-[#EB4724] transition-colors"
                                            >
                                                <label className="flex items-center gap-3 cursor-pointer group">
                                                    <div className="relative">
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedMenus[menu._id]?.enabled || false}
                                                            onChange={() => toggleMenu(menu._id)}
                                                            className="w-5 h-5 rounded border-2 border-gray-300 text-[#651313] focus:ring-[#EB4724] cursor-pointer"
                                                        />
                                                    </div>
                                                    <div className="flex-1">
                                                        <span className="font-semibold text-gray-900 group-hover:text-[#EB4724] transition-colors">
                                                            {menu.title}
                                                        </span>
                                                        {menu.isCollapsible && (
                                                            <span className="ml-2 text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">
                                                                {menu.subMenus.length} submenus
                                                            </span>
                                                        )}
                                                    </div>
                                                </label>

                                                {/* Submenus */}
                                                {selectedMenus[menu._id]?.enabled && menu.subMenus.length > 0 && (
                                                    <div className="ml-8 mt-3 space-y-2 pt-3 border-t border-gray-200">
                                                        {menu.subMenus.map((submenu) => (
                                                            <label
                                                                key={submenu._id}
                                                                className="flex items-center gap-3 cursor-pointer group/sub"
                                                            >
                                                                <input
                                                                    type="checkbox"
                                                                    checked={selectedMenus[menu._id]?.subMenus.includes(submenu._id) || false}
                                                                    onChange={() => toggleSubMenu(menu._id, submenu._id)}
                                                                    className="w-4 h-4 rounded border-2 border-gray-300 text-[#651313] focus:ring-[#EB4724] cursor-pointer"
                                                                />
                                                                <div className="flex-1">
                                                                    <span className="text-sm text-gray-700 group-hover/sub:text-[#EB4724] transition-colors">
                                                                        {submenu.title}
                                                                    </span>
                                                                    <span className="ml-2 text-xs text-gray-400 font-mono">
                                                                        {submenu.url}
                                                                    </span>
                                                                </div>
                                                            </label>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Modal Footer */}
                            <div className="border-t border-gray-200 bg-gray-50 px-6 py-4 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowModal(false);
                                        setSelectedRole("");
                                        setSelectedMenus({});
                                    }}
                                    className="rounded-xl border-2 border-gray-300 px-6 py-2.5 font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#651313] to-[#EB4724] px-6 py-2.5 text-white font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
                                >
                                    <Save className="h-4 w-4" />
                                    Save Permissions
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
