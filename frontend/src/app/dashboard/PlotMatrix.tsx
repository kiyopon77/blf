"use client"
import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { getPlotMatrix } from "@/services/plotMatrix"
import { ThreeDot } from "react-loading-indicators"

type FloorItem = {
  floor: number
  floor_id: number
  status: "available" | "sold" | "hold" | "cancelled" | "investor_unit"
  active_sale_id: number | null
  sale_status?: string | null
  broker_name?: string | null
  last_changed_by?: string | null
  last_changed_at?: string | null
}

type Plot = {
  plot: string
  plot_id: number
  area_sqyd?: number
  area_sqft?: number
  floors: FloorItem[]
}

const statusConfig: Record<
  FloorItem["status"],
  { bg: string; text: string; dot: string; label: string }
> = {
  available:    { bg: "bg-white",        text: "text-black",      dot: "bg-white border",   label: "Available" },
  sold:         { bg: "bg-green-200",      text: "text-green-900",    dot: "bg-green-500",    label: "Sold" },
  hold:         { bg: "bg-yellow-200",   text: "text-yellow-900", dot: "bg-yellow-400", label: "Hold" },
  cancelled:    { bg: "bg-gray-300",     text: "text-gray-800",   dot: "bg-gray-500",   label: "Cancelled" },
  investor_unit:{ bg: "bg-blue-200",     text: "text-blue-900",   dot: "bg-[#213B8D]",   label: "Investor Unit" },
}

const parsePlotLabel = (label: string) => {
  const match = label.match(/^([A-Za-z]*)(\d*)$/)
  return { alpha: match?.[1] ?? "", num: match?.[2] ? parseInt(match[2], 10) : -1 }
}

const sortPlots = (plots: Plot[]): Plot[] =>
  [...plots].sort((a, b) => {
    const aP = parsePlotLabel(a.plot)
    const bP = parsePlotLabel(b.plot)
    const aIsNumOnly = aP.alpha === ""
    const bIsNumOnly = bP.alpha === ""
    if (aIsNumOnly !== bIsNumOnly) return aIsNumOnly ? 1 : -1
    if (aP.alpha !== bP.alpha) return aP.alpha.localeCompare(bP.alpha)
    return aP.num - bP.num
  })

function formatDate(dateStr?: string | null) {
  if (!dateStr) return null
  try {
    return new Intl.DateTimeFormat("en-IN", {
      day: "2-digit", month: "short", year: "numeric",
      hour: "2-digit", minute: "2-digit", hour12: true,
    }).format(new Date(dateStr))
  } catch {
    return dateStr
  }
}

type TooltipState = {
  floor: FloorItem
  plotCode: string
  x: number
  y: number
} | null

