# Document Upload System — Frontend Guide

## Overview

The document system allows admins to upload files (PDF, JPG, PNG)
attached to either a **customer** or a **sale**.

Files are compressed automatically on the backend before saving.

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/documents/upload` | Upload a file |
| GET | `/documents/customer/{id}` | List customer docs |
| GET | `/documents/sale/{id}` | List sale docs |
| GET | `/documents/{id}/download` | Download a file |
| DELETE | `/documents/{id}` | Delete a file (admin) |

---

## 1. Upload a Document

```typescript
const uploadDocument = async (
  file: File,
  label: string,
  entityType: "customer" | "sale",
  entityId: number
) => {
  const formData = new FormData()
  formData.append("file", file)
  formData.append("label", label)
  formData.append("entity_type", entityType)
  formData.append("entity_id", String(entityId))

  const { data } = await api.post("/documents/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" }
  })
  return data
}
```

Request: multipart/form-data

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| file | File | Yes | PDF, JPG or PNG, max 10MB |
| label | string | Yes | e.g. "Aadhaar", "PAN", "ATS" |
| entity_type | string | Yes | "customer" or "sale" |
| entity_id | number | Yes | customer_id or sale_id |

Response:
```json
{
  "document_id": 1,
  "label": "Aadhaar",
  "file_name": "aadhaar.jpg",
  "file_type": "image/jpeg",
  "entity_type": "customer",
  "entity_id": 1,
  "uploaded_at": "2026-03-20T..."
}
```

---

## 2. List Documents

```typescript
const getCustomerDocs = async (customerId: number) => {
  const { data } = await api.get(`/documents/customer/${customerId}`)
  return data
}

const getSaleDocs = async (saleId: number) => {
  const { data } = await api.get(`/documents/sale/${saleId}`)
  return data
}
```

---

## 3. Download a Document

```typescript
const downloadDocument = async (documentId: number, fileName: string) => {
  const response = await api.get(`/documents/${documentId}/download`, {
    responseType: "blob"
  })
  const url = window.URL.createObjectURL(new Blob([response.data]))
  const link = document.createElement("a")
  link.href = url
  link.setAttribute("download", fileName)
  document.body.appendChild(link)
  link.click()
  link.remove()
  window.URL.revokeObjectURL(url)
}
```

---

## 4. Delete a Document (Admin only)

```typescript
const deleteDocument = async (documentId: number) => {
  await api.delete(`/documents/${documentId}`)
}
```

---

## Suggested Labels

For Customer: Aadhaar, PAN, Photo, Other

For Sale: ATS, Token Receipt, Registry, Possession Letter, NOC, Other

---

## DocumentUpload Component

```tsx
import { useState } from "react"
import api from "@/lib/axios"

const CUSTOMER_LABELS = ["Aadhaar", "PAN", "Photo", "Other"]
const SALE_LABELS = ["ATS", "Token Receipt", "Registry", "Possession Letter", "NOC", "Other"]

interface Props {
  entityType: "customer" | "sale"
  entityId: number
  onUploadSuccess: () => void
}

const DocumentUpload = ({ entityType, entityId, onUploadSuccess }: Props) => {
  const [label, setLabel] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const labels = entityType === "customer" ? CUSTOMER_LABELS : SALE_LABELS

  const handleUpload = async () => {
    if (!file || !label) {
      setError("Please select a label and file")
      return
    }
    const formData = new FormData()
    formData.append("file", file)
    formData.append("label", label)
    formData.append("entity_type", entityType)
    formData.append("entity_id", String(entityId))

    try {
      setLoading(true)
      setError("")
      await api.post("/documents/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      })
      setFile(null)
      setLabel("")
      onUploadSuccess()
    } catch (err: any) {
      setError(err.response?.data?.detail || "Upload failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <select value={label} onChange={(e) => setLabel(e.target.value)} className="border p-2 rounded">
        <option value="">Select Label</option>
        {labels.map((l) => <option key={l} value={l}>{l}</option>)}
      </select>
      <input
        type="file"
        accept=".pdf,.jpg,.jpeg,.png"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        className="border p-2 rounded"
      />
      {error && <span className="text-red-500 text-sm">{error}</span>}
      <button onClick={handleUpload} disabled={loading} className="bg-amber-500 text-white p-2 rounded font-bold">
        {loading ? "Uploading..." : "Upload"}
      </button>
    </div>
  )
}

export default DocumentUpload
```

---

## DocumentList Component

```tsx
import { useEffect, useState } from "react"
import api from "@/lib/axios"

interface Document {
  document_id: number
  label: string
  file_name: string
  file_type: string
  uploaded_at: string
}

interface Props {
  entityType: "customer" | "sale"
  entityId: number
}

const DocumentList = ({ entityType, entityId }: Props) => {
  const [docs, setDocs] = useState<Document[]>([])

  const fetchDocs = async () => {
    const { data } = await api.get(`/documents/${entityType}/${entityId}`)
    setDocs(data)
  }

  useEffect(() => { fetchDocs() }, [entityId])

  const handleDownload = async (doc: Document) => {
    const response = await api.get(`/documents/${doc.document_id}/download`, { responseType: "blob" })
    const url = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement("a")
    link.href = url
    link.setAttribute("download", doc.file_name)
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.URL.revokeObjectURL(url)
  }

  const handleDelete = async (documentId: number) => {
    await api.delete(`/documents/${documentId}`)
    fetchDocs()
  }

  return (
    <div className="flex flex-col gap-2">
      {docs.length === 0 && <span className="text-gray-400">No documents uploaded yet</span>}
      {docs.map((doc) => (
        <div key={doc.document_id} className="flex justify-between items-center border p-3 rounded">
          <div className="flex flex-col">
            <span className="font-bold">{doc.label}</span>
            <span className="text-gray-500 text-sm">{doc.file_name}</span>
          </div>
          <div className="flex gap-2">
            <button onClick={() => handleDownload(doc)} className="text-blue-500 border border-blue-500 px-3 py-1 rounded text-sm">
              Download
            </button>
            <button onClick={() => handleDelete(doc.document_id)} className="text-red-500 border border-red-500 px-3 py-1 rounded text-sm">
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default DocumentList
```

---

## Usage in Pages

```tsx
// Customer detail page
<DocumentUpload entityType="customer" entityId={customerId} onUploadSuccess={fetchDocs} />
<DocumentList entityType="customer" entityId={customerId} />

// Sale detail page
<DocumentUpload entityType="sale" entityId={saleId} onUploadSuccess={fetchDocs} />
<DocumentList entityType="sale" entityId={saleId} />
```

---

## Important Notes

- Max file size: 10MB
- Allowed types: PDF, JPG, PNG
- Images are automatically compressed on backend
- Always use responseType: "blob" for download requests
- withCredentials: true must be set on axios instance
