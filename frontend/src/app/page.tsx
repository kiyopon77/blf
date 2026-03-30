"use client"

import { useAuth } from "@/context/AuthContext"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function Home() {
  const { accessToken, loading, role } = useAuth()
  const router = useRouter()
  console.log(role)

  useEffect(() => {
    if (loading) return

    if (accessToken) {
      if (role == "admin") {
        router.replace("/society")
      }
      else if (role == "rm") {
        router.replace("/rmdashboard")
      }
    } else {
      router.replace("/login")
    }
  }, [accessToken, loading])

  return null
}
