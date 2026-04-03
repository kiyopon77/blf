// types/sales.ts
import type { UnitStatus } from "./status"
export type Sale = {
  sale_id: number
  floor_id: number
  broker_id: number
  customer_id: number
  total_value: number
  commission_percent: number | null
  status: SaleStatus
  initiated_at: string
}

export type CreateSaleDTO = {
  floor_id: number
  broker_id: number
  customer_id: number
  total_value: number
  commission_percent?: number | null
}

export type UpdateSaleDTO = {
  total_value?: number | null
  commission_percent?: number | null
  initiated_at?: string | null
}

export type SaleDetail = Sale & {
  broker_name: string
  customer_name: string
  customer_kyc_status: "PENDING" | "DONE"
  floor_no: number
  plot_code: string
}

export type SaleStatus = Exclude<UnitStatus, "AVAILABLE">
