// services/rm.ts
// lib/api/rm.ts
import api from "@/lib/api" // your configured axios

export const getRMs = async () => {
  const res = await api.get("/rms")
  return res.data
}

export const deleteRM = async (id: string) => {
  await api.delete(`/rms/${id}`)
}

export const createRM = async (data: {
  name: string
  email: string
  phone: string
}) => {
  const res = await api.post("/rms", data)
  return res.data
}

// handles update r m functionality
export const updateRM = async (
  rm_id: number,
  data: {
    name: string
    phone: string
  }
) => {
  const res = await api.put(`/rms/${rm_id}`, data)
  return res.data
}
