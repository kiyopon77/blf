// app/plot/edit/[plotId]/ui/StatusRadio.tsx
"use client"
import { Radio } from "antd"

type Props = {
  label: string
  value: string
  onChange?: (val: string) => void
}

// handles status radio functionality
const StatusRadio = ({ label, value, onChange }: Props) => {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-xs text-gray-500 font-semibold">
        {label}
      </span>

      <Radio.Group
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
      >
        <Radio value="DONE">
          <span className="text-green-600 font-semibold">Completed</span>
        </Radio>

        <Radio value="PENDING">
          <span className="text-gray-500">Pending</span>
        </Radio>
      </Radio.Group>
    </div>
  )
}

export default StatusRadio
