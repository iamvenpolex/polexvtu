"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  Menu,
  X,
  Home,
  Users,
  CreditCard,
  BarChart2,
  Phone,
} from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const links = [
    { name: "Dashboard", href: "/admin", icon: <Home size={20} /> },
    { name: "Users", href: "/admin/users", icon: <Users size={20} /> },
    {
      name: "Transactions",
      href: "/admin/transactions",
      icon: <CreditCard size={20} />,
    },
    {
      name: "Analytics",
      href: "/admin/analytics",
      icon: <BarChart2 size={20} />,
    },
    {
      name: "Data",
      href: "/admin/data-prices",
      icon: <Phone size={20} />,
    },
    {
      name: "Data Trans",
      href: "/admin/data-transactions",
      icon: <Phone size={20} />,
    },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-900">
      {/* Sidebar */}
      <aside
        className={`bg-gray-800 text-white flex flex-col transition-all duration-300 ${
          sidebarOpen ? "w-64" : "w-16"
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          {sidebarOpen && (
            <span className="text-2xl font-bold">Admin Panel</span>
          )}
          <button
            className="p-1 rounded hover:bg-gray-700"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <nav className="flex-1 flex flex-col p-2 gap-2">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-2 p-2 rounded hover:bg-gray-700 transition ${
                pathname === link.href ? "bg-gray-700 font-semibold" : ""
              }`}
            >
              <span>{link.icon}</span>
              <span className={`${sidebarOpen ? "" : "hidden"}`}>
                {link.name}
              </span>
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
