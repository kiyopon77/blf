import { useState } from "react"
import { App, Modal } from "antd"
import { createCustomer } from "@/services/admin/customer"
import type { Customer } from "@/types/customer"

interface Props {
  open: boolean
  onClose: () => void
  onCreated: (customer: Customer) => void
  societyId: number
}

type FieldConfig = {
  key: keyof FormState
  label: string
  required?: boolean
  placeholder?: string
  upper?: boolean
}

const FIELDS: FieldConfig[] = [
  {
    key: "full_name",
    label: "FULL NAME",
    required: true,
    placeholder: "Enter full name",
  },
  {
    key: "pan",
    label: "PAN",
    required: true,
    placeholder: "e.g. ABCDE1234F",
    upper: true,
  },
  {
    key: "phone",
    label: "PHONE",
    placeholder: "Enter phone",
  },
  {
    key: "email",
    label: "EMAIL",
    placeholder: "Enter email",
  },
]

type FormState = {
  full_name: string
  pan: string
  phone: string
  email: string
  address: string
}

export function AddCustomerDialog({ open, onClose, onCreated, societyId }: Props) {
  const { message } = App.useApp()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState<FormState>({
    full_name: "",
    pan: "",
    phone: "",
    email: "",
    address: "",
  })

  const handleSubmit = async () => {
    if (!form.full_name.trim()) { message.error("Name is required"); return }
    if (!form.pan.trim()) { message.error("PAN is required"); return }
    setLoading(true)
    try {
      const customer = await createCustomer({
        society_id: societyId,
        full_name: form.full_name,
        pan: form.pan,
        phone: form.phone || null,
        email: form.email || null,
        address: form.address || null,
      })
      message.success("Customer created")
      onCreated(customer)
      setForm({ full_name: "", pan: "", phone: "", email: "", address: "" })
      onClose()
    } catch {
      message.error("Failed to create customer")
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
      okText="Add Customer"
      okButtonProps={{ className: "!bg-green-700 !border-green-700" }}
      title={<span className="font-bold text-base">Add New Customer</span>}
      destroyOnHidden
      width={520}
    >
      <div className="flex flex-col gap-4 py-2">
        <div className="grid grid-cols-2 gap-4">
          {FIELDS.map(({ key, label, required, placeholder, upper }) => (
            <div key={key} className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-500">
                {label} {required && <span className="text-red-500">*</span>}
              </label>
              <input
                className="h-10 rounded-lg border border-gray-300 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-600"
                placeholder={placeholder}
                value={form[key as keyof FormState]}
                onChange={e =>
                  setForm(f => ({
                    ...f,
                    [key]: upper ? e.target.value.toUpperCase() : e.target.value,
                  } as FormState))
                }
              />
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-gray-500">ADDRESS</label>
          <input
            className="h-10 rounded-lg border border-gray-300 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-600"
            placeholder="Enter address"
            value={form.address}
            onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
          />
        </div>
      </div>
    </Modal>
  )
}
