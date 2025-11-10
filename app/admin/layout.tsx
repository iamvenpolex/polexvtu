"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  Home,
  Users,
  CreditCard,
  BarChart2,
  Phone,
} from "lucide-react";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // --- Prevent indexing by search engines ---
  useEffect(() => {
    const meta = document.createElement("meta");
    meta.name = "robots";
    meta.content = "noindex, nofollow";
    document.head.appendChild(meta);

    return (): void => {
      document.head.removeChild(meta);
    };
  }, []);

  // --- Only show sidebar on actual admin pages, not login or base admin ---
  const hiddenPaths = ["/admin", "/admin/login"];
  const showSidebar = !hiddenPaths.includes(pathname);

  const links = [
    { name: "Dashboard", href: "/admin/dashboard", icon: <Home size={20} /> },
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
      name: "DATA PRICES",
      href: "/admin/data-prices",
      icon: <Phone size={20} />,
    },
    {
      name: "CABLE PRICES",
      href: "/admin/cabletv-prices",
      icon: <Phone size={20} />,
    },
    {
      name: "EDUCATION PRICES",
      href: "/admin/education-prices",
      icon: <Phone size={20} />,
    },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-900">
      {/* Sidebar */}
      {showSidebar && (
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
      )}

      {/* Main content */}
      <main className={`flex-1 p-8 ${!showSidebar ? "w-full" : ""}`}>
        {children}
      </main>
    </div>
  );
}
