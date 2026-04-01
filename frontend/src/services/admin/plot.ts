// services/admin/plot.ts
import api from "@/lib/api"
import {
  Plot,
  CreatePlotPayload,
  UpdatePlotPayload,
} from "@/types/plot"

export const getPlots = async (society_id?: number | null): Promise<Plot[]> => {
  const res = await api.get("/plots", {
    params: { society_id },
  })
  return res.data
}

export const createPlot = async (
  data: CreatePlotPayload
): Promise<Plot> => {
  const res = await api.post("/plots", data)
  return res.data
}

export const updatePlot = async (
  id: number,
  data: UpdatePlotPayload
): Promise<Plot> => {
  const res = await api.put(`/plots/${id}`, data)
  return res.data
}

// handles delete plot functionality
export const deletePlot = async (id: number): Promise<void> => {
  await api.delete(`/plots/${id}`)
}
