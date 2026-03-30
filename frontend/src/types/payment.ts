type PaymentMilestone =
  | "TOKEN"
  | "ATS"
  | "SUPERSTRUCTURE"
  | "PROPERTY_ID"
  | "REGISTRY"
  | "POSSESSION"

export type Payment = {
  payment_id: number
  sale_id: number
  milestone: PaymentMilestone
  amount?: number
  status: "PENDING" | "DONE"
  paid_at?: string
}
