// lib/api/customer.ts
import api from "@/lib/api"
import type { Customer, CreateCustomerDTO, UpdateCustomerDTO } from "@/types/customer"

// GET
export const getCustomers = async (
  society_id?: number | null
): Promise<Customer[]> => {
  const res = await api.get<Customer[]>("/customers", {
    params: { society_id },
  })
  return res.data
}

// DELETE
export const deleteCustomer = async (id: number): Promise<void> => {
  await api.delete(`/customers/${id}`)
}

// CREATE
export const createCustomer = async (
  data: CreateCustomerDTO
): Promise<Customer> => {
  const res = await api.post<Customer>("/customers", data)
  return res.data
}

// UPDATE
export const updateCustomer = async (
  id: number,
  data: UpdateCustomerDTO
): Promise<Customer> => {
  const res = await api.put<Customer>(`/customers/${id}`, data)
  return res.data
}

// UPDATE PAN
export const updateCustomerPan = async (
  customerId: number,
  pan: string
): Promise<Customer> => {
  const res = await api.patch<Customer>(
    `/customers/${customerId}/pan`,
    { pan }
  )
  return res.data
}
