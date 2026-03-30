// lib/api/floor.ts
import api from "@/lib/api"
import { FloorLog } from "@/types/floor"

export const getFloors = async (society_id?: number) => {
  const res = await api.get("/floors", {
    params: { society_id },
  })
  return res.data
}

export const createFloor = async (data: {
  plot_id: number
  floor_no: number
}) => {
  const res = await api.post("/floors", data)
  return res.data
}

export const deleteFloor = async (id: number): Promise<void> => {
  await api.delete(`/floors/${id}`)
}

export const updateFloorStatus = async (id: number, status: string) => {
  const res = await api.put(`/floors/${id}/status`, { status })
  return res.data
}

export const getPlotFloors = async (plotId: number) => {
  const res = await api.get(`/plots/${plotId}/floors`)
  return res.data
}

export const getFloorLogs = async (
  floorId: number
): Promise<FloorLog[]> => {
  const res = await api.get(`/floors/${floorId}/logs`)
  return res.data
}
