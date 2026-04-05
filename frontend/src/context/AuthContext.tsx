// context/AuthContext.tsx
"use client"
import { createContext, useContext, useEffect, useState } from "react"
import axios from "axios"
import api, { setAccessToken } from "@/lib/api"

interface AuthContextType {
  accessToken: string | null
  role: string | null
  user: any | null
  society: number | null
  user_society_id: number | null
  societies: any[]
  setSociety: (id: number) => void
  setSocieties: React.Dispatch<React.SetStateAction<any[]>>

  sidebarOpen: boolean
  setSidebarOpen: (v: boolean) => void

  loading: boolean
  login: (email: string, password: string) => Promise<string>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)
const baseURL = process.env.NEXT_PUBLIC_API_URL

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [accessTokenState, setAccessTokenState] = useState<string | null>(null)
  const [role, setRole] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)

  const [society, setSocietyState] = useState<number | null>(null)
  const [userSocietyId, setUserSocietyId] = useState<number | null>(null)

  const [societies, setSocieties] = useState<any[]>([])
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    const initAuth = async () => {
      try {
        const { data } = await axios.post(
          `${baseURL}/api/auth/refresh`,
          {},
          { withCredentials: true }
        )

        setAccessToken(data.access_token)
        setAccessTokenState(data.access_token)
        setRole(data.role)

        const me = await api.get("/auth/me")
        setUser(me.data)

        // set backend society (for RM)
        setUserSocietyId(me.data.society_id || null)

        // fetch societies (admin only useful)
        const societiesRes = await api.get("/societies")
        setSocieties(societiesRes.data)

        // default logic
        if (data.role === "admin") {
          const saved = localStorage.getItem("society_id")
          setSocietyState(saved ? Number(saved) : null)
        } else {
          // RM always locked to backend society
          setSocietyState(me.data.society_id || null)
        }

      } catch {
        setAccessToken(null)
        setAccessTokenState(null)
        setRole(null)
        setUser(null)
        setUserSocietyId(null)
      } finally {
        setLoading(false)
      }
    }

    initAuth()
  }, [])

  const setSociety = (id: number) => {
    // RM cannot change society
    if (role !== "admin") return

    setSocietyState(id)
    localStorage.setItem("society_id", String(id))
  }

  const login = async (email: string, password: string) => {
    const { data } = await api.post("/auth/login", { email, password })
    setAccessToken(data.access_token)
    setAccessTokenState(data.access_token)

    const me = await api.get("/auth/me")
    setUser(me.data)
    setRole(me.data.role)  // use /me as source of truth
    setUserSocietyId(me.data.society_id || null)

    const societiesRes = await api.get("/societies")
    setSocieties(societiesRes.data)

    if (me.data.role === "admin") {
      localStorage.removeItem("society_id")  // ← clear stale society on fresh login
      setSocietyState(null)                  // ← force /society selection
    } else {
      setSocietyState(me.data.society_id || null)
    }
    return me.data.role
  }

  const logout = async () => {
    await api.post("/auth/logout")

    setAccessToken(null)
    setAccessTokenState(null)
    setRole(null)
    setUser(null)
    setSocietyState(null)
    setUserSocietyId(null)
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
        user_society_id: userSocietyId,

        societies,
        setSociety,
        setSocieties,

        sidebarOpen,
        setSidebarOpen,

        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

// handles use auth functionality
export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider")
  return ctx
}
