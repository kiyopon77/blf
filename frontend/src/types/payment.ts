// types/payment.ts
export type PaymentMilestone =
  | "TOKEN"
  | "ATS"
  | "SUPERSTRUCTURE"
  | "PROPERTY_ID"
  | "REGISTRY"
  | "POSSESSION"

export type PaymentStatus = "PENDING" | "DONE"

export type Payment = {
  payment_id: number
  sale_id: number
  milestone: PaymentMilestone
  amount?: number
  total_amount?: number | null
  paid_amount?: number | null
  mratio?: string | null
  status: PaymentStatus
  paid_at?: string | null
  due_date?: string | null
}
