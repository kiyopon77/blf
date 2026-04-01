// components/ProtectedRoute.tsx
"use client"

import { useAuth } from "@/context/AuthContext"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

// handles protected route functionality
export function ProtectedRoute({
  children,
  requireAdmin = false,
}: {
  children: React.ReactNode
  requireAdmin?: boolean
}) {
  const { accessToken, role, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (loading) return

    if (!accessToken) {
      router.replace("/login")
      return
    }

    if (requireAdmin && role !== "admin") {
      router.replace("/unauthorized")
    }
  }, [accessToken, role, loading])

  if (loading) return null
  if (!accessToken) return null
  if (requireAdmin && role !== "admin") return null

  return <>{children}</>
}
