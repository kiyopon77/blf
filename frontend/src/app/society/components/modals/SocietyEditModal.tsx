// app/society/components/modals/SocietyEditModal.tsx
"use client"

import { useState, useEffect } from "react"
import { updateSociety } from "@/services/admin/society"
import AdminButton from "@/components/ui/AdminButton"
import DeleteButton from "@/components/ui/DeleteButton"
import { X, Check } from "lucide-react"
import { Society } from "@/types/society"

interface Props {
  open: boolean
  setOpen: (v: boolean) => void
  society: Society | null
  setSocieties: React.Dispatch<React.SetStateAction<any[]>>
}

// handles society edit modal functionality
const SocietyEditModal = ({ open, setOpen, society, setSocieties }: Props) => {
  const [form, setForm] = useState({
    society_name: "",
    address: "",
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (society && open) {
      setForm({
        society_name: society.society_name || "",
        address: society.address || "",
      })
    }
  }, [society, open])

  if (!open || !society) return null

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const updated = await updateSociety(society.society_id, {
        society_name: form.society_name || undefined,
        address: form.address || undefined,
      })

      setSocieties((prev) =>
        prev.map((s) => (s.society_id === society.society_id ? updated : s))
      )
      setOpen(false)
    } catch (err) {
      setError("Failed to update society.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Edit Society</h2>
          <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-600">Society Name</label>
            <input
              name="society_name"
              value={form.society_name}
              onChange={handleChange}
              required
              className="border border-gray-300 rounded-md p-2 text-sm"
              placeholder="E.g., Green Valley Estate"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-600">Address</label>
            <input
              name="address"
              value={form.address}
              onChange={handleChange}
              className="border border-gray-300 rounded-md p-2 text-sm"
              placeholder="123 Block Main St."
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <div className="flex justify-end gap-2 mt-2">
            <DeleteButton onClick={() => setOpen(false)} icon={<X size={16} />}>Cancel</DeleteButton>
            <AdminButton type="submit" disabled={loading} icon={<Check size={16} />}>
              {loading ? "Saving..." : "Save"}
            </AdminButton>
          </div>
        </form>
      </div>
    </div>
  )
}

export default SocietyEditModal
