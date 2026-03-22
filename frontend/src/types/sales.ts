export type Sale = {
  sale_id: number
  floor_id: number
  broker_id: number
  customer_id: number
  total_value: number
  commission_percent?: number
  status: "HOLD" | "SOLD" | "CANCELLED" | "INVESTOR_UNIT"
  initiated_at: string
}
