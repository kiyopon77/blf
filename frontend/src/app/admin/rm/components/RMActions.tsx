// app/admin/rm/components/RMActions.tsx
// components/RMActions.tsx
import { Pencil, Trash } from "lucide-react"
import { deleteRM } from "@/services/rm"

// handles r m actions functionality
const RMActions = ({ rm, setRms, onEdit }: any) => {
  const handleDelete = async () => {
    try {
      await deleteRM(rm.id)
      setRms((prev: any) => prev.filter((r: any) => r.id !== rm.id))
    } catch (err) {
    }
  }

  return (
    <div className="flex gap-3 items-center">
      <Pencil className="cursor-pointer text-gray-600" size={18} onClick={() => onEdit(rm)} />
      <Trash
        className="cursor-pointer text-red-500"
        size={18}
        onClick={handleDelete}
      />
    </div>
  )
}

export default RMActions
