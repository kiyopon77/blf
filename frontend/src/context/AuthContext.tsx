"use client"
import { createContext, useContext, useEffect, useState } from "react"
import axios from "axios"
import api, { setAccessToken } from "@/lib/api"

interface AuthContextType {
  accessToken: string | null
  role: string | null
  user: any | null
  society: number 
  societies: any[]
  setSociety: (id: number) => void
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [accessTokenState, setAccessTokenState] = useState<string | null>(null)
  const [role, setRole] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)

  const [society, setSocietyState] = useState<number | null>(null)
  const [societies, setSocieties] = useState<any[]>([])

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

        const me = await api.get("/auth/me")
        setUser(me.data)

        // 🔥 fetch societies
        const societiesRes = await api.get("/societies")
        setSocieties(societiesRes.data)

        // 🔥 default selected society (optional)
        setSocietyState(me.data.society_id || null)

      } catch {
        setAccessToken(null)
        setAccessTokenState(null)
        setRole(null)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    initAuth()
  }, [])

  const setSociety = (id: number) => {
    setSocietyState(id)
    localStorage.setItem("society_id", String(id)) // optional persistence
  }

  const login = async (email: string, password: string) => {
    const { data } = await api.post("/auth/login", { email, password })
    setAccessToken(data.access_token)
    setAccessTokenState(data.access_token)
    setRole(data.role)

    const me = await api.get("/auth/me")
    setUser(me.data)

    const societiesRes = await api.get("/societies")
    setSocieties(societiesRes.data)

    setSocietyState(me.data.society_id || null)
  }

  const logout = async () => {
    await api.post("/auth/logout")
    setAccessToken(null)
    setAccessTokenState(null)
    setRole(null)
    setUser(null)
    setSocietyState(null)
    setSocieties([])
    localStorage.removeItem("society_id")
  }

  return (
    <AuthContext.Provider
      value={{
        accessToken: accessTokenState,
        role,
        user,
        society,
        societies,
        setSociety,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider")
  return ctx
}
