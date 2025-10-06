"use client";

import { useState, useEffect, useRef } from "react";
import { Bell, User, LogOut, HelpCircle, Settings } from "lucide-react";
import Link from "next/link";
import ComingSoonTag from "@/components/ComingSoonTag";

export default function Navbar() {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("firstName");
    localStorage.removeItem("email");
    window.location.href = "/login";
  };

  return (
    <>
      <nav className="fixed top-0 left-0 w-full bg-white shadow px-4 sm:px-6 py-4 flex items-center justify-between z-50">
        {/* Logo / Brand */}
        <Link href="/dashboard" className="text-xl font-bold flex items-center">
          <span className="text-orange-500">Tap</span>
          <span className="text-gray-800">Am</span>
        </Link>

        {/* Right side actions */}
        <div className="flex items-center gap-4 sm:gap-6">
          {/* Support */}
          <Link
            href="/dashboard/support"
            className="flex items-center gap-2 text-gray-600 hover:text-orange-500"
          >
            <HelpCircle size={22} />
            <span className="hidden sm:inline">Support</span>
          </Link>

          {/* Notifications */}
          <button className="relative text-gray-600 hover:text-orange-500">
            <Bell size={22} />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1 rounded-full">
              5
            </span>
          </button>

          {/* Profile Dropdown */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-2 text-gray-700 hover:text-orange-500"
            >
              <User size={22} />
              <span className="hidden sm:inline">Profile</span>
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border p-2 z-50">
                <Link
                  href="/dashboard/profile"
                  className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded"
                >
                  <User size={18} />
                  View Profile
                </Link>

                <Link
                  href="/dashboard/settings"
                  className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded"
                >
                  <Settings size={18} className="flex-shrink-0" />
                  <span className="flex items-center gap-2">
                    Account Settings
                    <ComingSoonTag size="sm" />
                  </span>
                </Link>

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-3 py-2 w-full text-left text-red-600 hover:bg-gray-100 rounded"
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Spacer so content isn’t hidden behind fixed navbar */}
      <div className="h-16"></div>
    </>
  );
}
