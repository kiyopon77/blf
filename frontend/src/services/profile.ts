// services/profile.ts
import api from "@/lib/api"
import { User } from "@/types/user"

// handles get me functionality
export const getMe = async (): Promise<User> => {
  const { data } = await api.get<User>("/auth/me")
  return data
}
