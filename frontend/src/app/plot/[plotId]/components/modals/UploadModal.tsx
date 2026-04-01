"use client"

import { useRef, useState } from "react"
import { Upload, X, CheckCircle, AlertCircle, Loader2 } from "lucide-react"
import { uploadDocument } from "@/services/document"
import type { DocumentResponse } from "@/types/document"

const SUGGESTED_LABELS: Record<string, string[]> = {
  customer: [
    "PAN Card", "Aadhaar Card", "Passport", "Voter ID",
    "Electricity Bill", "Water Bill", "Bank Statement", "Other",
  ],
  sale: [
    "Sale Agreement", "Registry", "Token Receipt", "ATS Document",
    "Possession Letter", "Property ID Proof", "Other",
  ],
}

interface Props {
  entityType: "CUSTOMER" | "SALE"
  saleId: number        // renamed from entityId — API always needs sale_id
  onClose: () => void
  onSuccess: (doc: DocumentResponse) => void
}

export function UploadModal({ entityType, saleId, onClose, onSuccess }: Props) {
  const [label, setLabel] = useState("")
  const [customLabel, setCustomLabel] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [dragging, setDragging] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const labels = SUGGESTED_LABELS[entityType] ?? SUGGESTED_LABELS.customer
  const effectiveLabel = label === "Other" ? customLabel : label

  // API expects uppercase: "CUSTOMER" | "SALE"

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
    if (!effectiveLabel.trim()) return setError("Please select or enter a label.")
    if (!file) return setError("Please choose a file.")

    setUploading(true)
    setError(null)

    try {
      const doc = await uploadDocument(effectiveLabel.trim(), entityType, saleId, file)
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
                  className={`px-3 py-1 rounded-full text-sm font-medium border transition-all ${label === l
                    ? "bg-[#D4A22A] border-[#D4A22A] text-white"
                    : "border-gray-200 text-gray-600 hover:border-[#D4A22A]"
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
                className="mt-1 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#D4A22A]"
              />
            )}
          </div>

          <div
            onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${dragging
              ? "border-[#D4A22A] bg-amber-50"
              : file
                ? "border-green-400 bg-green-50"
                : "border-gray-200 hover:border-[#D4A22A]"
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
                <span className="font-semibold text-green-700 text-sm truncate max-w-xs">{file.name}</span>
                <span className="text-xs text-gray-400 mt-1">Click to change file</span>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2 text-gray-400">
                <Upload size={28} />
                <span className="text-sm font-medium">
                  Drop file here or <span className="text-[#D4A22A] underline">browse</span>
                </span>
                <span className="text-xs">PDF, JPG, PNG, DOC up to any size</span>
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
              className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-semibold hover:bg-gray-50 text-sm"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={uploading}
              className="flex-1 py-2.5 rounded-xl bg-[#D4A22A] text-white font-semibold hover:bg-[#b8891f] text-sm disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {uploading ? <Loader2 size={15} className="animate-spin" /> : <Upload size={15} />}
              {uploading ? "Uploading..." : "Upload"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
