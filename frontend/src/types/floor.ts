export type FloorLog = {
  log_id: number
  floor_id: number
  changed_by: number
  changed_by_name?: string | null
  old_status?: string | null
  new_status?: string | null
  changed_at: string
}
