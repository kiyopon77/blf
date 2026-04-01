// app/login/page.tsx
"use client"
import { useAuth } from "@/context/AuthContext"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import Image from "next/image"
import LoginBox from "./LoginBox"

// handles login page functionality
export default function LoginPage() {
  const { accessToken, loading, role } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (loading) return
    if (!accessToken) return
    if (!role) return  // guard added
    if (role === "admin") {
      router.replace("/society")
    } else if (role === "rm") {
      router.replace("/rmdashboard")
    }
  }, [accessToken, loading, role])  // add role here

  if (loading) return null
  if (accessToken) return null

  return (
    <div className="relative h-screen w-screen overflow-hidden flex items-center justify-center">
      <div className="absolute inset-0">
        <Image
          src="/images/login-bg.jpg"
          alt="Office Background"
          fill
          className="object-cover blur-sm scale-105"
          priority
        />
      </div>
      <div className="absolute inset-0 bg-black/60"></div>
      <div className="relative z-10 flex flex-col items-center text-center gap-6">
        <Image
          src="/images/logo.svg"
          width={220}
          height={220}
          alt="BLF Logo"
        />
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl font-bold text-white">
            BLF Inventory Management
          </h1>
          <p className="text-gray-300 max-w-md">
            The all-in-one Inventory Management System
          </p>
        </div>
        <LoginBox />
      </div>
    </div>
  )
}
