"use client"

import { useState } from "react"
import { updateSale, updateSaleStatus } from "@/services/admin/sales"
import AdminButton from "@/components/ui/AdminButton"
import DeleteButton from "@/components/ui/DeleteButton"
import { X, Check } from "lucide-react"

const SaleEditModal = ({ sale, open, setOpen, onSuccess }: any) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const [form, setForm] = useState({
    total_value: sale.total_value,
    commission_percent: sale.commission_percent || "",
    status: sale.status,
  })

  if (!open) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      await updateSale(sale.sale_id, {
        total_value: Number(form.total_value),
        commission_percent: form.commission_percent
          ? Number(form.commission_percent)
          : undefined,
      })

      // update status only if changed
      if (form.status !== sale.status) {
        await updateSaleStatus(sale.sale_id, form.status)
      }

      onSuccess()
      setOpen(false)
    } catch (err) {
      console.error(err)
      setError("Failed to update sale.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">

        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">
            Edit Sale - SALE{sale.sale_id.toString().padStart(3, "0")}
          </h2>
          <button
            onClick={() => setOpen(false)}
            className="text-gray-400 hover:text-gray-600 text-xl"
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          {/* Total Value */}
          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-600">Total Value</label>
            <input
              type="number"
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
              type="number"
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

          {/* Status */}
          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-600">Status</label>
            <select
              value={form.status}
              onChange={(e) =>
                setForm({ ...form, status: e.target.value })
              }
              className="border border-gray-300 rounded-md p-2 text-sm"
            >
              <option value="HOLD">HOLD</option>
              <option value="SOLD">SOLD</option>
              <option value="CANCELLED">CANCELLED</option>
              <option value="INVESTOR_UNIT">INVESTOR UNIT</option>
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
              {loading ? "Updating..." : "Update"}
            </AdminButton>
          </div>
        </form>

      </div>
    </div>
  )
}

export default SaleEditModal
