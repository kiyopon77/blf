"use client"

import { useEffect, useState } from "react"
import { updateCustomer } from "@/services/admin/customer"
import AdminButton from "@/components/ui/AdminButton"
import DeleteButton from "@/components/ui/DeleteButton"
import { X, Check } from "lucide-react"

const CustomerEditModal = ({ open, setOpen, customer, setCustomers }: any) => {
  const [form, setForm] = useState({
    full_name: "",
    phone: "",
    email: "",
    address: "",
    kyc_status: "PENDING",
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (customer && open) {
      setForm({
        full_name: customer.full_name || "",
        phone: customer.phone || "",
        email: customer.email || "",
        address: customer.address || "",
        kyc_status: customer.kyc_status || "PENDING",
      })
    }
  }, [customer, open])

  if (!open || !customer) return null

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const cleanForm = {
        full_name: form.full_name || null,
        phone: form.phone || null,
        email: form.email || null,
        address: form.address || null,
        kyc_status: form.kyc_status || null,
      }

      const updated = await updateCustomer(
        customer.customer_id,
        cleanForm // ✅ FIXED (was using form before)
      )

      setCustomers((prev: any) =>
        prev.map((c: any) =>
          c.customer_id === customer.customer_id ? updated : c
        )
      )

      setOpen(false)
    } catch (err) {
      console.error(err)
      setError("Failed to update customer.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">

        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Edit Customer</h2>
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

          {/* KYC */}
          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-600">KYC Status</label>
            <select
              name="kyc_status"
              value={form.kyc_status}
              onChange={handleChange}
              className="border border-gray-300 rounded-md p-2 text-sm"
            >
              <option value="PENDING">PENDING</option>
              <option value="DONE">DONE</option>
            </select>
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
              {loading ? "Saving..." : "Save"}
            </AdminButton>
          </div>
        </form>

      </div>
    </div>
  )
}

export default CustomerEditModal
