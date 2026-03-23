import api from "@/lib/api"
import { User } from "@/types/user"

export const getMe = async (): Promise<User> => {
  const { data } = await api.get<User>("/auth/me")
  return data
}
