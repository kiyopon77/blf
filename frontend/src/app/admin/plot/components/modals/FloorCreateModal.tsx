// app/admin/plot/components/modals/FloorCreateModal.tsx
"use client"

import { useState } from "react"
import { createFloor } from "@/services/admin/floor"

// handles floor create modal functionality
const FloorCreateModal = ({ open, setOpen, plot, setFloors }: any) => {
  const [floorNo, setFloorNo] = useState("")
  const [loading, setLoading] = useState(false)

  if (!open) return null

  const handleSubmit = async () => {
    if (!floorNo) return

    try {
      setLoading(true)

      const newFloor = await createFloor({
        plot_id: plot.plot_id,
        floor_no: Number(floorNo),
      })

      // add to UI instantly
      setFloors((prev: any) => [...prev, newFloor])

      setFloorNo("")
      setOpen(false)
    } catch (err) {
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-96 p-6 shadow-xl">
        <h2 className="text-lg font-semibold mb-4">
          Add Floor to {plot.plot_code}
        </h2>

        <input
          type="number"
          placeholder="Floor Number"
          value={floorNo}
          onChange={(e) => setFloorNo(e.target.value)}
          className="border p-2 rounded-md w-full"
        />

        <div className="flex justify-end gap-3 mt-5">
          <button
            onClick={() => setOpen(false)}
            className="border px-4 py-2 rounded-md"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-yellow-500 text-white px-4 py-2 rounded-md"
          >
            {loading ? "Creating..." : "Create"}
          </button>
        </div>
      </div>
    </div>
  )
}

export default FloorCreateModal
