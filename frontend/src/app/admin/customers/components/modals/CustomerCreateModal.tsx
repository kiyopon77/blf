// app/admin/customers/components/modals/CustomerCreateModal.tsx
"use client"

import { useState } from "react"
import { createCustomer } from "@/services/admin/customer"
import { useAuth } from "@/context/AuthContext"
import AdminButton from "@/components/ui/AdminButton"
import DeleteButton from "@/components/ui/DeleteButton"
import { X, Check } from "lucide-react"

// handles customer create modal functionality
const CustomerCreateModal = ({ open, setOpen, setCustomers }: any) => {
  const [form, setForm] = useState({
    full_name: "",
    pan: "",
    phone: "",
    email: "",
    address: "",
  })

  const { society } = useAuth()

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  if (!open) return null

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const newCustomer = await createCustomer({
        society_id: society!,
        full_name: form.full_name || "",
        pan: form.pan || "",
        phone: form.phone || undefined,
        email: form.email || undefined,
        address: form.address || undefined,
      })

      setCustomers((prev: any) => [newCustomer, ...prev])

      setOpen(false)

      // reset
      setForm({
        full_name: "",
        pan: "",
        phone: "",
        email: "",
        address: "",
      })
    } catch (err) {
      setError("Failed to create customer.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">

        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Create Customer</h2>
          <button
            onClick={() => setOpen(false)}
            className="text-gray-400 hover:text-gray-600 text-xl"
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          {/* Full Name */}
          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-600">Full Name</label>
            <input
              name="full_name"
              value={form.full_name}
              onChange={handleChange}
              required
              className="border border-gray-300 rounded-md p-2 text-sm"
            />
          </div>

          {/* PAN */}
          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-600">PAN</label>
            <input
              name="pan"
              value={form.pan}
              onChange={handleChange}
              className="border border-gray-300 rounded-md p-2 text-sm"
            />
          </div>

          {/* Phone */}
          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-600">Phone</label>
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              className="border border-gray-300 rounded-md p-2 text-sm"
            />
          </div>

          {/* Email */}
          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-600">Email</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              className="border border-gray-300 rounded-md p-2 text-sm"
            />
          </div>

          {/* Address */}
          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-600">Address</label>
            <input
              name="address"
              value={form.address}
              onChange={handleChange}
              className="border border-gray-300 rounded-md p-2 text-sm"
            />
          </div>

          {/* Error */}
          {error && <p className="text-red-500 text-sm">{error}</p>}

          {/* Actions */}
          <div className="flex justify-end gap-2 mt-2">
            <DeleteButton onClick={() => setOpen(false)} icon={<X size={16} />}>
              Cancel
            </DeleteButton>

            <AdminButton
              type="submit"
              disabled={loading}
              icon={<Check size={16} />}
            >
              {loading ? "Creating..." : "Create"}
            </AdminButton>
          </div>
        </form>

      </div>
    </div>
  )
}

export default CustomerCreateModal
