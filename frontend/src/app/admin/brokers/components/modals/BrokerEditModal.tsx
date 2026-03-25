"use client"

import { useState } from "react"
import { createBroker } from "@/services/admin/broker"

const BrokerCreateModal = ({ open, setOpen, setBrokers }: any) => {
  const [form, setForm] = useState({
    broker_name: "",
    phone: "",
    user_id: "",
  })

  const [loading, setLoading] = useState(false)

  if (!open) return null

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async () => {
    try {
      setLoading(true)

      const newBroker = await createBroker({
        ...form,
        user_id: Number(form.user_id),
      })

      setBrokers((prev: any) => [newBroker, ...prev])
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
        <h2 className="text-xl font-semibold mb-4">Create Broker</h2>

        <div className="flex flex-col gap-3">
          <input name="broker_name" placeholder="Name" onChange={handleChange} className="border p-2 rounded-md" />
          <input name="phone" placeholder="Phone" onChange={handleChange} className="border p-2 rounded-md" />
          <input name="user_id" placeholder="User ID" onChange={handleChange} className="border p-2 rounded-md" />
        </div>

        <div className="flex justify-end gap-3 mt-5">
          <button onClick={() => setOpen(false)} className="border px-4 py-2 rounded-md">
            Cancel
          </button>

          <button onClick={handleSubmit} className="bg-yellow-500 text-white px-4 py-2 rounded-md">
            {loading ? "Creating..." : "Create"}
          </button>
        </div>
      </div>
    </div>
  )
}

export default BrokerCreateModal
