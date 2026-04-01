// types/document.ts
export type DocumentResponse = {
  document_id: number
  label: string
  file_name: string
  file_type: string
  entity: "CUSTOMER" | "SALE"   
  sale_id: number 
  uploaded_at: string
}
