// components/CustomerCreateModal.tsx
"use client"

import { useState } from "react"
import { createCustomer } from "@/services/admin/customer"

const CustomerCreateModal = ({ open, setOpen, setCustomers }: any) => {
  const [form, setForm] = useState({
    full_name: "",
    pan: "",
    phone: "",
    email: "",
    address: "",
  })

  const [loading, setLoading] = useState(false)

  if (!open) return null

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async () => {
    try {
      setLoading(true)

      const newCustomer = await createCustomer(form)

      setCustomers((prev: any) => [newCustomer, ...prev])

      setOpen(false)
      setForm({
        full_name: "",
        pan: "",
        phone: "",
        email: "",
        address: "",
      })
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-105 p-6 shadow-xl">
        <h2 className="text-xl font-semibold mb-4">Create Customer</h2>

        <div className="flex flex-col gap-3">
          <input name="full_name" placeholder="Full Name" value={form.full_name} onChange={handleChange} className="border p-2 rounded-md" />
          <input name="pan" placeholder="PAN" value={form.pan} onChange={handleChange} className="border p-2 rounded-md" />
          <input name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} className="border p-2 rounded-md" />
          <input name="email" placeholder="Email" value={form.email} onChange={handleChange} className="border p-2 rounded-md" />
          <input name="address" placeholder="Address" value={form.address} onChange={handleChange} className="border p-2 rounded-md" />
        </div>

        <div className="flex justify-end gap-3 mt-5">
          <button onClick={() => setOpen(false)} className="border px-4 py-2 rounded-md">
            Cancel
          </button>

          <button onClick={handleSubmit} disabled={loading} className="bg-yellow-500 text-white px-4 py-2 rounded-md">
            {loading ? "Creating..." : "Create"}
          </button>
        </div>
      </div>
    </div>
  )
}

export default CustomerCreateModal
