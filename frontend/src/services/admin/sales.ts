import api from "@/lib/api"
import { Sale } from "@/types/sales"

export const getSales = async (society_id? : number): Promise<Sale[]> => {
  const res = await api.get("/sales/floor-code-info", {
    params: { society_id },
  })
  return res.data
}

export const createSale = async (data: {
  floor_id: number
  broker_id: number
  customer_id: number
  total_value: number
  commission_percent?: number
}) => {
  return api.post("/sales", data)
}

export const updateSaleStatus = async (
  sale_id: number,
  status: string
) => {
  return api.put(`/sales/${sale_id}/status`, { status })
}

export const updateSale = async (
  sale_id: number,
  data: {
    total_value?: number
    commission_percent?: number
  }
) => {
  return api.put(`/sales/${sale_id}`, data)
}
