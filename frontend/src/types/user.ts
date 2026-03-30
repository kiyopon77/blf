export interface User {
  user_id: number
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
}
