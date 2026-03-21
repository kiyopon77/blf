// components/FloorTable.tsx
import { useState } from "react"
import { updateFloorStatus } from "@/services/admin/floor"

const FloorTable = ({ floors, setFloors }: any) => {
  const [changes, setChanges] = useState<any>({}) 
  // { floor_id: "NEW_STATUS" }

  // 📝 track changes locally
  const handleChange = (id: number, status: string) => {
    setChanges((prev: any) => ({
      ...prev,
      [id]: status,
    }))
  }

  // 🚀 submit all changes
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
      setChanges({}) // reset
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-100 text-left">
          <tr>
            <th className="p-3">Floor ID</th>
            <th className="p-3">Floor No</th>
            <th className="p-3">Status</th>
          </tr>
        </thead>

        <tbody>
          {floors.map((f: any) => (
            <tr key={f.floor_id} className="border-t hover:bg-gray-50">
              <td className="p-3">{f.floor_id}</td>
              <td className="p-3">{f.floor_no}</td>

              <td className="p-3">
                <select
                  value={changes[f.floor_id] ?? f.status}
                  onChange={(e) =>
                    handleChange(f.floor_id, e.target.value)
                  }
                  className="border rounded-md px-2 py-1"
                >
                  <option>AVAILABLE</option>
                  <option>HOLD</option>
                  <option>SOLD</option>
                  <option>CANCELLED</option>
                  <option>INVESTOR_UNIT</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* 🔥 Submit button */}
      {Object.keys(changes).length > 0 && (
        <div className="p-4 flex justify-end">
          <button
            onClick={handleSubmit}
            className="bg-yellow-500 text-white px-4 py-2 rounded-md"
          >
            Save Changes
          </button>
        </div>
      )}
    </div>
  )
}

export default FloorTable
