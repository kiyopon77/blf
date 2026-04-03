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
  status: PaymentStatus
  paid_at?: string
}
