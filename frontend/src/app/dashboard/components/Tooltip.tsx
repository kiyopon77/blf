// app/dashboard/components/Tooltip.tsx
"use client"

export type FloorItem = {
  floor: number
  floor_id: number
  status: "available" | "sold" | "hold" | "cancelled" | "investor_unit"
  active_sale_id: number | null
  sale_status?: string | null
  broker_name?: string | null
  last_changed_by?: string | null
  last_changed_at?: string | null
}

const statusConfig: Record<
  FloorItem["status"],
  { bg: string; text: string; dot: string; label: string }
> = {
  available:    { bg: "bg-white", text: "text-black", dot: "bg-white border", label: "Available" },
  sold:         { bg: "bg-green-200", text: "text-green-900", dot: "bg-green-500", label: "Sold" },
  hold:         { bg: "bg-yellow-200", text: "text-yellow-900", dot: "bg-yellow-400", label: "Hold" },
  cancelled:    { bg: "bg-gray-300", text: "text-gray-800", dot: "bg-gray-500", label: "Cancelled" },
  investor_unit:{ bg: "bg-blue-200", text: "text-blue-900", dot: "bg-[#213B8D]", label: "Investor Unit" },
}

function formatDate(dateStr?: string | null) {
  if (!dateStr) return null
  try {
    return new Intl.DateTimeFormat("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }).format(new Date(dateStr))
  } catch {
    return dateStr
  }
}

export type TooltipState = {
  floor: FloorItem
  plotCode: string
  x: number
  y: number
}

// handles plot tooltip functionality
export default function PlotTooltip({ data }: { data: TooltipState }) {
  const { floor, plotCode } = data
  const cfg = statusConfig[floor.status]

  const rows = [
    { label: "Unit", value: `${plotCode}-${floor.floor}` },
    { label: "Status", value: cfg.label },
    { label: "Sale Status", value: floor.sale_status },
    { label: "Broker", value: floor.broker_name },
    { label: "Changed By", value: floor.last_changed_by },
    { label: "Changed At", value: formatDate(floor.last_changed_at) },
  ]

  return (
    <div
      className="fixed z-50 pointer-events-none"
      style={{ left: data.x, top: data.y }}
    >
      <div className="bg-white border border-gray-200 rounded-xl shadow-2xl shadow-black/10 w-70 overflow-hidden">
        {/* Header */}
        <div className={`px-4 py-3 ${cfg.bg} border-b border-gray-100`}>
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full shrink-0 ${cfg.dot}`} />
            <span className={`text-sm font-semibold ${cfg.text}`}>
              {cfg.label}
            </span>
          </div>
          <div className="text-xs text-gray-400 mt-0.5 font-mono">
            {plotCode}-F{floor.floor}
          </div>
        </div>

        {/* Body */}
        <div className="px-4 py-3 space-y-2">
          {rows.slice(2).map(({ label, value }) =>
            value ? (
              <div key={label} className="flex justify-between gap-3 text-xs">
                <span className="text-gray-400 shrink-0">{label}</span>
                <span className="text-gray-700 font-medium text-right truncate">
                  {value}
                </span>
              </div>
            ) : null
          )}

          {!rows.slice(2).some((r) => r.value) && (
            <p className="text-xs text-gray-400 italic">
              No additional info
            </p>
          )}
        </div>
      </div>

      {/* Arrow */}
      <div className="absolute -top-1.5 left-5 w-3 h-3 bg-white border-l border-t border-gray-200 rotate-45" />
    </div>
  )
}
