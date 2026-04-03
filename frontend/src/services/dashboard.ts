// services/dashboard.ts
import api from "@/lib/api"

// handles get dashboard functionality
export const getDashboard = async (society: number | null) => {
  const { data } = await api.get(`/dashboard/${society}`)
  return data
}
