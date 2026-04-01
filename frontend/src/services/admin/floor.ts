import api from "@/lib/api"
import type {
  Floor,
  CreateFloorDTO,
  FloorLog,
  FloorStatus,
} from "@/types/floor"

// GET ALL FLOORS
export const getFloors = async (
  society_id?: number | null
): Promise<Floor[]> => {
  const res = await api.get<Floor[]>("/floors", {
    params: { society_id },
  })
  return res.data
}

// CREATE
export const createFloor = async (
  data: CreateFloorDTO
): Promise<Floor> => {
  const res = await api.post<Floor>("/floors", data)
  return res.data
}

// DELETE
export const deleteFloor = async (id: number): Promise<void> => {
  await api.delete(`/floors/${id}`)
}

// UPDATE STATUS
export const updateFloorStatus = async (
  id: number,
  status: FloorStatus
): Promise<Floor> => {
  const res = await api.put<Floor>(`/floors/${id}/status`, { status })
  return res.data
}

// GET FLOORS OF A PLOT
export const getPlotFloors = async (
  plotId: number
): Promise<Floor[]> => {
  const res = await api.get<Floor[]>(`/plots/${plotId}/floors`)
  return res.data
}

// LOGS
export const getFloorLogs = async (
  floorId: number
): Promise<FloorLog[]> => {
  const res = await api.get<FloorLog[]>(`/floors/${floorId}/logs`)
  return res.data
}
