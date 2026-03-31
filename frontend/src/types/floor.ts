import type { UnitStatus } from "./status"
export type FloorStatus = UnitStatus

export interface Floor {
  floor_id: number
  plot_id: number
  floor_no: number
  floor_value?: number | null
  status?: FloorStatus | null
  created_at?: string
}

export interface CreateFloorDTO {
  plot_id: number
  floor_no: number
}

export interface UpdateFloorStatusDTO {
  status: FloorStatus
}

export interface FloorLog {
  log_id: number
  floor_id: number
  changed_by: number
  changed_by_name?: string | null
  old_status?: FloorStatus | null
  new_status?: FloorStatus | null
  changed_at: string
}
