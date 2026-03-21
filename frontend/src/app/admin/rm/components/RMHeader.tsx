// components/RMHeader.tsx
import { Plus } from "lucide-react"

const RMHeader = ({ onCreate }: any) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <div>
        <h1 className="text-3xl font-bold">Relationship Managers</h1>
        <p className="text-gray-500">
          Manage and oversee relationship manager profiles and assignments
        </p>
      </div>

      <button onClick={onCreate} className="flex items-center gap-2 border border-yellow-500 text-yellow-500 px-4 py-2 rounded-md hover:bg-yellow-50">
        <Plus size={18} />
        Create New RM
      </button>
    </div>
  )
}

export default RMHeader
