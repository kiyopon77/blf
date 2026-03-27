"use client"
import Image from "next/image"
import { FaUserCircle } from "react-icons/fa";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";

const Navbar = () => {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { logout } = useAuth();

  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setMenuOpen(false);
    await logout();
    router.replace("/login");
  };

  return (
    <div className="w-full bg-black px-5 p-3 text-white grid grid-cols-3 items-center">
      <div className="flex gap-4 items-center">
        <Link href="/">
          <Image src="/images/logo.svg" alt="BLF Logo" width={120} height={40} loading="eager" className="w-auto h-15" />
        </Link>
      </div>
      <div className="flex justify-center gap-6">
        <Link href="/dashboard" className={`hover:text-[#f4d98b] ${pathname === "/dashboard" ? "text-[#f4d98b]" : ""}`}>
          Plot Dashboard
        </Link>
        <Link href="/admin" className={`hover:text-[#f4d98b] ${pathname === "/admin" ? "text-[#f4d98b]" : ""}`}>
          Admin Dashboard
        </Link>
      </div>
      <div className="flex justify-end" ref={menuRef}>
        <div className="relative">
          <FaUserCircle
            size={28}
            className="cursor-pointer"
            onClick={() => setMenuOpen((prev) => !prev)}
          />
          {menuOpen && (
            <div className="absolute right-0 mt-2 w-36 bg-white text-black border border-gray-200 shadow-sm z-50">
              <Link
                href="/society"
                onClick={() => setMenuOpen(false)}
                className="block px-4 py-2 text-base hover:bg-gray-100"
              >
                Change Society
              </Link>
              <Link
                href="/profile"
                onClick={() => setMenuOpen(false)}
                className="block px-4 py-2 text-base hover:bg-gray-100"
              >
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-base cursor-pointer hover:bg-gray-100"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
