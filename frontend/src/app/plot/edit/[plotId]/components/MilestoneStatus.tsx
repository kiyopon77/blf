"use client"
import { useFieldArray, Control, useWatch } from "react-hook-form"

const MILESTONES = [
  { key: "TOKEN", label: "Token" },
  { key: "ATS", label: "ATS" },
  { key: "SUPERSTRUCTURE", label: "Superstructure" },
  { key: "PROPERTY_ID", label: "Property ID" },
  { key: "REGISTRY", label: "Registry" },
  { key: "POSSESSION", label: "Possession" },
]

type Props = {
  control: Control<any>
  register: any
}

const MilestoneSection = ({ control, register }: Props) => {
  const { fields } = useFieldArray({ control, name: "payments" })
  const payments = useWatch({ control, name: "payments" })

  if (!fields.length) return (
    <p className="text-sm text-gray-400">No milestones found for this sale.</p>
  )

  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-12 gap-4 px-4 pb-1 border-b border-gray-200">
        <span className="col-span-3 text-xs font-semibold text-gray-400">MILESTONE</span>
        <span className="col-span-3 text-xs font-semibold text-gray-400">AMOUNT (₹)</span>
        <span className="col-span-3 text-xs font-semibold text-gray-400">PAID ON</span>
        <span className="col-span-3 text-xs font-semibold text-gray-400">STATUS</span>
      </div>

      {fields.map((field, index) => {
        const isDone = payments?.[index]?.status === "DONE"
        const milestone = MILESTONES.find(m => m.key === (field as any).milestone)

        return (
          <div
            key={field.id}
            className={`grid grid-cols-12 gap-4 items-center rounded-xl px-4 py-3 border transition-all ${
              isDone ? "bg-green-50 border-green-200" : "bg-white border-gray-200"
            }`}
          >
            <div className="col-span-3 flex items-center gap-3">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                isDone ? "bg-green-600 text-white" : "bg-gray-100 text-gray-500"
              }`}>
                {isDone ? "✓" : index + 1}
              </div>
              <span className="text-sm font-semibold text-gray-800">
                {milestone?.label}
              </span>
            </div>

            <div className="col-span-3">
              <input
                {...register(`payments.${index}.amount`)}
                type="number"
                placeholder="—"
                className="w-full h-9 rounded-lg border border-gray-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-600"
              />
            </div>

            <div className="col-span-3">
              <input
                {...register(`payments.${index}.paid_at`)}
                type="date"
                className="w-full h-9 rounded-lg border border-gray-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-600"
              />
            </div>

            <div className="col-span-3">
              <select
                {...register(`payments.${index}.status`)}
                className={`w-full h-9 rounded-lg border px-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-green-600 ${
                  isDone ? "bg-green-100 border-green-300 text-green-700" : "border-gray-200 text-gray-600"
                }`}
              >
                <option value="PENDING">Pending</option>
                <option value="DONE">Done</option>
              </select>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default MilestoneSection
