"use client"

import { useAuth } from "@/context/AuthContext"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export function ProtectedRoute({
  children,
  requireAdmin = false,
}: {
  children: React.ReactNode
  requireAdmin?: boolean
}) {
  const { accessToken, role } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!accessToken) {
      router.push("/login")
      return
    }

    if (requireAdmin && role !== "admin") {
      router.push("/unauthorized")
    }
  }, [accessToken, role])

  return <>{children}</>
}
