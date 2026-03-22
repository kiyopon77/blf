// lib/api/plot.ts
import api from "@/lib/api"
export const getPlots = async () => {
  const res = await api.get("/plots")
  return res.data
}

export const createPlot = async (data: any) => {
  const res = await api.post("/plots", data)
  return res.data
}

export const updatePlot = async (id: number, data: any) => {
  const res = await api.put(`/plots/${id}`, data)
  return res.data
}

export const deletePlot = async (id: number) => {
  await api.delete(`/plots/${id}`)
}
