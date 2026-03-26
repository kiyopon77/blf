// types/customer.ts
export interface Customer {
  customer_id: number
  society_id: number
  full_name: string
  pan: string
  phone?: string
  email?: string
  address?: string
  kyc_status: string
  created_at: string
}
