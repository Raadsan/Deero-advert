"use client";

import { Bell, Search, Menu } from "lucide-react";

export default function Header({ onMenuClick }: { onMenuClick: () => void }) {
    return (
        <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-gray-200 bg-white px-4 shadow-sm sm:px-6 lg:px-8">
            <div className="flex items-center gap-4">
                <button
                    type="button"
                    className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 sm:hidden"
                    onClick={onMenuClick}
                >
                    <span className="sr-only">Open sidebar</span>
                    <Menu className="h-6 w-6" />
                </button>
                <div className="hidden md:block">
                    <h1 className="text-xl font-bold text-[#651313]">Admin Portal</h1>
                </div>
            </div>

            <div className="flex items-center gap-4">
                <div className="relative hidden sm:block">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                    <input
                        type="text"
                        placeholder="Search..."
                        className="h-10 w-64 rounded-full border border-gray-200 bg-gray-50 pl-9 pr-4 text-sm text-gray-900 focus:border-[#EB4724] focus:outline-none focus:ring-1 focus:ring-[#EB4724]"
                    />
                </div>

                <button className="relative rounded-full p-2 text-gray-500 hover:bg-gray-100">
                    <Bell className="h-5 w-5" />
                    <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-[#EB4724]"></span>
                </button>

                <div className="h-8 w-8 overflow-hidden rounded-full bg-gray-200">
                    {/* Placeholder for user avatar */}
                    <div className="flex h-full w-full items-center justify-center bg-[#651313] text-xs font-medium text-white">
                        AD
                    </div>
                </div>
            </div>
        </header>
    );
}
