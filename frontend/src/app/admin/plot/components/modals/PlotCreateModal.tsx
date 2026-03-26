"use client"

import { useState } from "react"
import { createPlot } from "@/services/admin/plot"
import { CreatePlotPayload, Plot } from "@/types/plot"
import AdminButton from "@/components/ui/AdminButton"

const PlotCreateModal = ({
  open,
  setOpen,
  setPlots,
  societyId,
}: {
  open: boolean
  setOpen: (v: boolean) => void
  setPlots: React.Dispatch<React.SetStateAction<Plot[]>>
  societyId: number
}) => {
  const [form, setForm] = useState<CreatePlotPayload>({
    society_id: societyId,
    plot_code: "",
    area_sqyd: null,
    area_sqft: null,
    type: "",
  })

  const [loading, setLoading] = useState(false)

  const handleChange = (key: keyof CreatePlotPayload, value: any) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  const handleSubmit = async () => {
    try {
      setLoading(true)

      const newPlot = await createPlot(form)

      setPlots((prev) => [newPlot, ...prev])
      setOpen(false)

      // reset
      setForm({
        society_id: societyId,
        plot_code: "",
        area_sqyd: null,
        area_sqft: null,
        type: "",
      })
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

        <h2 className="text-lg font-semibold">Create Plot</h2>

        <input
          placeholder="Plot Code"
          className="w-full border p-2 rounded"
          value={form.plot_code}
          onChange={(e) => handleChange("plot_code", e.target.value)}
        />

        <input
          type="number"
          placeholder="Area (sqyd)"
          className="w-full border p-2 rounded"
          value={form.area_sqyd ?? ""}
          onChange={(e) => {
            const value = e.target.value === "" ? null : Number(e.target.value)

            handleChange("area_sqyd", value)
            handleChange(
              "area_sqft",
              value !== null ? value * 9 : null
            )
          }}
        />

        <input
          type="number"
          placeholder="Area (sqft)"
          className="w-full border p-2 rounded"
          value={form.area_sqft ?? ""}
          onChange={(e) => {
            const value = e.target.value === "" ? null : Number(e.target.value)

            handleChange("area_sqft", value)
            handleChange(
              "area_sqyd",
              value !== null ? value / 9 : null
            )
          }}
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
            {loading ? "Creating..." : "Create Plot"}
          </AdminButton>
        </div>
      </div>
    </div>
  )
}

export default PlotCreateModal
