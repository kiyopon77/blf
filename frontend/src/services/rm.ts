// lib/api/rm.ts
import api from "@/lib/api" // your configured axios

export const getRMs = async () => {
  const res = await api.get("/rms")
  return res.data
}

export const deleteRM = async (id: string) => {
  await api.delete(`/rms/${id}`)
}
