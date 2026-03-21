"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getPlotMatrix } from "@/services/plotMatrix"
import { ThreeDot } from "react-loading-indicators"

type FloorItem = {
  floor: number
  floor_id: number
  status: "available" | "sold" | "hold" | "cancelled" | "investor_unit"
  active_sale_id: number | null
}

type Plot = {
  plot: string
  plot_id: number
  floors: FloorItem[]
}

// const statusColor: Record<FloorItem["status"], string> = {
//   available: "bg-white text-black border-2 border-black",
//   sold: "bg-red-200 text-red-900 border-2 border-red-900",
//   hold: "bg-yellow-200 text-yellow-900 border-2 border-yellow-900",
//   cancelled: "bg-gray-300 text-gray-800 border-2 border-gray-300",
//   investor_unit: "bg-blue-200 text-blue-900 border-2 border-blue-900",
// }

const statusColor: Record<FloorItem["status"], string> = {
  available: "bg-white text-black",
  sold: "bg-red-200 text-red-900",
  hold: "bg-yellow-200 text-yellow-900",
  cancelled: "bg-gray-300 text-gray-800",
  investor_unit: "bg-blue-200 text-blue-900",
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

export default function PlotMatrix() {
  const router = useRouter()
  const [plots, setPlots] = useState<Plot[]>([])
  const [floorList, setFloorList] = useState<number[]>([])

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

  const goToFloor = (floor: FloorItem, plotCode: string) => {
    router.push(`/plot/${plotCode}-${floor.floor}`)
  }

  if (!plots.length) return <div className="h-screen w-screen flex items-center justify-center">
      <ThreeDot color="#D4A22A" size="medium" text="" textColor="" />
    </div>


  const sortedPlots = sortPlots(plots)

  return (
    <div className="px-10 pb-10">
      <div className="bg-white rounded-xl shadow p-8">

        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-semibold">Plot Status Matrix</h2>

          {/* Legend */}
          <div className="flex items-center gap-4 text-xs text-gray-600">
            {Object.entries(statusColor).map(([status, classes]) => (
              <div key={status} className="flex items-center gap-1.5">
                <span className={`w-3 h-3 rounded-sm ${classes.split(" ")[0]}`} />
                <span className="capitalize">{status.replace("_", " ")}</span>
              </div>
            ))}
          </div>
        </div>

        <table className="w-full">
          <thead>
            <tr className="text-gray-500 text-sm">
              <th className="w-16 text-left pb-4"></th>
              {floorList.map((floor) => (
                <th key={floor} className="text-center pb-4">
                  Floor {floor}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedPlots.map((plot) => (
              <tr key={plot.plot_id}>
                <td className="w-16 font-semibold text-gray-700 pr-2">
                  {plot.plot}
                </td>
                {floorList.map((floorNo) => {
                  const floorData = plot.floors.find((f) => f.floor === floorNo)
                  if (!floorData) return <td key={floorNo} />
                  return (
                    <td key={floorNo} className="p-2">
                      <button
                        onClick={() => goToFloor(floorData, plot.plot)}
                        className={`w-full py-4 rounded-lg hover:scale-105 hover:cursor-pointer transition-all ${statusColor[floorData.status]}`}
                      >
                        {plot.plot}-{floorData.floor}
                      </button>
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
