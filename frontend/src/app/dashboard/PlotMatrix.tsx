"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getPlotMatrix } from "@/services/plotMatrix"

type FloorItem = {
  floor: number
  floor_id: number
  status: "available" | "sold" | "hold" | "cancelled"
  active_sale_id: number | null
}

type Plot = {
  plot: string
  plot_id: number
  floors: FloorItem[]
}

const statusColor: Record<FloorItem["status"], string> = {
  available: "bg-green-200 text-green-900",
  sold: "bg-red-200 text-red-900",
  hold: "bg-yellow-200 text-yellow-900",
  cancelled: "bg-gray-300 text-gray-800",
}

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

  if (!plots.length) return <div>Loading matrix...</div>

  return (
    <div className="px-10 pb-10">
      <div className="bg-white rounded-xl shadow p-8">
        <h2 className="text-xl font-semibold mb-8">Plot Status Matrix</h2>
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
            {plots.map((plot) => (
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
