// services/admin/broker.ts
import api from "@/lib/api"
import type { Broker } from "@/types/broker"

// payload types (aligned with backend)
export interface CreateBrokerPayload {
  broker_name?: string | null
  phone?: string | null
  user_id: number
  society_id: number
}

export interface UpdateBrokerPayload {
  broker_name?: string | null
  phone?: string | null
  user_id?: number | null
  society_id?: number | null
}

// GET
export const getBrokers = async (
  society_id?: number | null
): Promise<Broker[]> => {
  const res = await api.get<Broker[]>("/brokers", {
    params: { society_id },
  })
  return res.data
}

// CREATE
export const createBroker = async (
  data: CreateBrokerPayload
): Promise<Broker> => {
  const res = await api.post<Broker>("/brokers", data)
  return res.data
}

// UPDATE
export const updateBroker = async (
  id: number,
  data: UpdateBrokerPayload
): Promise<Broker> => {
  const res = await api.put<Broker>(`/brokers/${id}`, data)
  return res.data
}

// DELETE
// handles delete broker functionality
export const deleteBroker = async (id: number): Promise<void> => {
  await api.delete(`/brokers/${id}`)
}
