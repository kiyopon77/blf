// app/plot/edit/[plotId]/components/CustomerSection.tsx
import { Control, Controller, UseFormWatch } from "react-hook-form"
import { Select } from "antd"
import { ReadOnlyField } from "./ui"
import type { EditPlotFormValues } from "../types"
import type { Customer } from "@/types/customer"

interface Props {
  control: Control<EditPlotFormValues>
  watch: UseFormWatch<EditPlotFormValues>
  customers: Customer[]
  loadingCustomers: boolean
  onCustomerChange: (customerIdOrObject: number | Customer | null) => void
  onAddNew: () => void
  isLocked?: boolean
}
 
// handles customer section functionality
export function CustomerSection({
  control,
  watch,
  customers,
  loadingCustomers,
  onCustomerChange,
  onAddNew,
  isLocked,
}: Props) {
  return (
    <div className="grid grid-cols-2 gap-6">
      {/* Dropdown — spans first col, full row on mobile */}
      <div className="flex flex-col gap-1 col-span-2 md:col-span-1">
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500 font-semibold">CUSTOMER NAME</span>
          {!isLocked && (
            <button
              type="button"
              onClick={onAddNew}
              className="text-xs text-green-700 font-semibold hover:underline"
            >
              + Add New
            </button>
          )}
        </div>
        <Controller
          name="customer_id"
          control={control}
          render={({ field }) => (
            <Select
              showSearch
              allowClear
              disabled={isLocked}
              loading={loadingCustomers}
              placeholder="Select customer"
              value={field.value}
              onChange={onCustomerChange}
              optionFilterProp="label"
              options={customers.map(c => ({ value: c.customer_id, label: c.full_name }))}
              className="w-full h-11"
            />
          )}
        />
      </div>
 
      {/* Auto-filled read-only fields */}
      <ReadOnlyField label="PAN"   value={watch("customer_pan")}   placeholder="Auto-filled" />
      <ReadOnlyField label="PHONE" value={watch("customer_phone")} placeholder="Auto-filled" />
      <ReadOnlyField label="EMAIL" value={watch("customer_email")} placeholder="Auto-filled" />
      <div className="col-span-2">
        <ReadOnlyField label="ADDRESS" value={watch("customer_address")} placeholder="Auto-filled" />
      </div>
    </div>
  )
}
 
