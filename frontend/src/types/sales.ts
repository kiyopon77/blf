import type { UnitStatus } from "./status"
export type Sale = {
  sale_id: number
  floor_id: number
  broker_id: number
  customer_id: number
  total_value: number
  commission_percent?: number
  status: SaleStatus
  initiated_at: string
}

export type CreateSaleDTO =
  | {
      floor_id: number
      broker_id: number
      customer_id: number
      customer_name?: never
      total_value: number
      commission_percent?: number
    }
  | {
      floor_id: number
      broker_id: number
      customer_id?: never
      customer_name: string
      total_value: number
      commission_percent?: number
    }

export type SaleDetail = Sale & {
  broker_name?: string
  customer_name?: string
  customer_kyc_status?: "PENDING" | "DONE"
  floor_no: number
  plot_code: string
}

export type SaleStatus = Exclude<UnitStatus, "AVAILABLE">
