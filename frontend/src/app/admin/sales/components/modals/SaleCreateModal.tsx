"use client"

import { useEffect, useState } from "react"
import { createSale } from "@/services/admin/sales"
import { getPlotFloors } from "@/services/admin/floor"
import { getBrokers } from "@/services/admin/broker"
import { getCustomers } from "@/services/admin/customer"
import { getPlots } from "@/services/admin/plot"
import { useAuth } from "@/context/AuthContext"
import AdminButton from "@/components/ui/AdminButton"
import DeleteButton from "@/components/ui/DeleteButton"
import { Plus, X } from "lucide-react"

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

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  // fetch data
  useEffect(() => {
    const fetch = async () => {
      if (!society) return

      const [p, b, c] = await Promise.all([
        getPlots(society),
        getBrokers(society),
        getCustomers(society),
      ])

      setPlots(p || [])
      setBrokers(b || [])
      setCustomers(c || [])
    }

    fetch()
  }, [society])

  // load floors
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

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
      setError("Failed to create sale.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-2xl shadow-xl">

        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Create Sale</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl"
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">

          {/* Plot */}
          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-600">Plot</label>
            <select
              value={form.plot_id}
              onChange={(e) =>
                setForm({
                  ...form,
                  plot_id: e.target.value,
                  floor_id: "",
                })
              }
              className="border border-gray-300 rounded-md p-2 text-sm"
            >
              <option value="">Select Plot</option>
              {plots.map((p: any) => (
                <option key={p.plot_id} value={p.plot_id}>
                  {p.plot_code}
                </option>
              ))}
            </select>
          </div>

          {/* Floor */}
          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-600">Floor</label>
            <select
              value={form.floor_id}
              onChange={(e) =>
                setForm({ ...form, floor_id: e.target.value })
              }
              disabled={!form.plot_id}
              className="border border-gray-300 rounded-md p-2 text-sm"
            >
              <option value="">Select Floor</option>
              {filteredFloors
                .filter((f: any) => f.status === "AVAILABLE")
                .map((f: any) => (
                  <option key={f.floor_id} value={f.floor_id}>
                    Floor {f.floor_no}
                  </option>
                ))}
            </select>
          </div>

          {/* Broker */}
          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-600">Broker</label>
            <select
              value={form.broker_id}
              onChange={(e) =>
                setForm({ ...form, broker_id: e.target.value })
              }
              className="border border-gray-300 rounded-md p-2 text-sm"
            >
              <option value="">Select Broker</option>
              {brokers.map((b: any) => (
                <option key={b.broker_id} value={b.broker_id}>
                  {b.broker_name}
                </option>
              ))}
            </select>
          </div>

          {/* Customer */}
          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-600">Customer</label>
            <select
              value={form.customer_id}
              onChange={(e) =>
                setForm({
                  ...form,
                  customer_id: e.target.value,
                  customer_name: "",
                })
              }
              className="border border-gray-300 rounded-md p-2 text-sm"
            >
              <option value="">Select Customer</option>
              {customers.map((c: any) => (
                <option key={c.customer_id} value={c.customer_id}>
                  {c.full_name}
                </option>
              ))}
            </select>
          </div>

          {/* Total Value */}
          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-600">Total Value</label>
            <input
              value={form.total_value}
              onChange={(e) =>
                setForm({ ...form, total_value: e.target.value })
              }
              className="border border-gray-300 rounded-md p-2 text-sm"
            />
          </div>

          {/* Commission */}
          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-600">Commission (%)</label>
            <input
              value={form.commission_percent}
              onChange={(e) =>
                setForm({
                  ...form,
                  commission_percent: e.target.value,
                })
              }
              className="border border-gray-300 rounded-md p-2 text-sm"
            />
          </div>

          {/* Error */}
          {error && (
            <p className="text-red-500 text-sm col-span-2">{error}</p>
          )}

          {/* Actions */}
          <div className="col-span-2 flex justify-end gap-2 mt-2">
            <DeleteButton onClick={onClose} icon={<X size={16} />}>
              Cancel
            </DeleteButton>

            <AdminButton
              type="submit"
              disabled={loading}
              icon={<Plus size={16} />}
            >
              {loading ? "Creating..." : "Create"}
            </AdminButton>
          </div>
        </form>
      </div>
    </div>
  )
}
