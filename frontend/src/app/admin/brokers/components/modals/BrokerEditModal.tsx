"use client"

import { useEffect, useState } from "react"
import { updateBroker } from "@/services/admin/broker"
import { useAuth } from "@/context/AuthContext"
import AdminButton from "@/components/ui/AdminButton"
import DeleteButton from "@/components/ui/DeleteButton"
import { X, Check } from "lucide-react"

const BrokerEditModal = ({ open, setOpen, broker, setBrokers }: any) => {
  const [form, setForm] = useState({
    broker_name: "",
    phone: "",
  })

  const { user, society } = useAuth()

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (broker && open) {
      setForm({
        broker_name: broker.broker_name || "",
        phone: broker.phone || "",
      })
    }
  }, [broker, open])

  if (!open || !broker) return null

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const payload = {
        broker_name: form.broker_name,
        phone: form.phone,
        user_id: user.user_id,
        society_id: society 
      }

      const updated = await updateBroker(broker.broker_id, payload)

      setBrokers((prev: any) =>
        prev.map((x: any) =>
          x.broker_id === broker.broker_id ? updated : x
        )
      )

      setOpen(false)
    } catch (err) {
      console.error(err)
      setError("Failed to update broker.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">

        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Edit Broker</h2>
          <button
            onClick={() => setOpen(false)}
            className="text-gray-400 hover:text-gray-600 text-xl"
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          {/* Name */}
          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-600">Broker Name</label>
            <input
              name="broker_name"
              value={form.broker_name}
              onChange={handleChange}
              required
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
              required
              className="border border-gray-300 rounded-md p-2 text-sm"
            />
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

export default BrokerEditModal
