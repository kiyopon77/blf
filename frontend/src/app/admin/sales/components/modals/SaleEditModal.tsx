"use client"

import { useState } from "react"
import { updateSale, updateSaleStatus } from "@/services/admin/sales"
import { Sale } from "@/types/sales"

const SaleEditModal = ({ sale, open, setOpen, onSuccess }: any) => {
  const [loading, setLoading] = useState(false)

  const [form, setForm] = useState({
    total_value: sale.total_value,
    commission_percent: sale.commission_percent || "",
    status: sale.status,
  })

  if (!open) return null

  const handleSubmit = async () => {
    try {
      setLoading(true)

      await updateSale(sale.sale_id, {
        total_value: Number(form.total_value),
        commission_percent: form.commission_percent
          ? Number(form.commission_percent)
          : undefined,
      })

      if (form.status !== sale.status) {
        await updateSaleStatus(sale.sale_id, form.status)
      }

      onSuccess()
      setOpen(false)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-100 p-6 shadow-xl">
        <h2 className="text-xl font-semibold mb-4">
          Edit Sale - SALE{sale.sale_id.toString().padStart(3, "0")}
        </h2>

        <div className="flex flex-col gap-3">
          <input
            type="number"
            placeholder="Total Value"
            value={form.total_value}
            onChange={(e) =>
              setForm({ ...form, total_value: e.target.value })
            }
            className="border p-2 rounded-md"
          />

          <input
            type="number"
            placeholder="Commission %"
            value={form.commission_percent}
            onChange={(e) =>
              setForm({ ...form, commission_percent: e.target.value })
            }
            className="border p-2 rounded-md"
          />

          <select
            value={form.status}
            onChange={(e) =>
              setForm({ ...form, status: e.target.value })
            }
            className="border p-2 rounded-md"
          >
            <option value="HOLD">HOLD</option>
            <option value="SOLD">SOLD</option>
            <option value="CANCELLED">CANCELLED</option>
            <option value="INVESTOR_UNIT">INVESTOR UNIT</option>
          </select>
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
            {loading ? "Updating..." : "Update"}
          </button>
        </div>
      </div>
    </div>
  )
}

export default SaleEditModal
