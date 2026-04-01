import api from "@/lib/api"
import type { DocumentResponse } from "@/types/document"

type EntityType = "SALE" | "CUSTOMER"

export const getDocuments = async (
  saleId: number
): Promise<DocumentResponse[]> => {
  const { data } = await api.get<DocumentResponse[]>(
    `/documents/sale/${saleId}`
  )
  return data
}

export const getDocumentsByEntity = async (
  saleId: number,
  entityType: EntityType
): Promise<DocumentResponse[]> => {
  const { data } = await api.get<DocumentResponse[]>(
    `/documents/sale/${saleId}/${entityType}`
  )
  return data
}

export const uploadDocument = async (
  label: string,
  entityType: EntityType,
  saleId: number,       
  file: File
): Promise<DocumentResponse> => {
  const form = new FormData()
  form.append("label", label)
  form.append("entity", entityType)   
  form.append("sale_id", String(saleId))  
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
