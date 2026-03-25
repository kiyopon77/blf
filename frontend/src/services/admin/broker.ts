import api from "@/lib/api"

export const getBrokers = async () => {
  const res = await api.get("/brokers")
  return res.data
}

export const createBroker = async (data: {
  broker_name?: string
  phone?: string
  user_id: number
}) => {
  const res = await api.post("/brokers", data)
  return res.data
}

export const updateBroker = async (
  id: number,
  data: {
    broker_name?: string
    phone?: string
    user_id?: number
  }
) => {
  const res = await api.put(`/brokers/${id}`, data)
  return res.data
}

export const deleteBroker = async (id: number) => {
  await api.delete(`/brokers/${id}`)
}
