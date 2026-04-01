// app/admin/rm/components/RMEditModal.tsx
// components/RMEditModal.tsx
"use client"

import { useEffect, useState } from "react"
import { updateRM } from "@/services/rm"

// handles r m edit modal functionality
const RMEditModal = ({ open, setOpen, rm, setRms }: any) => {
  const [form, setForm] = useState({
    name: "",
    phone: "",
  })

  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (rm) {
      setForm({
        name: rm.name || "",
        phone: rm.phone || "",
      })
    }
  }, [rm])

  if (!open || !rm) return null

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async () => {
    try {
      setLoading(true)

      const updated = await updateRM(rm.rm_id, form)

      // ✅ update UI without refetch
      setRms((prev: any) =>
        prev.map((r: any) =>
          r.rm_id === rm.rm_id ? updated : r
        )
      )

      setOpen(false)
    } catch (err) {
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-100 p-6 shadow-xl">
        <h2 className="text-xl font-semibold mb-4">Edit RM</h2>

        <div className="flex flex-col gap-3">
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            className="border p-2 rounded-md"
          />
          
          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            className="border p-2 rounded-md"
          />
        </div>

        <div className="flex justify-end gap-3 mt-5">
          <button
            onClick={() => setOpen(false)}
            className="px-4 py-2 border rounded-md"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-4 py-2 bg-yellow-500 text-white rounded-md"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  )
}

export default RMEditModal
