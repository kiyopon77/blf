"use client"

import { useEffect, useState } from "react"
import { createSale } from "@/services/admin/sales"
import { getPlotFloors } from "@/services/admin/floor"
import { getBrokers } from "@/services/admin/broker"
import { getCustomers } from "@/services/admin/customer"
import { getPlots } from "@/services/admin/plot"
import { useAuth } from "@/context/AuthContext"
import AdminButton from "@/components/ui/AdminButton"
import { Plus } from "lucide-react"

export default function SaleCreateModal({ onClose, onSuccess }: any) {
  const { society } = useAuth()

  const [plots, setPlots] = useState<any[]>([])
  const [filteredFloors, setFilteredFloors] = useState<any[]>([])
  const [brokers, setBrokers] = useState<any[]>([])
  const [customers, setCustomers] = useState<any[]>([])

  const [form, setForm] = useState({
    plot_id: "",
    floor_id: "",
    broker_id: "",
    customer_id: "",
    customer_name: "",
    total_value: "",
    commission_percent: "",
  })

  // fetch data
  useEffect(() => {
    const fetch = async () => {
      if (!society) return

      const [p, b, c] = await Promise.all([
        getPlots(society),
        getBrokers(society),
        getCustomers(society),
      ])

      console.log(p, b, c)

      setPlots(p || [])
      setBrokers(b || [])
      setCustomers(c || [])
    }

    fetch()
  }, [society])

  // filter floors based on selected plot
  useEffect(() => {
    const loadFloors = async () => {
      if (!form.plot_id) {
        setFilteredFloors([])
        return
      }

      const data = await getPlotFloors(Number(form.plot_id))
      setFilteredFloors(data || [])
    }

    loadFloors()
  }, [form.plot_id])

  // 🔹 Submit
  const handleSubmit = async () => {
    try {
      await createSale({
        floor_id: Number(form.floor_id),
        broker_id: Number(form.broker_id),
        customer_id: form.customer_id
          ? Number(form.customer_id)
          : undefined,
        customer_name: form.customer_name || undefined,
        total_value: Number(form.total_value),
        commission_percent: form.commission_percent
          ? Number(form.commission_percent)
          : undefined,
      })

      onSuccess()
      onClose()
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-xl w-150 shadow-lg">
        <h2 className="text-lg font-bold mb-4">Create Sale</h2>

        <div className="grid grid-cols-2 gap-4">
          {/* Plot */}
          <select
            value={form.plot_id}
            onChange={(e) =>
              setForm({
                ...form,
                plot_id: e.target.value,
                floor_id: "",
              })
            }
            className="border p-2 rounded"
          >
            <option value="">Select Plot</option>
            {plots?.map((p: any) => (
              <option key={p.plot_id} value={p.plot_id}>
                {p.plot_code}
              </option>
            ))}
          </select>

          {/* Floor */}
          <select
            value={form.floor_id}
            onChange={(e) =>
              setForm({ ...form, floor_id: e.target.value })
            }
            disabled={!form.plot_id}
            className="border p-2 rounded"
          >
            <option value="">Select Floor</option>
            {filteredFloors
              .filter((f: any) => f.status === "AVAILABLE")
              .map((f: any) => (
                <option key={f.floor_id} value={f.floor_id}>
                  Floor {f.floor_no}
                </option>
              ))}
            {filteredFloors.filter((f: any) => f.status === "AVAILABLE").length === 0 && (
              <option disabled>No available floors</option>
            )}
          </select>

          {/* Broker */}
          <select
            value={form.broker_id}
            onChange={(e) =>
              setForm({ ...form, broker_id: e.target.value })
            }
            className="border p-2 rounded"
          >
            <option value="">Select Broker</option>
            {brokers.map((b: any) => (
              <option key={b.broker_id} value={b.broker_id}>
                {b.broker_name}
              </option>
            ))}
          </select>

          {/* Customer select */}
          <select
            value={form.customer_id}
            onChange={(e) =>
              setForm({
                ...form,
                customer_id: e.target.value,
                customer_name: "",
              })
            }
            className="border p-2 rounded"
          >
            <option value="">Select Customer</option>
            {customers.map((c: any) => (
              <option key={c.customer_id} value={c.customer_id}>
                {c.full_name}
              </option>
            ))}
          </select>

          {/* Total value */}
          <input
            placeholder="Total Value"
            value={form.total_value}
            onChange={(e) =>
              setForm({ ...form, total_value: e.target.value })
            }
            className="border p-2 rounded"
          />

          {/* Commission */}
          <input
            placeholder="Commission %"
            value={form.commission_percent}
            onChange={(e) =>
              setForm({
                ...form,
                commission_percent: e.target.value,
              })
            }
            className="border p-2 rounded"
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:cursor-pointer"
          >
            Cancel
          </button>

          <AdminButton onClick={handleSubmit} icon={<Plus size={16} />}>
            Create
          </AdminButton>
        </div>
      </div>
    </div>
  )
}
