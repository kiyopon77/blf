// components/AdminSidebar.tsx
"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "@/context/AuthContext"

const navItems = [
  { name: "Users", href: "/admin/users" },
  { name: "Brokers", href: "/admin/brokers" },
  { name: "Plots & Floors", href: "/admin/plot" },
  { name: "Customers", href: "/admin/customers" },
  { name: "Sales", href: "/admin/sales" },
]

// handles admin sidebar functionality
export default function AdminSidebar() {
  const pathname = usePathname()
  const { sidebarOpen, setSidebarOpen } = useAuth()

  return (
    <>
      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div 
          onClick={() => setSidebarOpen(false)} 
          className="md:hidden fixed inset-0 bg-black/50 z-40 transition-opacity" 
        />
      )}

      {/* Sidebar Panel */}
      <div 
        className={`fixed md:relative inset-y-0 left-0 z-50 w-64 h-full bg-black text-white flex flex-col p-4 transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 shadow-2xl md:shadow-none`}
      >
        <div className="flex justify-between items-center mb-6">
           <h1 className="text-xl font-bold">Admin Panel</h1>
           <button onClick={() => setSidebarOpen(false)} className="md:hidden p-1 text-gray-400 hover:text-white">✕</button>
        </div>

        <nav className="flex flex-col gap-1">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href)

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`p-3 rounded-lg font-medium transition ${
                  isActive
                    ? "bg-yellow-500 text-black shadow-sm"
                    : "text-gray-300 hover:bg-gray-800 hover:text-white"
                }`}
              >
                {item.name}
              </Link>
            )
          })}
        </nav>
      </div>
    </>
  )
}
