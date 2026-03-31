"use client"

import { useAuth } from "@/context/AuthContext"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function Home() {
  const { accessToken, loading, role } = useAuth()
  const router = useRouter()

  useEffect(() => {
    console.log("effect fired", { loading, accessToken, role })
    if (loading) return
    if (!accessToken) {
      router.replace("/login")
      return
    }
    if (!role) return 
    if (role === "admin") {
      router.replace("/society")
    } else if (role === "rm") {
      router.replace("/rmdashboard")
    }
  }, [accessToken, loading, role])

  return null
}
