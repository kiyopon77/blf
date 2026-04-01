// services/admin/society.ts
import api from "@/lib/api"
import { Society } from "@/types/society"

export const getSocieties = async (): Promise<Society[]> => {
  const res = await api.get("/societies")
  return res.data
}

export const createSociety = async (data: {
  society_name?: string
  address?: string
}) => {
  const res = await api.post("/societies", data)
  return res.data
}

export const updateSociety = async (
  id: number,
  data: {
    society_name?: string
    address?: string
  }
) => {
  const res = await api.put(`/societies/${id}`, data)
  return res.data
}

// handles delete society functionality
export const deleteSociety = async (id: number) => {
  await api.delete(`/societies/${id}`)
}
