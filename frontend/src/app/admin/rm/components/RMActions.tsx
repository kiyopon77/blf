// components/RMActions.tsx
import { Pencil, Trash } from "lucide-react"
import { deleteRM } from "@/services/rm"

const RMActions = ({ rm, setRms }: any) => {
  const handleDelete = async () => {
    try {
      await deleteRM(rm.id)
      setRms((prev: any) => prev.filter((r: any) => r.id !== rm.id))
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="flex gap-3 items-center">
      <Pencil className="cursor-pointer text-gray-600" size={18} />
      <Trash
        className="cursor-pointer text-red-500"
        size={18}
        onClick={handleDelete}
      />
    </div>
  )
}

export default RMActions