function Tooltip({ data }: { data: NonNullable<TooltipState> }) {
  const { floor, plotCode } = data
  const cfg = statusConfig[floor.status]

  const rows: { label: string; value: string | null | undefined }[] = [
    { label: "Unit",         value: `${plotCode}-${floor.floor}` },
    { label: "Status",       value: cfg.label },
    { label: "Sale Status",  value: floor.sale_status },
    { label: "Broker",       value: floor.broker_name },
    { label: "Changed By",   value: floor.last_changed_by },
    { label: "Changed At",   value: formatDate(floor.last_changed_at) },
  ]

  return (
    <div
      className="fixed z-50 pointer-events-none"
      style={{ left: data.x, top: data.y }}
    >
      <div className="bg-white border border-gray-200 rounded-xl shadow-2xl shadow-black/10 w-56 overflow-hidden">
        {/* Header */}
        <div className={`px-4 py-3 ${cfg.bg} border-b border-gray-100`}>
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full shrink-0 ${cfg.dot}`} />
            <span className={`text-sm font-semibold ${cfg.text}`}>{cfg.label}</span>
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
                <span className="text-gray-700 font-medium text-right truncate">{value}</span>
              </div>
            ) : null
          )}
          {!rows.slice(2).some(r => r.value) && (
            <p className="text-xs text-gray-400 italic">No additional info</p>
          )}
        </div>
      </div>
      {/* Arrow */}
      <div className="absolute -top-[6px] left-5 w-3 h-3 bg-white border-l border-t border-gray-200 rotate-45" />
    </div>
  )
}

export default function PlotMatrix() {
  const router = useRouter()
  const [plots, setPlots] = useState<Plot[]>([])
  const [floorList, setFloorList] = useState<number[]>([])
  const [tooltip, setTooltip] = useState<TooltipState>(null)
  const tooltipTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const load = async () => {
      const data = await getPlotMatrix()
      setPlots(data)
      const maxFloor = Math.max(
        ...data.flatMap((p: Plot) => p.floors.map((f) => f.floor))
      )
      setFloorList(Array.from({ length: maxFloor }, (_, i) => i + 1))
    }
    load()
  }, [])

  const handleMouseEnter = (
    e: React.MouseEvent,
    floor: FloorItem,
    plotCode: string
  ) => {
    if (tooltipTimerRef.current) clearTimeout(tooltipTimerRef.current)
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
    setTooltip({
      floor,
      plotCode,
      x: rect.left,
      y: rect.bottom + 8,
    })
  }

  const handleMouseLeave = () => {
    tooltipTimerRef.current = setTimeout(() => setTooltip(null), 120)
  }

  const goToFloor = (floor: FloorItem, plotCode: string) => {
    router.push(`/plot/${plotCode}-${floor.floor}`)
  }

  if (!plots.length)
    return (
      <div className="h-screen w-screen flex items-center justify-center">
        <ThreeDot color="#D4A22A" size="medium" text="" textColor="" />
      </div>
    )

  const sortedPlots = sortPlots(plots)

  return (
    <div className="px-10 pb-10">
      {tooltip && <Tooltip data={tooltip} />}

      <div className="bg-white rounded-xl shadow p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-semibold text-gray-800">Plot Status Matrix</h2>

          {/* Legend */}
          <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
            {Object.entries(statusConfig).map(([status, cfg]) => (
              <div key={status} className="flex items-center gap-1.5">
                <span className={`w-4 h-4 rounded-full ${cfg.dot}`} />
                <span className="text-base">{cfg.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div
          className="grid gap-y-2"
          style={{
            gridTemplateColumns: `5rem repeat(${floorList.length}, minmax(0, 1fr))`,
          }}
        >
          {/* Column headers */}
          <div /> {/* empty corner */}
          {floorList.map((floor) => (
            <div
              key={floor}
              className="text-center text-xs font-medium text-gray-400 pb-3 tracking-wide uppercase"
            >
              Floor {floor}
            </div>
          ))}

          {/* Rows */}
          {sortedPlots.map((plot) => (
            <>
              {/* Row label */}
              <div
                key={`label-${plot.plot_id}`}
                className="flex flex-col justify-center pr-3 py-1"
              >
                <span className="text-base font-semibold text-gray-700 leading-tight">
                  {plot.plot}
                </span>
                {plot.area_sqft && (
                  <span className="text-sm text-gray-600 leading-tight">
                    {plot.area_sqft} sqft
                  </span>
                )}
                {plot.area_sqyd && (
                  <span className="text-sm text-gray-400 leading-tight">
                    {plot.area_sqyd} sqyd
                  </span>
                )}
              </div>

              {/* Floor cells */}
              {floorList.map((floorNo) => {
                const floorData = plot.floors.find((f) => f.floor === floorNo)
                if (!floorData)
                  return (
                    <div
                      key={`${plot.plot_id}-${floorNo}-empty`}
                      className="p-1"
                    />
                  )

                const cfg = statusConfig[floorData.status]

                return (
                  <div key={`${plot.plot_id}-${floorNo}`} className="p-1">
                    <button
                      onClick={() => goToFloor(floorData, plot.plot)}
                      onMouseEnter={(e) =>
                        handleMouseEnter(e, floorData, plot.plot)
                      }
                      onMouseLeave={handleMouseLeave}
                      className={`
                        w-full py-4 rounded-lg text-sm font-medium
                        transition-all duration-150
                        hover:scale-105 hover:shadow-md hover:z-10 relative
                        border border-transparent hover:border-gray-200
                        ${cfg.bg} ${cfg.text}
                      `}
                    >
                      {plot.plot}-{floorData.floor}
                    </button>
                  </div>
                )
              })}
            </>
          ))}
        </div>
      </div>
    </div>
  )
}
