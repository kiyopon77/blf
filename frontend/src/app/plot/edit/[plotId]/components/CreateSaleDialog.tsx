// app/plot/edit/[plotId]/components/CreateSaleDialog.tsx
import { useEffect, useState } from "react"
import { App, Modal, Select } from "antd"
import { createSale } from "@/services/admin/sales"
import type { Broker } from "@/types/broker"
import type { Customer } from "@/types/customer"

interface Props {
  open: boolean
  onClose: () => void
  onCreated: (sale: any) => void
  floorId: number | null
  /** floor_value from FloorResponse — shown for reference only, not part of SaleCreate */
  floorValue?: number | null
  brokerId: number | null
  customerId: number | null
  brokers: Broker[]
  customers: Customer[]
}

// handles create sale dialog functionality
export function CreateSaleDialog({
  open,
  onClose,
  onCreated,
  floorId,
  floorValue,
  brokerId,
  customerId,
  brokers,
  customers,
}: Props) {
  const { message } = App.useApp()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    broker_id: brokerId,
    customer_id: customerId,
    total_value: "",
    commission_percent: "",
  })

  // Pre-fill from existing form selections when dialog opens
  useEffect(() => {
    if (open) setForm(f => ({ ...f, broker_id: brokerId, customer_id: customerId }))
  }, [open, brokerId, customerId])

  const isValid =
    !!floorId &&
    !!form.broker_id &&
    !!form.customer_id &&
    !!form.total_value &&
    !isNaN(parseFloat(form.total_value))

  const handleSubmit = async () => {
    if (!isValid) {
      message.error("Floor, broker, customer and sale value are all required")
      return
    }
    setLoading(true)
    try {
      const sale = await createSale({
        floor_id: floorId!,
        broker_id: form.broker_id!,
        customer_id: form.customer_id!,
        total_value: parseFloat(form.total_value),
        commission_percent: form.commission_percent
          ? parseFloat(form.commission_percent)
          : undefined,
      })
      message.success("Sale created — payment milestones unlocked!")
      onCreated(sale)
      setForm({ broker_id: null, customer_id: null, total_value: "", commission_percent: "" })
      onClose()
    } catch {
      message.error("Failed to create sale")
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
      okText="Create Sale"
      okButtonProps={{ className: "!bg-green-700 !border-green-700", disabled: !isValid }}
      title={<span className="font-bold text-base">Create Sale</span>}
      destroyOnHidden
      width={540}
    >
      <p className="text-sm text-gray-500 mb-4">
        This creates a sale record and unlocks the Payment Milestones section.
        Broker, customer, and sale value are all required.
      </p>

      {/* Floor base value — reference only, not editable here */}
      {floorValue != null && (
        <div className="mb-5 flex items-center gap-3 rounded-xl bg-blue-50 border border-blue-200 px-4 py-3">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shrink-0" />
          <div>
            <p className="text-xs font-bold text-blue-700 uppercase tracking-wide">Floor Base Value</p>
            <p className="text-base font-bold text-blue-900">
              ₹ {floorValue.toLocaleString("en-IN")}
            </p>
          </div>
          <span className="ml-auto text-xs text-blue-500 bg-blue-100 px-2 py-0.5 rounded-full">
            Reference only
          </span>
        </div>
      )}

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-gray-500">
            BROKER <span className="text-red-500">*</span>
          </label>
          <Select
            showSearch
            allowClear
            placeholder="Select broker"
            value={form.broker_id}
            onChange={val => setForm(f => ({ ...f, broker_id: val ?? null }))}
            optionFilterProp="label"
            options={brokers.map(b => ({ value: b.broker_id, label: b.broker_name }))}
            className="w-full h-10"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-gray-500">
            CUSTOMER <span className="text-red-500">*</span>
          </label>
          <Select
            showSearch
            allowClear
            placeholder="Select customer"
            value={form.customer_id}
            onChange={val => setForm(f => ({ ...f, customer_id: val ?? null }))}
            optionFilterProp="label"
            options={customers.map(c => ({ value: c.customer_id, label: c.full_name }))}
            className="w-full h-10"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-500">
              SALE VALUE <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">₹</span>
              <input
                className="h-10 w-full rounded-lg border border-green-300 bg-green-50 pl-7 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Agreed sale price"
                type="number"
                value={form.total_value}
                onChange={e => setForm(f => ({ ...f, total_value: e.target.value }))}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-500">COMMISSION %</label>
            <div className="relative">
              <input
                className="h-10 w-full rounded-lg border border-gray-300 pl-3 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-green-600"
                placeholder="0.0"
                type="number"
                step="0.01"
                value={form.commission_percent}
                onChange={e => setForm(f => ({ ...f, commission_percent: e.target.value }))}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">%</span>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  )
}
