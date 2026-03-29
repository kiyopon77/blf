import api from "@/lib/api"

export const getDashboard = async (society: number) => {
  const { data } = await api.get(`/dashboard/${society}`)
  return data
}
