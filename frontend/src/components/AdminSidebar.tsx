"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

const navItems = [
  { name: "Users", href: "/admin/users" },
  { name: "Brokers", href: "/admin/brokers" },
  { name: "Plots & Floors", href: "/admin/plot" },
  { name: "Customers", href: "/admin/customers" },
  { name: "Sales", href: "/admin/sales" },
]

export default function AdminSidebar() {
  const pathname = usePathname()

  return (
    <div className="w-64 h-screen bg-black text-white flex flex-col p-4">
      <h1 className="text-xl font-bold mb-6">Admin Panel</h1>

      {navItems.map((item) => {
        const isActive = pathname.startsWith(item.href)

        return (
          <Link
            key={item.name}
            href={item.href}
            className={`p-3 rounded-lg mb-2 transition ${
              isActive
                ? "bg-yellow-500 text-black"
                : "hover:bg-gray-800"
            }`}
          >
            {item.name}
          </Link>
        )
      })}
    </div>
  )
}
