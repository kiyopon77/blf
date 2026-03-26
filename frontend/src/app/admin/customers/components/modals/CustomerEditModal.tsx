// components/CustomerEditModal.tsx
"use client"

import { useEffect, useState } from "react"
import { updateCustomer } from "@/services/admin/customer"

const CustomerEditModal = ({ open, setOpen, customer, setCustomers }: any) => {
  const [form, setForm] = useState({
    full_name: "",
    phone: "",
    email: "",
    address: "",
    kyc_status: "",
  })

  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (customer) {
      setForm({
        full_name: customer.full_name || "",
        phone: customer.phone || "",
        email: customer.email || "",
        address: customer.address || "",
        kyc_status: customer.kyc_status || "",
      })
    }
  }, [customer])

  if (!open || !customer) return null

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async () => {
    try {
      setLoading(true)
      const cleanForm = {
        full_name: form.full_name || null,
        phone: form.phone || null,
        email: form.email || null,
        address: form.address || null,
        kyc_status: form.kyc_status || null,
      }

      const updated = await updateCustomer(
        customer.customer_id,
        form
      )

      setCustomers((prev: any) =>
        prev.map((c: any) =>
          c.customer_id === customer.customer_id ? updated : c
        )
      )

      setOpen(false)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-105 p-6 shadow-xl">
        <h2 className="text-xl font-semibold mb-4">Edit Customer</h2>

        <div className="flex flex-col gap-3">
          <input name="full_name" value={form.full_name} onChange={handleChange} className="border p-2 rounded-md" />
          <input name="phone" value={form.phone} onChange={handleChange} className="border p-2 rounded-md" />
          <input name="email" value={form.email} onChange={handleChange} className="border p-2 rounded-md" />
          <input name="address" value={form.address} onChange={handleChange} className="border p-2 rounded-md" />

          {/* KYC */}
          <select
            name="kyc_status"
            value={form.kyc_status}
            onChange={handleChange}
            className="border p-2 rounded-md"
          >
            <option value="PENDING">PENDING</option>
            <option value="DONE">DONE</option>
          </select>
        </div>

        <div className="flex justify-end gap-3 mt-5">
          <button onClick={() => setOpen(false)} className="border px-4 py-2 rounded-md">
            Cancel
          </button>

          <button onClick={handleSubmit} disabled={loading} className="bg-yellow-500 text-white px-4 py-2 rounded-md">
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  )
}

export default CustomerEditModal
