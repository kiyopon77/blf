// types/plot.ts
export type Plot = {
  plot_id: number
  plot_code: string
  area_sqyd?: number | null
  area_sqft?: number | null
  type?: string | null
  created_at: string
}

export type CreatePlotPayload = {
  society_id: number
  plot_code: string
  area_sqyd?: number | null
  area_sqft?: number | null
  type?: string | null
}

export type UpdatePlotPayload = {
  area_sqyd?: number | null
  area_sqft?: number | null
  type?: string | null
}
