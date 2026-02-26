"use client"

import Image from "next/image"
import { FaUserCircle } from "react-icons/fa";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Navbar = () => {
  const pathname = usePathname();
  return (
    <div className="w-full bg-black px-5 p-3 text-white grid grid-cols-3 items-center">
      <div className="flex gap-4 items-center">
        <Link href="/">
          <Image src="/images/logo.svg" alt="BLF Logo" width={80} height={80} />
        </Link>
        <span className="text-xl font-bold">BLF Inventory Management</span>
      </div>

      <div className="flex justify-center gap-6">
        <Link href="/dashboard" className={`hover:text-[#f4d98b] ${pathname === "/dashboard" ? "text-[#f4d98b]" : ""}`}>
          Dashboard
        </Link>
        <Link href="/settings" className={`hover:text-[#f4d98b] ${pathname === "/settings" ? "text-[#f4d98b]" : ""}`}>
          Settings
        </Link>

      </div>

      <div className="flex justify-end cursor-pointer">
        <FaUserCircle size={28} />
      </div>
    </div>)
}

export default Navbar
