"use client"

import { useEffect, useRef, useState } from "react"
import { getPlotMatrix } from "@/services/plotMatrix"
import { ThreeDot } from "react-loading-indicators"
import PlotTooltip, { TooltipState, FloorItem } from "./components/Tooltip"
import { useAuth } from "@/context/AuthContext"

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
  available: { bg: "bg-white", text: "text-black", dot: "bg-white border", label: "Available" },
  sold: { bg: "bg-green-200", text: "text-green-900", dot: "bg-green-500", label: "Sold" },
  hold: { bg: "bg-yellow-200", text: "text-yellow-900", dot: "bg-yellow-400", label: "Hold" },
  cancelled: { bg: "bg-gray-300", text: "text-gray-800", dot: "bg-gray-500", label: "Cancelled" },
  investor_unit: { bg: "bg-blue-200", text: "text-blue-900", dot: "bg-[#213B8D]", label: "Investor Unit" },
}

const parsePlotLabel = (label: string) => {
  const match = label.match(/^([A-Za-z]*)(\d*)$/)
  return {
    alpha: match?.[1] ?? "",
    num: match?.[2] ? parseInt(match[2], 10) : -1,
  }
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

export default function PlotMatrix({
  filter,
  onStatusChange,
}: {
  filter: string | null
  onStatusChange: (oldStatus: string, newStatus: string) => void
}) {
  const [plots, setPlots] = useState<Plot[]>([])
  const [floorList, setFloorList] = useState<number[]>([])
  const [tooltip, setTooltip] = useState<TooltipState | null>(null)
  const [loading, setLoading] = useState(true)
  const tooltipTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const { user_society_id } = useAuth()

  useEffect(() => {
    const load = async () => {
      if (!user_society_id) return

      setLoading(true)

      const data = await getPlotMatrix(user_society_id)
      setPlots(data)

      const maxFloor = Math.max(
        ...data.flatMap((p: Plot) => p.floors.map((f) => f.floor))
      )

      setFloorList(
        isFinite(maxFloor) ? Array.from({ length: maxFloor }, (_, i) => i + 1) : []
      )

      setLoading(false)
    }

    load()
  }, [user_society_id])

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
    tooltipTimerRef.current = setTimeout(() => {
      setTooltip(null)
    }, 200)
  }

  const handleStatusChange = (floorId: number, newStatus: string) => {
    let oldStatusValue: string | null = null

    // find old status
    for (const plot of plots) {
      const floor = plot.floors.find((f) => f.floor_id === floorId)
      if (floor) {
        oldStatusValue = floor.status
        break
      }
    }

    if (!oldStatusValue) return

    // update UI
    setPlots((prev) =>
      prev.map((plot) => ({
        ...plot,
        floors: plot.floors.map((f) =>
          f.floor_id === floorId
            ? { ...f, status: newStatus.toLowerCase() as any }
            : f
        ),
      }))
    )

    // update dashboard counts
    onStatusChange(oldStatusValue, newStatus)

    setTooltip(null)
  }

  const sortedPlots = sortPlots(plots)

  const filteredPlots = sortedPlots
    .map((plot) => {
      if (!filter) return plot

      const filteredFloors = plot.floors.filter((f) => {
        switch (filter) {
          case "available":
            return f.status === "available"
          case "sold":
            return f.status === "sold"
          case "on hold":
            return f.status === "hold"
          case "cancelled":
            return f.status === "cancelled"
          case "investor unit":
            return f.status === "investor_unit"
          case "total floors":
            return true
          default:
            return true
        }
      })

      return {
        ...plot,
        floors: filteredFloors,
      }
    })
    .filter((plot) => plot.floors.length > 0)

  if (loading)
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <ThreeDot color="#D4A22A" size="medium" text="" textColor="" />
      </div>
    )

  if (!plots.length)
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <p className="text-gray-500 text-lg font-medium">
          No plots available
        </p>
      </div>
    )

  return (
    <div className="px-10 pb-10">
      {tooltip && (
        <PlotTooltip
          data={tooltip}
          onStatusChange={handleStatusChange}
          onMouseEnter={() => {
            if (tooltipTimerRef.current) clearTimeout(tooltipTimerRef.current)
          }}
          onMouseLeave={() => {
            tooltipTimerRef.current = setTimeout(() => setTooltip(null), 200)
          }}
        />
      )}

      <div className="bg-white rounded-xl shadow p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-semibold text-gray-800">
            Plot Status Matrix
          </h2>

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
          <div />
          {floorList.map((floor) => (
            <div
              key={floor}
              className="text-center text-xs font-medium text-gray-400 pb-3 tracking-wide uppercase"
            >
              Floor {floor}
            </div>
          ))}

          {/* Rows */}
          {filteredPlots.map((plot) => (
            <div key={plot.plot_id} className="contents">
              {/* Plot label */}
              <div className="flex flex-col justify-center pr-3 py-1">
                <span className="text-base font-semibold text-gray-700">
                  {plot.plot}
                </span>

                {plot.area_sqft && (
                  <span className="text-sm text-gray-600">
                    {plot.area_sqft} sqft
                  </span>
                )}

                {plot.area_sqyd && (
                  <span className="text-sm text-gray-400">
                    {plot.area_sqyd} sqyd
                  </span>
                )}
              </div>

              {/* Floor cells */}
              {floorList.map((floorNo) => {
                const floorData = plot.floors.find(
                  (f) => f.floor === floorNo
                )

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
                      onMouseEnter={(e) =>
                        handleMouseEnter(e, floorData, plot.plot)
                      }
                      onMouseLeave={handleMouseLeave}
                      className={`
                        w-full py-4 rounded-lg text-sm font-medium
                        transition-all duration-150
                        hover:scale-105 hover:shadow-md hover:z-10 relative
                        border border-transparent hover:border-gray-200 cursor-pointer
                        ${cfg.bg} ${cfg.text}
                      `}
                    >
                      {plot.plot}-{floorData.floor}
                    </button>
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
