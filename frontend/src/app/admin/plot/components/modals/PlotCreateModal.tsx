"use client"

import { useState } from "react"
import { createPlot } from "@/services/admin/plot"
import { CreatePlotPayload, Plot } from "@/types/plot"
import AdminButton from "@/components/ui/AdminButton"
import DeleteButton from "@/components/ui/DeleteButton"
import { X, Check } from "lucide-react"

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
  const [error, setError] = useState("")

  // smart conversion handler
  const handleChange = (key: keyof CreatePlotPayload, value: any) => {
    if (key === "area_sqyd") {
      const sqyd = value === "" ? null : Number(value)

      setForm((prev) => ({
        ...prev,
        area_sqyd: sqyd,
        area_sqft: sqyd !== null ? Math.round(sqyd * 9) : null,
      }))
    } else if (key === "area_sqft") {
      const sqft = value === "" ? null : Number(value)

      setForm((prev) => ({
        ...prev,
        area_sqft: sqft,
        area_sqyd: sqft !== null ? Math.round(sqft / 9) : null,
      }))
    } else {
      setForm((prev) => ({
        ...prev,
        [key]: value,
      }))
    }
  }

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
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
      setError("Failed to create plot.")
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
          <h2 className="text-xl font-bold">Create Plot</h2>
          <button
            onClick={() => setOpen(false)}
            className="text-gray-400 hover:text-gray-600 text-xl"
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          {/* Plot Code */}
          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-600">Plot Code</label>
            <input
              value={form.plot_code}
              onChange={(e) => handleChange("plot_code", e.target.value)}
              required
              className="border border-gray-300 rounded-md p-2 text-sm"
            />
          </div>

          {/* Area sqyd */}
          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-600">Area (sqyd)</label>
            <input
              type="number"
              value={form.area_sqyd ?? ""}
              onChange={(e) =>
                handleChange("area_sqyd", e.target.value)
              }
              className="border border-gray-300 rounded-md p-2 text-sm"
            />
          </div>

          {/* Area sqft */}
          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-600">Area (sqft)</label>
            <input
              type="number"
              value={form.area_sqft ?? ""}
              onChange={(e) =>
                handleChange("area_sqft", e.target.value)
              }
              className="border border-gray-300 rounded-md p-2 text-sm"
            />
          </div>

          {/* Type */}
          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-600">Type</label>
            <input
              value={form.type ?? ""}
              onChange={(e) => handleChange("type", e.target.value)}
              className="border border-gray-300 rounded-md p-2 text-sm"
            />
          </div>

          {/* Helper text */}
          <p className="text-xs text-gray-400">
            1 sqyd = 9 sqft
          </p>

          {/* Error */}
          {error && <p className="text-red-500 text-sm">{error}</p>}

          {/* Actions */}
          <div className="flex justify-end gap-2 mt-2">
            <DeleteButton onClick={() => setOpen(false)} icon={<X size={16} />}>
              Cancel
            </DeleteButton>

            <AdminButton
              type="submit"
              disabled={loading}
              icon={<Check size={16} />}
            >
              {loading ? "Creating..." : "Create Plot"}
            </AdminButton>
          </div>
        </form>

      </div>
    </div>
  )
}

export default PlotCreateModal
