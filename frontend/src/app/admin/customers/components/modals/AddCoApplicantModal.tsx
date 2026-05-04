// app/admin/customers/components/modals/AddCoApplicantModal.tsx
import { useState } from "react"
import { App } from "antd"
import { createCoApplicant } from "@/services/admin/coapplicant"
import type { CoApplicantCreate } from "@/types/customer"

export default function AddCoApplicantModal({
  open,
  onClose,
  customerId,
  onCreated,
}: {
  open: boolean
  onClose: () => void
  customerId: number
  onCreated: (ca: any) => void
}) {
  const [formData, setFormData] = useState<Omit<CoApplicantCreate, "customer_id">>({
    full_name: "",
    pan: "",
    phone: "",
    email: "",
    address: "",
  })
  const [saving, setSaving] = useState(false)
  const { message } = App.useApp()

  if (!open) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const created = await createCoApplicant({
        customer_id: customerId,
        ...formData,
      })
      message.success("Co-applicant added successfully")
      onCreated(created)
      onClose()
      setFormData({
        full_name: "",
        pan: "",
        phone: "",
        email: "",
        address: "",
      })
    } catch {
      message.error("Failed to add co-applicant")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-semibold">Add Co-Applicant</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-black">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Full Name</label>
            <input
              required
              type="text"
              className="border p-2 rounded"
              value={formData.full_name}
              onChange={e => setFormData({ ...formData, full_name: e.target.value })}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Phone</label>
              <input
                type="text"
                className="border p-2 rounded"
                value={formData.phone || ""}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">PAN</label>
              <input
                type="text"
                className="border p-2 rounded"
                value={formData.pan || ""}
                onChange={e => setFormData({ ...formData, pan: e.target.value })}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              className="border p-2 rounded"
              value={formData.email || ""}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Address</label>
            <input
              type="text"
              className="border p-2 rounded"
              value={formData.address || ""}
              onChange={e => setFormData({ ...formData, address: e.target.value })}
            />
          </div>

          <div className="flex justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
