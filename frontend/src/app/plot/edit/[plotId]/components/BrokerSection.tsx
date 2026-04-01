import { Control, Controller, UseFormWatch } from "react-hook-form"
import { Select } from "antd"
import { ReadOnlyField } from "./ui"
import type { EditPlotFormValues } from "../types"
import type { Broker } from "@/types/broker"

interface Props {
  control: Control<EditPlotFormValues>
  watch: UseFormWatch<EditPlotFormValues>
  brokers: Broker[]
  loadingBrokers: boolean
  onBrokerChange: (brokerIdOrObject: number | Broker | null) => void
  onAddNew: () => void
  isLocked?: boolean
}

export function BrokerSection({
  control,
  watch,
  brokers,
  loadingBrokers,
  onBrokerChange,
  onAddNew,
  isLocked,
}: Props) {
  return (
    <div className="grid grid-cols-2 gap-6">
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500 font-semibold">BROKER NAME</span>
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
          name="broker_id"
          control={control}
          render={({ field }) => (
            <Select
              showSearch
              allowClear
              disabled={isLocked}
              loading={loadingBrokers}
              placeholder="Select broker"
              value={field.value}
              onChange={onBrokerChange}
              optionFilterProp="label"
              options={brokers.map(b => ({ value: b.broker_id, label: b.broker_name ?? "Unnamed Broker" }))}
              className="w-full h-11"
            />
          )}
        />
      </div>
      <ReadOnlyField label="BROKER PHONE" value={watch("broker_phone")} />
    </div>
  )
}
