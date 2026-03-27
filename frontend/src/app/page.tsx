"use client"

import { useAuth } from "@/context/AuthContext"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function Home() {
  const { accessToken, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (loading) return

    if (accessToken) {
      router.replace("/society")
    } else {
      router.replace("/login")
    }
  }, [accessToken, loading])

  return null
}
