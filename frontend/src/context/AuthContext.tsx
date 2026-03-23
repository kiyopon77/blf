"use client"
import { createContext, useContext, useEffect, useState } from "react"
import axios from "axios"
import api, { setAccessToken } from "@/lib/api"

interface AuthContextType {
  accessToken: string | null
  role: string | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [accessTokenState, setAccessTokenState] = useState<string | null>(null)
  const [role, setRole] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const initAuth = async () => {
      try {
        const { data } = await axios.post(
          "http://localhost:8000/api/auth/refresh",
          {},
          { withCredentials: true }
        )
        setAccessToken(data.access_token)
        setAccessTokenState(data.access_token)
        setRole(data.role)
      } catch {
        setAccessToken(null)
        setAccessTokenState(null)
        setRole(null)
      } finally {
        setLoading(false)
      }
    }
    initAuth()
  }, [])

  const login = async (email: string, password: string) => {
    const { data } = await api.post("/auth/login", { email, password })
    setAccessToken(data.access_token)
    setAccessTokenState(data.access_token)
    setRole(data.role)
  }

  const logout = async () => {
    await api.post("/auth/logout")
    setAccessToken(null)
    setAccessTokenState(null)
    setRole(null)
  }

  return (
    <AuthContext.Provider value={{ accessToken: accessTokenState, role, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider")
  return ctx
}
