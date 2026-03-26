// components/PlotSection.tsx
"use client"

import { useEffect, useState } from "react"
import { getPlotFloors } from "@/services/admin/floor"
import FloorTable from "./FloorTable"
import FloorCreateModal from "./modals/FloorCreateModal"

const PlotSection = ({ plot }: any) => {
  const [floors, setFloors] = useState([])
  const [loading, setLoading] = useState(true)
  const [createOpen, setCreateOpen] = useState(false)

  useEffect(() => {
    const fetchFloors = async () => {
      try {
        const data = await getPlotFloors(plot.plot_id)
        setFloors(data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchFloors()
  }, [plot.plot_id])

  return (
    <div className="border rounded-xl p-5 bg-white shadow-sm">

      {/* 🔥 Plot Header */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-xl font-semibold">
            {plot.plot_code}
          </h2>
          <div className="flex gap-4 mt-2">
            <div className="bg-gray-100 px-3 py-1 rounded-md text-sm font-medium">
              {plot.area_sqft || "-"} sqft
            </div>

            <div className="bg-gray-100 px-3 py-1 rounded-md text-sm font-medium">
              {plot.area_sqyd || "-"} sqyd
            </div>

            <div className="bg-gray-100 px-3 py-1 rounded-md text-sm font-medium">
              {plot.type || "-"}
            </div>
          </div>
        </div>

        {/* Optional actions */}
        <button className="text-yellow-500 border px-3 py-1 rounded-md" onClick={() => setCreateOpen(true)}>
          + Add Floor
        </button>
      </div>

      {/* Floors */}
      {loading ? (
        <div className="text-center py-6">Loading floors...</div>
      ) : (
        <FloorTable floors={floors} setFloors={setFloors} />
      )}
      <FloorCreateModal
        open={createOpen}
        setOpen={setCreateOpen}
        plot={plot}
        setFloors={setFloors}
      />
    </div>
  )
}

export default PlotSection
