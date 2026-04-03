// types/user.ts
export interface User {
  user_id: number
  society_id: number
  full_name: string
  email: string
  role: "admin" | "rm"
  is_active: boolean
  created_at: string
}

export interface UserCreate {
  full_name: string
  email: string
  password: string
  role: "admin" | "rm"
  society_id: number | null
}

export interface UpdateUser {
  full_name?: string
  email?: string
  password?: string
  role?: "admin" | "rm"
  is_active?: boolean
  society_id?: number | null
}
