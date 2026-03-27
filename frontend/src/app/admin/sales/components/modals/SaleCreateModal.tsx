"use client"

import { useEffect, useState } from "react"
import { createSale } from "@/services/admin/sales"
import api from "@/lib/api"

export default function SaleCreateModal({ onClose, onSuccess }: any) {
  const [floors, setFloors] = useState([])
  const [brokers, setBrokers] = useState([])
  const [customers, setCustomers] = useState([])

  const [form, setForm] = useState({
    floor_id: "",
    broker_id: "",
    customer_id: "",
    total_value: "",
    commission_percent: ""
  })

  useEffect(() => {
    const fetch = async () => {
      const [f, b, c] = await Promise.all([
        api.get("/floors"),
        api.get("/brokers"),
        api.get("/customers"),
      ])

      setFloors(f.data)
      setBrokers(b.data)
      setCustomers(c.data)
    }

    fetch()
  }, [])

  const handleSubmit = async () => {
    await createSale({
      floor_id: Number(form.floor_id),
      broker_id: Number(form.broker_id),
      customer_id: Number(form.customer_id),
      total_value: Number(form.total_value),
      commission_percent: form.commission_percent
        ? Number(form.commission_percent)
        : undefined,
    })

    onSuccess()
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="p-6 rounded-xl w-[600px]">
        <h2 className="text-lg font-bold mb-4">Create Sale</h2>

        <div className="grid grid-cols-2 gap-4">
          <select onChange={(e) => setForm({ ...form, floor_id: e.target.value })}>
            <option>Select Floor</option>
            {floors.map((f: any) => (
              <option key={f.floor_id} value={f.floor_id}>
                Floor {f.floor_no}
              </option>
            ))}
          </select>

          <select onChange={(e) => setForm({ ...form, broker_id: e.target.value })}>
            <option>Select Broker</option>
            {brokers.map((b: any) => (
              <option key={b.broker_id} value={b.broker_id}>
                {b.broker_name}
              </option>
            ))}
          </select>

          <select onChange={(e) => setForm({ ...form, customer_id: e.target.value })}>
            <option>Select Customer</option>
            {customers.map((c: any) => (
              <option key={c.customer_id} value={c.customer_id}>
                {c.full_name}
              </option>
            ))}
          </select>

          <input
            placeholder="Total Value"
            onChange={(e) => setForm({ ...form, total_value: e.target.value })}
          />

          <input
            placeholder="Commission %"
            onChange={(e) =>
              setForm({ ...form, commission_percent: e.target.value })
            }
          />
        </div>

        <div className="flex justify-end gap-3 mt-4">
          <button onClick={onClose}>Cancel</button>
          <button
            onClick={handleSubmit}
            className="bg-yellow-600 px-4 py-2 rounded"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  )
}
