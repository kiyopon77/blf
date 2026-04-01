// app/admin/rm/components/RMCreateModal.tsx
// components/RMCreateModal.tsx
"use client"

import { useState } from "react"
import { createRM } from "@/services/rm"

// handles r m create modal functionality
const RMCreateModal = ({ open, setOpen, setRms }: any) => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
  })

  const [loading, setLoading] = useState(false)

  if (!open) return null

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async () => {
    try {
      setLoading(true)
      const newRM = await createRM(form)

      // update UI instantly
      setRms((prev: any) => [newRM, ...prev])

      setOpen(false)
      setForm({ name: "", email: "", phone: "" })
    } catch (err) {
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-100 p-6 shadow-xl">
        <h2 className="text-xl font-semibold mb-4">Create RM</h2>

        <div className="flex flex-col gap-3">
          <input
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={handleChange}
            className="border p-2 rounded-md"
          />

          <input
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="border p-2 rounded-md"
          />

          <input
            name="phone"
            placeholder="Phone"
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
            {loading ? "Creating..." : "Create"}
          </button>
        </div>
      </div>
    </div>
  )
}

export default RMCreateModal
