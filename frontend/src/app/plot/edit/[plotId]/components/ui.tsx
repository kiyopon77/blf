import { Tooltip } from "antd"

// ─── ReadOnlyField ────────────────────────────────────────────────────────────

export function ReadOnlyField({
  label,
  value,
  placeholder = "Auto-filled from selection",
}: {
  label: string
  value?: string
  placeholder?: string
}) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs text-gray-500 font-semibold">{label}</span>
      <div className="h-11 rounded-lg border border-gray-200 bg-gray-50 px-3 flex items-center text-sm overflow-hidden">
        {value ? (
          <span className="truncate text-gray-700">{value}</span>
        ) : (
          <span className="text-gray-400 italic">{placeholder}</span>
        )}
      </div>
    </div>
  )
}

// ─── PriceBadge ───────────────────────────────────────────────────────────────

type PriceBadgeVariant = "green" | "blue" | "red" | "neutral"

const BADGE_STYLES: Record<
  PriceBadgeVariant,
  { wrapper: string; label: string; value: string; dot: string }
> = {
  green: {
    wrapper: "bg-green-50 border-green-200",
    label:   "text-green-700",
    value:   "text-green-900",
    dot:     "bg-green-500",
  },
  blue: {
    wrapper: "bg-blue-50 border-blue-200",
    label:   "text-blue-700",
    value:   "text-blue-900",
    dot:     "bg-blue-500",
  },
  red: {
    wrapper: "bg-red-50 border-red-300",
    label:   "text-red-700",
    value:   "text-red-700",
    dot:     "bg-red-500",
  },
  neutral: {
    wrapper: "bg-gray-50 border-gray-200",
    label:   "text-gray-500",
    value:   "text-gray-800",
    dot:     "bg-gray-400",
  },
}

export function PriceBadge({
  label,
  amount,
  variant = "neutral",
  tooltip,
  sublabel,
}: {
  label: string
  amount?: number | string | null
  variant?: PriceBadgeVariant
  tooltip?: string
  sublabel?: string
}) {
  const num = typeof amount === "string" ? parseFloat(amount) : amount
  const formatted =
    num != null && !isNaN(num as number)
      ? `₹ ${(num as number).toLocaleString("en-IN")}`
      : "—"

  const s = BADGE_STYLES[variant]

  const el = (
    <div className={`flex flex-col gap-1 rounded-xl border px-4 py-3 ${s.wrapper}`}>
      <div className="flex items-center gap-1.5">
        <span className={`w-2 h-2 rounded-full shrink-0 ${s.dot}`} />
        <span className={`text-xs font-bold uppercase tracking-wide ${s.label}`}>{label}</span>
      </div>
      <span className={`text-xl font-bold ${s.value}`}>{formatted}</span>
      {sublabel && <span className="text-xs text-gray-400">{sublabel}</span>}
    </div>
  )

  return tooltip ? <Tooltip title={tooltip}>{el}</Tooltip> : el
}
