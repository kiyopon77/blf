// app/admin/plot/components/FloorTable.tsx
import { useState } from "react"
import { updateFloorStatus, deleteFloor } from "@/services/admin/floor"
import { Check, Eye, Trash } from "lucide-react"
import { useRouter } from "next/navigation"
import AdminButton from "@/components/ui/AdminButton"
import AddButton from "@/components/ui/AddButton"
import DeleteButton from "@/components/ui/DeleteButton"

const getStatusStyle = (status: string) => {
  switch (status) {
    case "AVAILABLE":
      return "bg-green-50 text-green-700 border-green-200"
    case "SOLD":
      return "bg-red-50 text-red-700 border-red-200"
    case "HOLD":
      return "bg-amber-50 text-amber-700 border-amber-200"
    case "INVESTOR_UNIT":
      return "bg-blue-100 text-blue-700 border-blue-200"
    default:
      return "bg-gray-100 text-gray-700 border-gray-200"
  }
}

// handles floor table functionality
const FloorTable = ({ floors, setFloors }: any) => {
  const [changes, setChanges] = useState<any>({})
  const router = useRouter()

  const handleChange = (id: number, status: string) => {
    setChanges((prev: any) => ({
      ...prev,
      [id]: status,
    }))
  }

  const handleDelete = async (floorId: number) => {
    try {
      await deleteFloor(floorId)

      // remove from UI
      setFloors((prev: any[]) =>
        prev.filter((f) => f.floor_id !== floorId)
      )
    } catch (err) {
    }
  }

  const handleSubmit = async () => {
    try {
      const updatedFloors = [...floors]

      for (const floorId in changes) {
        const updated = await updateFloorStatus(
          Number(floorId),
          changes[floorId]
        )

        const index = updatedFloors.findIndex(
          (f: any) => f.floor_id === Number(floorId)
        )

        if (index !== -1) {
          updatedFloors[index] = updated
        }
      }

      setFloors(updatedFloors)
      setChanges({})
    } catch (err) {
    }
  }

  return (
    <div className="px-6 pb-6 overflow-x-auto">
      <table className="w-full border-collapse text-left">
        <thead>
          <tr className="bg-[#FAFAFA] border-y border-[#E5E5E5]">
            <th className="py-3 px-4 text-sm font-semibold text-gray-600">
              Floor ID
            </th>
            <th className="py-3 px-4 text-sm font-semibold text-gray-600">
              Floor No
            </th>
            <th className="py-3 px-4 text-sm font-semibold text-gray-600">
              Status
            </th>
            <th className="py-3 px-4 text-sm font-semibold text-gray-600">
              Actions
            </th>
          </tr>
        </thead>

        <tbody>
          {floors.map((f: any) => {
            const currentStatus = changes[f.floor_id] ?? f.status

            return (
              <tr
                key={f.floor_id}
                className="h-13 border-b border-[#E5E5E5] hover:bg-gray-50 transition-colors group"
              >
                <td className="px-4 text-sm text-gray-800 font-medium">
                  {f.floor_id}
                </td>

                <td className="px-4 text-sm text-gray-600">
                  {f.floor_no}
                </td>

                <td className="px-4">
                  <select
                    value={currentStatus}
                    onChange={(e) =>
                      handleChange(f.floor_id, e.target.value)
                    }
                    className={`text-sm font-medium py-1.5 pl-3 pr-8 rounded-md border focus:outline-none focus:ring-1 focus:ring-[#D4A22A] focus:border-[#D4A22A] transition-colors cursor-pointer w-40 ${getStatusStyle(
                      currentStatus
                    )}`}
                  >
                    <option value="AVAILABLE">Available</option>
                    <option value="SOLD">Sold</option>
                    <option value="HOLD">Hold</option>
                    <option value="INVESTOR_UNIT">Investor Unit</option>
                    <option value="CANCELLED">Cancelled</option>
                  </select>
                </td>
                <td className="flex items-center gap-2 my-2">
                  <AdminButton onClick={() => router.push(`/admin/plot/floors/${f.floor_id}/logs`)} icon={<Eye size={16} />} >
                    View Logs
                  </AdminButton>
                  <DeleteButton
                    onClick={() => handleDelete(f.floor_id)}
                    icon={<Trash size={16} />}
                  >
                    Delete
                  </DeleteButton>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>

      {/* Save button */}
      {Object.keys(changes).length > 0 && (
        <div className="flex justify-end pt-4">
          <AddButton onClick={handleSubmit} icon={<Check size={16} />} >
            Save Changes
          </AddButton>
        </div>
      )}
    </div>
  )
}

export default FloorTable
