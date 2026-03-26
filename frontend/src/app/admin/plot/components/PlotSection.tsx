"use client"

import { useEffect, useState } from "react"
import { getPlotFloors, createFloor } from "@/services/admin/floor"
import FloorTable from "./FloorTable"
import AdminButton from "@/components/ui/AdminButton"
import DeleteButton from "@/components/ui/DeleteButton"
import { deletePlot, updatePlot } from "@/services/admin/plot"
import { Edit, Plus, PlusIcon, Trash } from "lucide-react"
import PlotEditModal from "./modals/PlotEditModal"
import { sortByFloorNo } from "@/app/utils/sort"
import AddButton from "@/components/ui/AddButton"

const PlotSection = ({ plot, setPlots }: any) => {
  const [floors, setFloors] = useState([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const fetchFloors = async () => {
      try {
        const data = await getPlotFloors(plot.plot_id)
        setFloors(sortByFloorNo(data))
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchFloors()
  }, [plot.plot_id])

  const getNextFloorNo = () => {
    if (floors.length === 0) return 1
    return Math.max(...floors.map((f: any) => f.floor_no)) + 1
  }

  const handleAddFloor = async () => {
    try {
      setCreating(true)

      const newFloor = await createFloor({
        plot_id: plot.plot_id,
        floor_no: getNextFloorNo(),
      })

      setFloors((prev: any) => [...prev, newFloor])
    } catch (err) {
      console.error(err)
    } finally {
      setCreating(false)
    }
  }

  const handleDelete = async () => {
    try {
      setDeleting(true)

      await deletePlot(plot.plot_id)

      // remove from UI
      setPlots((prev: any) =>
        prev.filter((p: any) => p.plot_id !== plot.plot_id)
      )
    } catch (err) {
      console.error(err)
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="bg-white rounded-lg border border-[#E5E5E5] shadow-sm overflow-hidden">

      {/* Header */}
      <div className="p-6 pb-5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-bold text-gray-900">
            {plot.plot_code}
          </h2>

          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded">
              {plot.area_sqft || "-"} sqft
            </span>

            <span className="px-2.5 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded">
              {plot.area_sqyd || "-"} sqyd
            </span>

            <span className="px-2.5 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded">
              {plot.type || "-"}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">

          <AddButton onClick={handleAddFloor} icon={<PlusIcon size={16} />} >
            Add Floor
          </AddButton>

          <AdminButton
            onClick={() => setEditOpen(true)}
            icon={<Edit size={16} />}
          >
            Edit
          </AdminButton>

          <DeleteButton
            onClick={handleDelete}
            icon={<Trash size={16} />}
          >
            {deleting ? "Deleting..." : "Delete"}
          </DeleteButton>

        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="py-10 text-center text-gray-500">
          Loading floors...
        </div>
      ) : (
        <FloorTable floors={floors} setFloors={setFloors} />
      )}
      <PlotEditModal
        open={editOpen}
        setOpen={setEditOpen}
        plot={plot}
        setPlots={setPlots}
      />
    </div>
  )
}

export default PlotSection
