"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getPlotMatrix } from "@/services/plotMatrix"

type Plot = {
  plot: string
  floors: {
    floor: number
    status: "available" | "sold" | "hold" | "cancelled"
  }[]
}

const statusColor = {
  available: "bg-green-200 text-green-900",
  sold: "bg-red-200 text-red-900",
  hold: "bg-yellow-200 text-yellow-900",
  cancelled: "bg-gray-300 text-gray-800",
}

export default function PlotMatrix() {

  const router = useRouter()
  const [plots, setPlots] = useState<Plot[]>([])
  const [floors, setFloors] = useState<number[]>([])

  useEffect(() => {

    const load = async () => {

      const data = await getPlotMatrix()
      setPlots(data)

      const maxFloor = Math.max(
        ...data.flatMap((p: Plot) => p.floors.map((f) => f.floor))
      )

      const floorList = Array.from({ length: maxFloor }, (_, i) => i + 1)

      setFloors(floorList)
    }

    load()

  }, [])

  const goToPlot = (plot: string, floor: number) => {
    router.push(`/plot/${plot}-${floor}`)
  }

  if (!plots.length) return <div>Loading matrix...</div>

  return (
    <div className="px-10 pb-10">

      <div className="bg-white rounded-xl shadow p-8">

        <h2 className="text-xl font-semibold mb-8">
          Plot Status Matrix
        </h2>

        <table className="w-full">

          <thead>
            <tr className="text-gray-500 text-sm">

              <th className="w-16 text-left pb-4"></th>
              {floors.map((floor) => (
                <th key={floor} className="text-center pb-4">
                  {floor}
                </th>
              ))}

            </tr>
          </thead>

          <tbody>

            {plots.map((plot) => (

              <tr key={plot.plot}>

                <td className="w-16 font-semibold text-gray-700 pr-2">
                  {plot.plot}
                </td>
                {floors.map((floor) => {

                  const floorData = plot.floors.find(
                    (f) => f.floor === floor
                  )

                  if (!floorData) return <td key={floor}></td>

                  return (
                    <td key={floor} className="p-2">

                      <button
                        onClick={() =>
                          goToPlot(plot.plot, floor)
                        }
                        className={`w-full py-4 rounded-lg ${statusColor[floorData.status]}`}
                      >
                        {plot.plot}-{floor}
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
