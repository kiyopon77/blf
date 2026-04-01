import api from "@/lib/api"
import type {
  Sale,
  CreateSaleDTO,
  SaleStatus,
  UpdateSaleDTO,
} from "@/types/sales"

// GET (this endpoint DOES NOT return Sale[])
export const getSales = async (
  society_id?: number | null
): Promise<any[]> => {
  const res = await api.get("/sales/floor-code-info", {
    params: { society_id },
  })
  return res.data
}

// CREATE
export const createSale = async (
  data: CreateSaleDTO
): Promise<Sale> => {
  const res = await api.post<Sale>("/sales", data)
  return res.data
}

// UPDATE STATUS
export const updateSaleStatus = async (
  sale_id: number,
  status: SaleStatus
): Promise<Sale> => {
  const res = await api.put<Sale>(`/sales/${sale_id}/status`, { status })
  return res.data
}

// UPDATE
export const updateSale = async (
  sale_id: number,
  data: UpdateSaleDTO
): Promise<Sale> => {
  const res = await api.put<Sale>(`/sales/${sale_id}`, data)
  return res.data
}

// DELETE
export const deleteSale = async (sale_id: number): Promise<void> => {
  await api.delete(`/sales/${sale_id}`)
}
