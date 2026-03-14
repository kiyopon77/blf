"use client"

import { useRouter } from "next/navigation"

type Plot = {
  plot: string
  floors: {
    floor: string
    status: "available" | "sold" | "hold" | "cancelled"
  }[]
}

const floors = ["1st", "2nd", "3rd", "4th"]

const plots: Plot[] = [
  {
    plot: "C1",
    floors: [
      { floor: "1", status: "available" },
      { floor: "2", status: "sold" },
      { floor: "3", status: "hold" },
      { floor: "4", status: "available" },
    ],
  },
  {
    plot: "C2",
    floors: [
      { floor: "1", status: "sold" },
      { floor: "2", status: "available" },
      { floor: "3", status: "hold" },
      { floor: "4", status: "sold" },
    ],
  },
  {
    plot: "C3",
    floors: [
      { floor: "1", status: "available" },
      { floor: "2", status: "available" },
      { floor: "3", status: "sold" },
      { floor: "4", status: "hold" },
    ],
  },
  {
    plot: "C4",
    floors: [
      { floor: "1", status: "hold" },
      { floor: "2", status: "sold" },
      { floor: "3", status: "available" },
      { floor: "4", status: "cancelled" },
    ],
  },
  {
    plot: "C5",
    floors: [
      { floor: "1", status: "hold" },
      { floor: "2", status: "sold" },
      { floor: "3", status: "available" },
      { floor: "4", status: "available" },
    ],
  },
]

const statusColor = {
  available: "bg-green-200 text-green-900",
  sold: "bg-red-200 text-red-900",
  hold: "bg-yellow-200 text-yellow-900",
  cancelled: "bg-gray-300 text-gray-800",
}

const PlotMatrix = () => {
  const router = useRouter()

  const goToPlot = (plot: string, floor: string) => {
    router.push(`/plot/${plot}-${floor}`)
  }

  return (
    <div className="px-10 pb-10">

      <div className="bg-white rounded-xl shadow p-8">

        {/* Header */}
        <div className="flex justify-between items-center mb-8">

          <h2 className="text-xl font-semibold">
            Plot Status Matrix
          </h2>

          <div className="flex gap-6 text-sm">

            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-green-400"></span>
              Available
            </div>

            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-400"></span>
              Sold
            </div>

            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-yellow-400"></span>
              On Hold
            </div>

            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-gray-400"></span>
              Cancelled
            </div>

          </div>
        </div>

        {/* Matrix */}
        <div className="overflow-x-auto">

          <table className="w-full">

            <thead>
              <tr className="text-gray-500 text-sm">
                <th className="w-20 text-left pb-4"></th>

                {floors.map((floor) => (
                  <th
                    key={floor}
                    className="text-center pb-4 font-medium"
                  >
                    {floor}
                  </th>
                ))}

              </tr>
            </thead>

            <tbody>

              {plots.map((plot) => (
                <tr key={plot.plot}>

                  {/* Plot Label */}
                  <td className="font-semibold text-gray-700 pr-4">
                    {plot.plot}
                  </td>

                  {plot.floors.map((floor) => (
                    <td key={floor.floor} className="p-2">

                      <button
                        onClick={() =>
                          goToPlot(plot.plot, floor.floor)
                        }
                        className={`w-full py-4 rounded-lg font-medium transition hover:scale-105 ${statusColor[floor.status]}`}
                      >
                        {plot.plot}-{floor.floor}
                      </button>

                    </td>
                  ))}

                </tr>
              ))}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  )
}

export default PlotMatrix
