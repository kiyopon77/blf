// app/society/components/modals/SocietyDeleteModal.tsx
"use client"

import { useState } from "react"
import { deleteSociety } from "@/services/admin/society"
import DeleteButton from "@/components/ui/DeleteButton"
import { Society } from "@/types/society"

interface Props {
  open: boolean
  setOpen: (v: boolean) => void
  society: Society | null
  setSocieties: React.Dispatch<React.SetStateAction<any[]>>
  onDeleted: () => void
}

// handles society delete modal functionality
const SocietyDeleteModal = ({ open, setOpen, society, setSocieties, onDeleted }: Props) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  if (!open || !society) return null

  const handleDelete = async () => {
    setLoading(true)
    setError("")

    try {
      await deleteSociety(society.society_id)
      setSocieties((prev) => prev.filter((s) => s.society_id !== society.society_id))
      onDeleted()
      setOpen(false)
    } catch (err) {
      setError("Failed to delete society. It may be linked to active plots or users.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white rounded-xl p-6 w-[400px] shadow-lg flex flex-col items-center">
        <h2 className="text-lg font-bold mb-2">Delete Society</h2>
        <p className="text-sm text-gray-500 mb-6 text-center">
          Are you sure you want to delete <strong>{society.society_name || `Society ${society.society_id}`}</strong>? This action cannot be undone.
        </p>

        {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}

        <div className="flex gap-4 w-full">
          <button
            onClick={() => setOpen(false)}
            className="flex-1 py-2 rounded-lg border border-gray-300 font-semibold text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <div className="flex-1 flex justify-center">
            <DeleteButton onClick={handleDelete}>
              {loading ? "Deleting..." : "Confirm Delete"}
            </DeleteButton>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SocietyDeleteModal
