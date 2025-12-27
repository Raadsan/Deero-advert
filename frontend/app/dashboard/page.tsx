"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { User, Mail, Phone, FileText, Settings, LogOut, Package, Calendar, MessageSquare } from "lucide-react";
import { logout } from "../../api/authApi";

export default function UserDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (!token || !userData) {
      router.push("/login");
      return;
    }

    try {
      setUser(JSON.parse(userData));
    } catch (e) {
      console.error("Error parsing user data", e);
      router.push("/login");
    } finally {
      setLoading(false);
    }
  }, [router]);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#EB4724] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="pt-[170px] pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-[#651313] mb-2">
              Welcome back, {user.fullname || "User"}!
            </h1>
            <p className="text-gray-600">Manage your account and view your services</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Profile & Quick Actions */}
            <div className="lg:col-span-1 space-y-6">
              {/* Profile Card */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="h-16 w-16 rounded-full bg-gradient-to-br from-[#651313] to-[#EB4724] flex items-center justify-center text-white text-xl font-bold">
                    {user.fullname?.charAt(0).toUpperCase() || "U"}
                    {user.fullname?.split(" ")[1]?.charAt(0).toUpperCase() || ""}
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">{user.fullname || "User"}</h2>
                    <p className="text-sm text-gray-500">{user.email || ""}</p>
                  </div>
                </div>

                <div className="space-y-3 border-t border-gray-100 pt-4">
                  <div className="flex items-center gap-3 text-sm">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600">{user.email || "N/A"}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600">{user.phone || "N/A"}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <User className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600 capitalize">{user.role || "User"}</span>
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-medium text-sm"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                <div className="space-y-2">
                  <button className="w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg hover:bg-gray-50 transition-colors border border-gray-100">
                    <Package className="h-5 w-5 text-[#EB4724]" />
                    <span className="text-sm font-medium text-gray-700">My Services</span>
                  </button>
                  <button className="w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg hover:bg-gray-50 transition-colors border border-gray-100">
                    <FileText className="h-5 w-5 text-[#EB4724]" />
                    <span className="text-sm font-medium text-gray-700">My Orders</span>
                  </button>
                  <button className="w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg hover:bg-gray-50 transition-colors border border-gray-100">
                    <MessageSquare className="h-5 w-5 text-[#EB4724]" />
                    <span className="text-sm font-medium text-gray-700">Support</span>
                  </button>
                  <button className="w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg hover:bg-gray-50 transition-colors border border-gray-100">
                    <Settings className="h-5 w-5 text-[#EB4724]" />
                    <span className="text-sm font-medium text-gray-700">Settings</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column - Dashboard Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-2">
                    <Package className="h-8 w-8 text-blue-500" />
                    <span className="text-2xl font-bold text-gray-900">0</span>
                  </div>
                  <p className="text-sm text-gray-600">Active Services</p>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-2">
                    <FileText className="h-8 w-8 text-green-500" />
                    <span className="text-2xl font-bold text-gray-900">0</span>
                  </div>
                  <p className="text-sm text-gray-600">Total Orders</p>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-2">
                    <Calendar className="h-8 w-8 text-orange-500" />
                    <span className="text-2xl font-bold text-gray-900">0</span>
                  </div>
                  <p className="text-sm text-gray-600">Pending Tasks</p>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <Package className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">No recent activity</p>
                      <p className="text-xs text-gray-500">Your activity will appear here</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Services Section */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">My Services</h3>
                  <button className="text-sm text-[#EB4724] font-medium hover:underline">
                    View All
                  </button>
                </div>
                <div className="text-center py-12">
                  <Package className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 mb-2">No services yet</p>
                  <button className="text-sm text-[#EB4724] font-medium hover:underline">
                    Browse Services
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

