"use client"

import { useState } from "react"
import { updatePlot } from "@/services/admin/plot"
import { Plot, UpdatePlotPayload } from "@/types/plot"
import AdminButton from "@/components/ui/AdminButton"

const PlotEditModal = ({
  open,
  setOpen,
  plot,
  setPlots,
}: {
  open: boolean
  setOpen: (v: boolean) => void
  plot: Plot
  setPlots: React.Dispatch<React.SetStateAction<Plot[]>>
}) => {
  const [form, setForm] = useState<UpdatePlotPayload>({
    area_sqyd: plot.area_sqyd ?? null,
    area_sqft: plot.area_sqft ?? null,
    type: plot.type ?? "",
  })

  const [loading, setLoading] = useState(false)

  const handleChange = (key: keyof UpdatePlotPayload, value: any) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  const handleSubmit = async () => {
    try {
      setLoading(true)

      const updated = await updatePlot(plot.plot_id, form)

      setPlots((prev) =>
        prev.map((p) =>
          p.plot_id === plot.plot_id ? updated : p
        )
      )

      setOpen(false)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-[500px] p-6 space-y-4 shadow-lg">

        <h2 className="text-lg font-semibold">Edit Plot</h2>

        <input
          type="number"
          placeholder="Area (sqyd)"
          className="w-full border p-2 rounded"
          value={form.area_sqyd ?? ""}
          onChange={(e) =>
            handleChange("area_sqyd", Number(e.target.value))
          }
        />

        <input
          type="number"
          placeholder="Area (sqft)"
          className="w-full border p-2 rounded"
          value={form.area_sqft ?? ""}
          onChange={(e) =>
            handleChange("area_sqft", Number(e.target.value))
          }
        />

        <input
          placeholder="Type"
          className="w-full border p-2 rounded"
          value={form.type ?? ""}
          onChange={(e) => handleChange("type", e.target.value)}
        />

        <div className="flex justify-end gap-2 pt-2">
          <button onClick={() => setOpen(false)}>Cancel</button>

          <AdminButton onClick={handleSubmit}>
            {loading ? "Saving..." : "Save Changes"}
          </AdminButton>
        </div>
      </div>
    </div>
  )
}

export default PlotEditModal
