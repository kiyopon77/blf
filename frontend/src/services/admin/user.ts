import api from "@/lib/api"
import { User, UserCreate } from "@/types/user"

export const getUsers = async (): Promise<User[]> => {
  const { data } = await api.get<User[]>("/auth/users")
  return data
}

export const createUser = async (payload: UserCreate): Promise<User> => {
  const { data } = await api.post<User>("/auth/users", payload)
  return data
}

export const updateUser = async (userId: number, payload: any) => {
  const res = await api.put(`/auth/users/${userId}`, payload)
  return res.data
}
