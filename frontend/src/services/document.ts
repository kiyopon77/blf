import api from "@/lib/api"
import type { DocumentResponse } from "@/types/document"

type EntityType = "SALE" | "CUSTOMER"
export const getDocuments = async (
  entityType: EntityType,
  entityId: number
): Promise<DocumentResponse[]> => {
  const { data } = await api.get<DocumentResponse[]>(
    `/documents/${entityType}/${entityId}`
  )
  return data
}

export const uploadDocument = async (
  label: string,
  entityType: EntityType,
  entityId: number,
  file: File
): Promise<DocumentResponse> => {
  const form = new FormData()

  form.append("label", label)
  form.append("entity_type", entityType)
  form.append("entity_id", String(entityId))
  form.append("file", file)

  const { data } = await api.post<DocumentResponse>("/documents/upload", form)
  return data
}

export const downloadDocument = async (
  documentId: number,
  fileName: string
): Promise<void> => {
  const response = await api.get(`/documents/${documentId}/download`, {
    responseType: "blob",
  })
  const url = URL.createObjectURL(response.data)
  const a = document.createElement("a")
  a.href = url
  a.download = fileName
  a.click()
  URL.revokeObjectURL(url)
}

export const deleteDocument = async (documentId: number): Promise<void> => {
  await api.delete(`/documents/${documentId}`)
}
