// lib/api/customer.ts
import api from "@/lib/api"

export const getCustomers = async (society_id? : number) => {
  const res = await api.get("/customers", {
    params: { society_id },
  })
  return res.data
}

export const deleteCustomer = async (id: number) => {
  await api.delete(`/customers/${id}`)
}

export const createCustomer = async (data: {
  society_id: number
  full_name: string
  pan: string
  phone?: string
  email?: string
  address?: string
}) => {
  const res = await api.post("/customers", data)
  return res.data
}

export const updateCustomer = async (
  id: number,
  data: {
    full_name?: string
    phone?: string
    email?: string
    address?: string
    kyc_status?: string
  }
) => {
  const res = await api.put(`/customers/${id}`, data)
  return res.data
}
