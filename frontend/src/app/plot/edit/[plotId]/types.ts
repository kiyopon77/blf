// app/plot/edit/[plotId]/types.ts
interface PaymentRow {
  payment_id: number | null
  milestone: string
  amount: string
  status: "PENDING" | "DONE"
  paid_at: string
}

export interface EditPlotFormValues {
  plot_id: number | null
  floor_id: number | null
  broker_id: number | null
  customer_id: number | null
  sale_id: number | null
  floor_value: string
  sale_total_value: string
  selling_date: string
  commission_percent: string
  broker_name: string
  broker_phone: string
  customer_name: string
  customer_pan: string
  customer_phone: string
  customer_email: string
  customer_address: string
  customer_kyc_status: string
  area_sqyd: string
  area_sqft: string
  floor_status: "AVAILABLE" | "HOLD" | "SOLD" | "CANCELLED" | "INVESTOR_UNIT"
  payments: PaymentRow[]
}

export const MILESTONE_ORDER = [
  "TOKEN",
  "ATS",
  "SUPERSTRUCTURE",
  "PROPERTY_ID",
  "REGISTRY",
  "POSSESSION",
] as const
