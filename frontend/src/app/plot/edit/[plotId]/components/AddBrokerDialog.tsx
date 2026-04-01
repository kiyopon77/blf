// app/plot/edit/[plotId]/components/AddBrokerDialog.tsx
import { useState } from "react"
import { App, Modal } from "antd"
import { createBroker } from "@/services/admin/broker"
import type { Broker } from "@/types/broker"
import { useAuth } from "@/context/AuthContext"

interface Props {
  open: boolean
  onClose: () => void
  onCreated: (broker: Broker) => void
  societyId: number
}

type FormState = {
  broker_name: string
  phone: string
}

// handles add broker dialog functionality
export function AddBrokerDialog({
  open,
  onClose,
  onCreated,
  societyId,
}: Props) {
  const { message } = App.useApp()
  const [loading, setLoading] = useState(false)
  const {user} = useAuth()

  const [form, setForm] = useState<FormState>({
    broker_name: "",
    phone: "",
  })

  const handleSubmit = async () => {
    if (!form.broker_name.trim()) {
      message.error("Broker name is required")
      return
    }

    setLoading(true)
    try {
      const broker = await createBroker({
        broker_name: form.broker_name || null,
        phone: form.phone || null,
        user_id: user?.user_id,
        society_id: societyId,
      })

      message.success("Broker created")
      onCreated(broker)

      setForm({ broker_name: "", phone: "" })
      onClose()
    } catch (err) {
      message.error("Failed to create broker")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal
      open={open}
      onCancel={onClose}
      onOk={handleSubmit}
      confirmLoading={loading}
      okText="Add Broker"
      okButtonProps={{ className: "!bg-green-700 !border-green-700" }}
      title={<span className="font-bold text-base">Add New Broker</span>}
      destroyOnHidden
    >
      <div className="flex flex-col gap-4 py-2">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-gray-500">
            BROKER NAME <span className="text-red-500">*</span>
          </label>
          <input
            className="h-10 rounded-lg border border-gray-300 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-600"
            placeholder="Enter broker name"
            value={form.broker_name}
            onChange={(e) =>
              setForm((f) => ({ ...f, broker_name: e.target.value }))
            }
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-gray-500">
            PHONE
          </label>
          <input
            className="h-10 rounded-lg border border-gray-300 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-600"
            placeholder="Enter phone number"
            value={form.phone}
            onChange={(e) =>
              setForm((f) => ({ ...f, phone: e.target.value }))
            }
          />
        </div>
      </div>
    </Modal>
  )
}
