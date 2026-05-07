// app/admin/plot/components/modals/PlotDuplicateModal.tsx
"use client"

import { useState } from "react"
import { createPlot } from "@/services/admin/plot"
import { createFloor } from "@/services/admin/floor"
import { Plot } from "@/types/plot"
import { Floor } from "@/types/floor"
import AdminButton from "@/components/ui/AdminButton"
import DeleteButton from "@/components/ui/DeleteButton"
import { X, Copy } from "lucide-react"
import { useAuth } from "@/context/AuthContext"

// handles plot duplicate modal functionality
const PlotDuplicateModal = ({
  open,
  setOpen,
  originalPlot,
  originalFloors,
  setPlots,
}: {
  open: boolean
  setOpen: (v: boolean) => void
  originalPlot: Plot
  originalFloors: Floor[]
  setPlots: React.Dispatch<React.SetStateAction<Plot[]>>
}) => {
  const { society } = useAuth()
  const [plotCode, setPlotCode] = useState(`${originalPlot.plot_code}-COPY`)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      // 1. Create the new plot with exact same metrics but a new code
      const newPlot = await createPlot({
        society_id: society!,
        plot_code: plotCode,
        area_sqyd: originalPlot.area_sqyd ?? null,
        area_sqft: originalPlot.area_sqft ?? null,
        type: originalPlot.type ?? "",
      })

      // 2. Duplicate the floors under the new plot
      await Promise.all(
        originalFloors.map((f) =>
          createFloor({
            plot_id: newPlot.plot_id,
            floor_no: f.floor_no,
            floor_value: f.floor_value ?? null,
          })
        )
      )

      // 3. Update the UI Plot list
      setPlots((prev) => [newPlot, ...prev])
      setOpen(false)
    } catch (err) {
      setError("Failed to duplicate plot. Make sure the Plot Code is unique.")
    } finally {
      setLoading(false)
    }
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Duplicate Plot</h2>
          <button
            onClick={() => setOpen(false)}
            className="text-gray-400 hover:text-gray-600 text-xl"
          >
            ✕
          </button>
        </div>

        <p className="text-sm text-gray-500 mb-6">
          This will create a new plot with the same area and properties, and replicate its <strong>{originalFloors.length} floors</strong> exactly as they are configured. 
          Please assign a new unique Plot Code below.
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Plot Code */}
          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-600">New Plot Code</label>
            <input
              value={plotCode}
              onChange={(e) => setPlotCode(e.target.value)}
              required
              className="border border-gray-300 rounded-md p-2 text-sm font-medium"
            />
          </div>

          {/* Error */}
          {error && <p className="text-red-500 text-sm">{error}</p>}

          {/* Actions */}
          <div className="flex justify-end gap-2 mt-4">
            <DeleteButton onClick={() => setOpen(false)} icon={<X size={16} />}>
              Cancel
            </DeleteButton>

            <AdminButton
              type="submit"
              disabled={loading || !plotCode.trim()}
              icon={<Copy size={16} />}
            >
              {loading ? "Duplicating..." : "Duplicate"}
            </AdminButton>
          </div>
        </form>
      </div>
    </div>
  )
}

export default PlotDuplicateModal
