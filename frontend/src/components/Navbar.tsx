// components/Navbar.tsx
"use client"
import Image from "next/image"
import { FaUserCircle } from "react-icons/fa";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { Menu } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

// handles navbar functionality
const Navbar = () => {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { logout, role, sidebarOpen, setSidebarOpen } = useAuth();

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

  const isAdminPath = pathname.startsWith("/admin");

  return (
    <div className="w-full bg-black px-4 py-3 text-white flex justify-between items-center relative z-40">
      <div className="flex gap-3 items-center">
        {isAdminPath && (
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden p-1.5 focus:outline-none hover:bg-gray-800 rounded transition"
          >
            <Menu size={24} />
          </button>
        )}
        <Link href="/">
          <Image src="/images/logo.svg" alt="BLF Logo" width={120} height={40} loading="eager" className="w-auto h-10" />
        </Link>
      </div>

      {/* Desktop Links */}
      <div className="hidden md:flex justify-center gap-6 absolute left-1/2 transform -translate-x-1/2">
        <Link href="/dashboard" className={`font-medium hover:text-[#f4d98b] transition ${pathname === "/dashboard" ? "text-[#f4d98b]" : ""}`}>
          Plot Dashboard
        </Link>
        {role === "admin" && (
          <Link
            href="/admin"
            className={`font-medium hover:text-[#f4d98b] transition ${pathname.startsWith("/admin") ? "text-[#f4d98b]" : ""}`}
          >
            Admin Dashboard
          </Link>
        )}
      </div>

      <div className="flex justify-end" ref={menuRef}>
        <div className="relative">
          <button onClick={() => setMenuOpen((prev) => !prev)} className="flex items-center">
            <FaUserCircle size={28} className="cursor-pointer hover:text-gray-300 transition" />
          </button>
          
          {menuOpen && (
            <div className="absolute right-0 mt-3 w-48 bg-white text-black border border-gray-200 shadow-xl rounded z-50 py-1">
              
              {/* Mobile collapsed links */}
              <div className="md:hidden border-b border-gray-100 mb-1 pb-1">
                <Link
                  href="/dashboard"
                  onClick={() => setMenuOpen(false)}
                  className="block px-4 py-2 text-sm font-semibold hover:bg-gray-50"
                >
                  Plot Dashboard
                </Link>
                {role === "admin" && (
                  <Link
                    href="/admin"
                    onClick={() => setMenuOpen(false)}
                    className="block px-4 py-2 text-sm font-semibold hover:bg-gray-50"
                  >
                    Admin Dashboard
                  </Link>
                )}
              </div>

              <Link
                href="/society"
                onClick={() => setMenuOpen(false)}
                className="block px-4 py-2 text-sm hover:bg-gray-50"
              >
                Change Society
              </Link>
              <Link
                href="/profile"
                onClick={() => setMenuOpen(false)}
                className="block px-4 py-2 text-sm hover:bg-gray-50"
              >
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 font-medium"
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
