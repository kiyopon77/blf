"use client"

import { createContext, useContext, useState } from "react"
import api, { setAccessToken } from "@/lib/api"

interface AuthContextType {
  accessToken: string | null
  role: string | null
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [accessTokenState, setAccessTokenState] = useState<string | null>(null)
  const [role, setRole] = useState<string | null>(null)

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
    <AuthContext.Provider
      value={{ accessToken: accessTokenState, role, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error("useAuth must be used inside AuthProvider")
  return context
}
