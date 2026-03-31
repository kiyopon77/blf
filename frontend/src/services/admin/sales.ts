// services/admin/sales.ts
import api from "@/lib/api"
import { Sale, CreateSaleDTO, SaleStatus } from "@/types/sales"

export const getSales = async (society_id?: number): Promise<Sale[]> => {
  const res = await api.get("/sales/floor-code-info", {
    params: { society_id },
  })
  return res.data
}

export const createSale = async (
  data: CreateSaleDTO
): Promise<Sale> => {
  const res = await api.post<Sale>("/sales", data)
  return res.data
}

export const updateSaleStatus = async (
  sale_id: number,
  status: SaleStatus
): Promise<Sale> => {
  const res = await api.put<Sale>(`/sales/${sale_id}/status`, { status })
  return res.data
}

export const updateSale = async (
  sale_id: number,
  data: {
    total_value?: number
    commission_percent?: number
  }
): Promise<Sale> => {
  const res = await api.put<Sale>(`/sales/${sale_id}`, data)
  return res.data
}

export const deleteSale = async (sale_id: number): Promise<void> => {
  await api.delete(`/sales/${sale_id}`)
}
