"use client"

import { useEffect, useState } from "react"
import { updateBroker } from "@/services/admin/broker"
import { useAuth } from "@/context/AuthContext"

const BrokerEditModal = ({ open, setOpen, broker, setBrokers }: any) => {
  const [form, setForm] = useState({
    broker_name: "",
    phone: "",
    user_id: "",
    society_id: ""
  })

  const {user,society} = useAuth()

  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (broker) {
      setForm({
        broker_name: broker.broker_name || "",
        phone: broker.phone || "",
        user_id: broker.user_id?.toString() || "",
        society_id: broker.society_id?.toString() || ""
      })
    }
  }, [broker])

  if (!open) return null

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async () => {
    try {
      setLoading(true)

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
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-105 p-6 shadow-xl">

        <h2 className="text-xl font-semibold mb-4">
          Edit Broker
        </h2>

        <div className="flex flex-col gap-3">
          <input
            name="broker_name"
            placeholder="Name"
            value={form.broker_name}
            onChange={handleChange}
            className="border p-2 rounded-md"
          />

          <input
            name="phone"
            placeholder="Phone"
            value={form.phone}
            onChange={handleChange}
            className="border p-2 rounded-md"
          />
        </div>

        <div className="flex justify-end gap-3 mt-5">
          <button
            onClick={() => setOpen(false)}
            className="border px-4 py-2 rounded-md"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="bg-[#D4A22A] text-white px-4 py-2 rounded-md"
          >
            {loading ? "Updating..." : "Update"}
          </button>
        </div>

      </div>
    </div>
  )
}

export default BrokerEditModal
