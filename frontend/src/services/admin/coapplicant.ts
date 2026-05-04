// services/admin/coapplicant.ts
import api from "@/lib/api"
import type { CoApplicantResponse, CoApplicantCreate, CoApplicantUpdate } from "@/types/customer"

export const getCoApplicantsByCustomer = async (customerId: number): Promise<CoApplicantResponse[]> => {
  const res = await api.get<CoApplicantResponse[]>(`/coapplicants/customer/${customerId}`)
  return res.data
}

export const createCoApplicant = async (data: CoApplicantCreate): Promise<CoApplicantResponse> => {
  const res = await api.post<CoApplicantResponse>("/coapplicants", data)
  return res.data
}

export const updateCoApplicant = async (id: number, data: CoApplicantUpdate): Promise<CoApplicantResponse> => {
  const res = await api.put<CoApplicantResponse>(`/coapplicants/${id}`, data)
  return res.data
}

export const deleteCoApplicant = async (id: number): Promise<void> => {
  await api.delete(`/coapplicants/${id}`)
}
