"use client"
import { useEffect, useRef, useState } from "react"
import {
  Upload,
  FileText,
  Trash2,
  Download,
  Plus,
  X,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react"
import {
  getDocuments,
  uploadDocument,
  downloadDocument,
  deleteDocument,
} from "@/services/document"
import type { DocumentResponse } from "@/types/document"

// ─── Suggested document labels ────────────────────────────────────────────────

const SUGGESTED_LABELS: Record<string, string[]> = {
  customer: [
    "PAN Card",
    "Aadhaar Card",
    "Passport",
    "Voter ID",
    "Electricity Bill",
    "Water Bill",
    "Bank Statement",
    "Other",
  ],
  sale: [
    "Sale Agreement",
    "Registry",
    "Token Receipt",
    "ATS Document",
    "Possession Letter",
    "Property ID Proof",
    "Other",
  ],
}

// ─── File type badge ──────────────────────────────────────────────────────────

function FileIcon({ fileType }: { fileType: string }) {
  const isImage = fileType.startsWith("image/")
  const isPdf = fileType === "application/pdf"
  return (
    <div
      className={`w-9 h-9 rounded-lg flex items-center justify-center text-xs font-bold text-white shrink-0 ${
        isPdf ? "bg-red-500" : isImage ? "bg-blue-500" : "bg-gray-400"
      }`}
    >
      {isPdf ? "PDF" : isImage ? "IMG" : "DOC"}
    </div>
  )
}

// ─── Upload Modal ─────────────────────────────────────────────────────────────

function UploadModal({
  entityType,
  entityId,
  onClose,
  onSuccess,
}: {
  entityType: string
  entityId: number
  onClose: () => void
  onSuccess: (doc: DocumentResponse) => void
}) {
  const [label, setLabel] = useState("")
  const [customLabel, setCustomLabel] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [dragging, setDragging] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const effectiveLabel = label === "Other" ? customLabel : label
  const labels = SUGGESTED_LABELS[entityType] ?? SUGGESTED_LABELS.customer

  const handleFile = (f: File) => {
    setFile(f)
    setError(null)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    const f = e.dataTransfer.files[0]
    if (f) handleFile(f)
  }

  const handleSubmit = async () => {
    if (!effectiveLabel.trim()) { setError("Please select or enter a label."); return }
    if (!file) { setError("Please choose a file."); return }
    setUploading(true)
    setError(null)
    try {
      const doc = await uploadDocument(effectiveLabel.trim(), entityType, entityId, file)
      onSuccess(doc)
      onClose()
    } catch {
      setError("Upload failed. Please try again.")
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <span className="font-extrabold text-gray-800 text-lg">Upload Document</span>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="px-6 py-5 flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-600">Document Type</label>
            <div className="flex flex-wrap gap-2">
              {labels.map((l) => (
                <button
                  key={l}
                  onClick={() => setLabel(l)}
                  className={`px-3 py-1 rounded-full text-sm font-medium border transition-all ${
                    label === l
                      ? "bg-[#D4A22A] border-[#D4A22A] text-white"
                      : "border-gray-200 text-gray-600 hover:border-[#D4A22A] hover:text-[#D4A22A]"
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
            {label === "Other" && (
              <input
                type="text"
                placeholder="Enter document name"
                value={customLabel}
                onChange={(e) => setCustomLabel(e.target.value)}
                className="mt-1 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#D4A22A] transition-colors"
              />
            )}
          </div>

          <div
            onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
              dragging
                ? "border-[#D4A22A] bg-amber-50"
                : file
                ? "border-green-400 bg-green-50"
                : "border-gray-200 hover:border-[#D4A22A] hover:bg-amber-50/30"
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
            />
            {file ? (
              <div className="flex flex-col items-center gap-1">
                <CheckCircle size={28} className="text-green-500" />
                <span className="font-semibold text-green-700 text-sm">{file.name}</span>
                <span className="text-gray-400 text-xs">{(file.size / 1024).toFixed(1)} KB</span>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2 text-gray-400">
                <Upload size={28} />
                <span className="text-sm font-medium">
                  Drop file here or <span className="text-[#D4A22A] underline">browse</span>
                </span>
                <span className="text-xs">PDF, JPG, PNG, DOC up to 10 MB</span>
              </div>
            )}
          </div>

          {error && (
            <div className="flex items-center gap-2 text-red-500 text-sm bg-red-50 px-3 py-2 rounded-lg">
              <AlertCircle size={15} />
              {error}
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-semibold hover:bg-gray-50 transition-colors text-sm"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={uploading}
              className="flex-1 py-2.5 rounded-xl bg-[#D4A22A] text-white font-semibold hover:bg-[#b8891f] transition-colors text-sm disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {uploading ? (
                <><Loader2 size={15} className="animate-spin" /> Uploading…</>
              ) : (
                <><Upload size={15} /> Upload</>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Main DocumentsCard ───────────────────────────────────────────────────────

export default function DocumentsCard({
  entityType,
  entityId,
}: {
  entityType: string
  entityId: number
}) {
  const [documents, setDocuments] = useState<DocumentResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [downloadingId, setDownloadingId] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    load()
  }, [entityType, entityId])

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      const docs = await getDocuments(entityType, entityId)
      setDocuments(docs)
    } catch {
      setError("Could not load documents.")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (doc: DocumentResponse) => {
    if (!confirm(`Delete "${doc.label}"?`)) return
    setDeletingId(doc.document_id)
    try {
      await deleteDocument(doc.document_id)
      setDocuments((prev) => prev.filter((d) => d.document_id !== doc.document_id))
    } catch {
      alert("Failed to delete document.")
    } finally {
      setDeletingId(null)
    }
  }

  const handleDownload = async (doc: DocumentResponse) => {
    setDownloadingId(doc.document_id)
    try {
      await downloadDocument(doc.document_id, doc.file_name)
    } catch {
      alert("Download failed.")
    } finally {
      setDownloadingId(null)
    }
  }

  return (
    <>
      <div className="bg-white px-9 py-6 rounded-xl border border-gray-400">
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <span className="text-gray-700 font-extrabold">Documents</span>
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-3xl bg-[#D4A22A] text-white text-sm font-semibold hover:bg-[#b8891f] transition-colors"
            >
              <Plus size={15} />
              Add Document
            </button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-8 text-gray-400 gap-2">
              <Loader2 size={18} className="animate-spin" />
              <span className="text-sm">Loading documents…</span>
            </div>
          ) : error ? (
            <div className="flex items-center gap-2 text-red-500 text-sm py-4">
              <AlertCircle size={16} /> {error}
            </div>
          ) : documents.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-8 text-gray-400">
              <FileText size={32} strokeWidth={1.2} />
              <span className="text-sm">No documents uploaded yet</span>
            </div>
          ) : (
            <div className="flex flex-col divide-y divide-gray-100">
              {documents.map((doc) => (
                <div key={doc.document_id} className="flex items-center gap-4 py-3 group">
                  <FileIcon fileType={doc.file_type} />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-800 text-sm truncate">{doc.label}</p>
                    <p className="text-xs text-gray-400 truncate">{doc.file_name}</p>
                    <p className="text-xs text-gray-300 mt-0.5">
                      {new Date(doc.uploaded_at).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleDownload(doc)}
                      disabled={downloadingId === doc.document_id}
                      title="Download"
                      className="p-2 rounded-lg text-gray-400 hover:text-[#D4A22A] hover:bg-amber-50 transition-colors disabled:opacity-50"
                    >
                      {downloadingId === doc.document_id ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : (
                        <Download size={16} />
                      )}
                    </button>
                    <button
                      onClick={() => handleDelete(doc)}
                      disabled={deletingId === doc.document_id}
                      title="Delete"
                      className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors disabled:opacity-50"
                    >
                      {deletingId === doc.document_id ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : (
                        <Trash2 size={16} />
                      )}
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
          entityType={entityType}
          entityId={entityId}
          onClose={() => setShowModal(false)}
          onSuccess={(doc) => setDocuments((prev) => [...prev, doc])}
        />
      )}
    </>
  )
}
