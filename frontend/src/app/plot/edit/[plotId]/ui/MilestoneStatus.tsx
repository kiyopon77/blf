// app/plot/edit/[plotId]/ui/MilestoneStatus.tsx
"use client"
import { useFieldArray, UseFormRegister, UseFormSetValue, Control, useWatch } from "react-hook-form"
import { useState } from "react"

const MILESTONES = [
  { key: "TOKEN", label: "Token" },
  { key: "ATS", label: "ATS" },
  { key: "SUPERSTRUCTURE", label: "Superstructure" },
  { key: "PROPERTY_ID", label: "Property ID" },
  { key: "REGISTRY", label: "Registry" },
  { key: "POSSESSION", label: "Possession" },
]

// What fraction of floor value each milestone gets per preset.
// null = derived from token input (Token + ATS share the first bucket)
const PRESETS: Record<string, Record<string, number | null>> = {
  "30:10:60": { TOKEN: null, ATS: null, SUPERSTRUCTURE: 0.10, PROPERTY_ID: 0, REGISTRY: 0.60, POSSESSION: 0 },
  "30:70":    { TOKEN: null, ATS: null, SUPERSTRUCTURE: 0.70, PROPERTY_ID: 0, REGISTRY: 0,    POSSESSION: 0 },
  "40:60":    { TOKEN: null, ATS: null, SUPERSTRUCTURE: 0.60, PROPERTY_ID: 0, REGISTRY: 0,    POSSESSION: 0 },
}

const PRESET_BUCKET: Record<string, number> = {
  "30:10:60": 0.30,
  "30:70":    0.30,
  "40:60":    0.40,
}

interface Props {
  control: Control<any>
  register: UseFormRegister<any>
  setValue: UseFormSetValue<any>
  floorValue: number | null
}

// handles milestone section functionality
const MilestoneSection = ({ control, register, setValue, floorValue }: Props) => {
  const { fields } = useFieldArray({ control, name: "payments" })
  const payments = useWatch({ control, name: "payments" })

  const [activePreset, setActivePreset] = useState<string | null>(null)
  const [tokenInput, setTokenInput] = useState<string>("")

  const applyPreset = (preset: string | null, token?: string) => {
    const tStr = token ?? tokenInput
    setActivePreset(preset)

    if (!preset || !floorValue || floorValue <= 0) return

    const cfg = PRESETS[preset]
    const bucket = PRESET_BUCKET[preset] * floorValue
    const tokenAmt = parseFloat(tStr) || 0
    const atsAmt = Math.max(0, bucket - tokenAmt)

    fields.forEach((_, index) => {
      const key = (fields[index] as any).milestone as string
      if (cfg[key] === null) {
        // Token / ATS
        const val = key === "TOKEN" ? tokenAmt : atsAmt
        setValue(`payments.${index}.amount`, val > 0 ? String(val) : "")
      } else {
        setValue(`payments.${index}.amount`, String(Math.round((cfg[key] as number) * floorValue)))
      }
    })
  }

  const handleTokenChange = (val: string) => {
    setTokenInput(val)
    if (activePreset) applyPreset(activePreset, val)
  }

  const clearPreset = () => {
    setActivePreset(null)
    setTokenInput("")
  }

  if (!fields.length) return (
    <p className="text-sm text-gray-400">No milestones found for this sale.</p>
  )

  const showTokenInput = !!activePreset

  return (
    <div className="flex flex-col gap-3">

      {/* Preset selector */}
      <div className="flex items-center gap-3 flex-wrap mb-1">
        <span className="text-xs font-semibold text-gray-400">PRESET:</span>
        {Object.keys(PRESETS).map(p => (
          <button
            key={p}
            type="button"
            onClick={() => applyPreset(p)}
            className={`px-3 py-1 text-xs font-semibold rounded-lg border transition-all ${
              activePreset === p
                ? "bg-green-700 text-white border-green-700"
                : "bg-white border-gray-300 text-gray-600 hover:bg-gray-50"
            }`}
          >
            {p}
          </button>
        ))}
        {activePreset && (
          <button
            type="button"
            onClick={clearPreset}
            className="px-3 py-1 text-xs font-semibold rounded-lg border border-gray-200 text-gray-400 hover:bg-gray-50"
          >
            Clear
          </button>
        )}
      </div>

      {/* Token amount input — shown when any preset is active */}
      {showTokenInput && (
        <div className="flex items-center gap-3 px-4 py-3 bg-amber-50 border border-amber-200 rounded-xl">
          <span className="text-xs font-semibold text-amber-700 whitespace-nowrap">TOKEN AMOUNT (₹)</span>
          <input
            type="number"
            value={tokenInput}
            onChange={e => handleTokenChange(e.target.value)}
            placeholder="Enter token amount first…"
            className="flex-1 h-9 rounded-lg border border-amber-300 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-600 bg-white"
          />
          {floorValue && tokenInput && (
            <span className="text-xs text-amber-600 whitespace-nowrap">
              ATS = ₹{Math.max(0, Math.round(PRESET_BUCKET[activePreset!] * floorValue - parseFloat(tokenInput))).toLocaleString("en-IN")}
            </span>
          )}
        </div>
      )}

      {/* Table header */}
      <div className="grid grid-cols-12 gap-4 px-4 pb-1 border-b border-gray-200">
        <span className="col-span-3 text-xs font-semibold text-gray-400">MILESTONE</span>
        <span className="col-span-3 text-xs font-semibold text-gray-400">AMOUNT (₹)</span>
        <span className="col-span-3 text-xs font-semibold text-gray-400">PAID ON</span>
        <span className="col-span-3 text-xs font-semibold text-gray-400">STATUS</span>
      </div>

      {fields.map((field, index) => {
        const isDone = payments?.[index]?.status === "DONE"
        const milestone = MILESTONES.find(m => m.key === (field as any).milestone)
        const isZeroed = activePreset && PRESETS[activePreset][(field as any).milestone] === 0
        return (
          <div
            key={field.id}
            className={`grid grid-cols-12 gap-4 items-center rounded-xl px-4 py-3 border transition-all ${
              isDone ? "bg-green-50 border-green-200" : "bg-white border-gray-200"
            } ${isZeroed ? "opacity-40" : ""}`}
          >
            <div className="col-span-3 flex items-center gap-3">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                isDone ? "bg-green-600 text-white" : "bg-gray-100 text-gray-500"
              }`}>
                {isDone ? "✓" : index + 1}
              </div>
              <span className="text-sm font-semibold text-gray-800">{milestone?.label}</span>
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
