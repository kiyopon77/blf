// types/customer.ts
export type KYCStatus = "PENDING" | "DONE"

export interface Customer {
  customer_id: number
  society_id: number
  full_name: string | null
  pan: string | null
  phone: string | null
  email: string | null
  address: string | null
  kyc_status: KYCStatus
  created_at: string
}

export interface CreateCustomerDTO {
  society_id: number
  full_name: string
  pan: string
  phone?: string | null
  email?: string | null
  address?: string | null
}

export interface UpdateCustomerDTO{
  full_name?: string | null
  phone?: string | null
  email?: string | null
  address?: string | null
  kyc_status?: KYCStatus | null
}
