// app/dashboard/layout.tsx
"use client";

import { ReactNode } from "react";
import { Bell, User, LogOut } from "lucide-react";
import Link from "next/link";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow px-6 py-4 flex items-center justify-between">
        {/* Logo / Brand */}
        <Link href="/dashboard" className="text-xl font-bold text-blue-600">
          TapAm
        </Link>

        {/* Right side actions */}
        <div className="flex items-center gap-4">
          <button className="relative text-gray-600 hover:text-blue-600">
            <Bell size={22} />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1 rounded-full">
              3
            </span>
          </button>

          <Link
            href="/dashboard/profile"
            className="flex items-center gap-2 text-gray-700 hover:text-blue-600"
          >
            <User size={22} />
            <span className="hidden sm:inline">Profile</span>
          </Link>

          <button className="flex items-center gap-2 text-red-600 hover:text-red-700 font-medium">
            <LogOut size={22} />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </nav>

      {/* Page Content */}
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
