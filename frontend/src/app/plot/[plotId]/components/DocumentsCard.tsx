"use client"

import { useEffect, useState } from "react"
import { FileText, Trash2, Download, Plus, Loader2 } from "lucide-react"
import { getDocuments, downloadDocument, deleteDocument } from "@/services/document"
import type { DocumentResponse } from "@/types/document"
import { UploadModal } from "./modals/UploadModal"

function FileIcon({ fileType }: { fileType: string }) {
  const isPdf = fileType === "application/pdf"
  const isImage = fileType.startsWith("image/")
  return (
    <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-xs font-bold text-white shrink-0 ${isPdf ? "bg-red-500" : isImage ? "bg-blue-500" : "bg-gray-400"}`}>
      {isPdf ? "PDF" : isImage ? "IMG" : "DOC"}
    </div>
  )
}

export default function DocumentsCard({ entityId }: { entityId: number }) {
  const [documents, setDocuments] = useState<DocumentResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [activeTab, setActiveTab] = useState<"SALE" | "CUSTOMER">("SALE")
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [downloadingId, setDownloadingId] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => { load() }, [entityId])

  const load = async () => {
    setLoading(true)
    try {
      const docs = await getDocuments("sale", entityId)
      setDocuments(docs)
    } catch { setError("Could not load documents.") }
    finally { setLoading(false) }
  }

  const handleDelete = async (doc: DocumentResponse) => {
    // ✅ Added Delete Confirmation
    if (!confirm(`Are you sure you want to delete "${doc.label}"?`)) return
    
    setDeletingId(doc.document_id)
    try {
      await deleteDocument(doc.document_id)
      setDocuments((prev) => prev.filter((d) => d.document_id !== doc.document_id))
    } catch { alert("Failed to delete.") }
    finally { setDeletingId(null) }
  }

  const handleDownload = async (doc: DocumentResponse) => {
    setDownloadingId(doc.document_id)
    try { await downloadDocument(doc.document_id, doc.file_name) }
    catch { alert("Download failed.") }
    finally { setDownloadingId(null) }
  }

  const filteredDocs = documents.filter((d) => d.entity === activeTab)

  return (
    <>
      <div className="bg-white px-9 py-6 rounded-xl border border-gray-400">
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <span className="text-gray-700 font-extrabold">Documents</span>
            <button onClick={() => setShowModal(true)} className="flex items-center gap-1.5 px-4 py-1.5 rounded-3xl bg-[#D4A22A] text-white text-sm font-semibold hover:bg-[#b8891f]">
              <Plus size={15} /> Add Document
            </button>
          </div>

          <div className="flex gap-2">
            {["SALE", "CUSTOMER"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`px-4 py-1.5 rounded-full text-sm font-semibold border transition-all ${
                  activeTab === tab ? "bg-[#D4A22A] text-white border-[#D4A22A]" : "border-gray-200 text-gray-600"
                }`}
              >
                {tab === "SALE" ? "Sale Docs" : "Customer Docs"} ({documents.filter(d => d.entity === tab).length})
              </button>
            ))}
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-8 text-gray-400 gap-2">
              <Loader2 size={18} className="animate-spin" /> Loading...
            </div>
          ) : filteredDocs.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-8 text-gray-400">
              <FileText size={32} strokeWidth={1.2} />
              <span className="text-sm">No {activeTab.toLowerCase()} documents found.</span>
            </div>
          ) : (
            <div className="flex flex-col divide-y divide-gray-100">
              {filteredDocs.map((doc) => (
                <div key={doc.document_id} className="flex items-center gap-4 py-3 group">
                  <FileIcon fileType={doc.file_type} />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-800 text-sm truncate">{doc.label}</p>
                    <p className="text-xs text-gray-400 truncate">{doc.file_name}</p>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => handleDownload(doc)} disabled={downloadingId === doc.document_id} className="p-2 hover:cursor-pointer text-gray-400 hover:text-[#D4A22A] disabled:opacity-50">
                      {downloadingId === doc.document_id ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
                    </button>
                    <button onClick={() => handleDelete(doc)} disabled={deletingId === doc.document_id} className="p-2 text-gray-400 hover:cursor-pointer hover:text-red-500 disabled:opacity-50">
                      {deletingId === doc.document_id ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <UploadModal
          entityType={activeTab.toLowerCase()}
          entityId={entityId}
          onClose={() => setShowModal(false)}
          onSuccess={(doc) => {
            setDocuments((prev) => [...prev, doc])
            setActiveTab(doc.entity as any)
          }}
        />
      )}
    </>
  )
}
