import { Eye, Pencil, Trash } from "lucide-react"
import { deleteSale } from "@/services/admin/sales"

const SalesActions = ({ s, setSales, onEdit, onView }: any) => {
  const handleDelete = async () => {
    try {
      if (!confirm("Are you sure you want to delete this sale?")) return
      await deleteSale(s.sale_id)

      setSales((prev: any) =>
        prev.filter((x: any) => x.sale_id !== s.sale_id)
      )
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="flex justify-end gap-3">
      <Eye className="text-yellow-500 cursor-pointer" size={18} onClick={() => onView(s)} />

      <Pencil
        className="text-gray-600 cursor-pointer"
        size={18}
        onClick={() => onEdit(s)}
      />

      <Trash
        className="text-red-500 cursor-pointer"
        size={18}
        onClick={handleDelete}
      />
    </div>
  )
}

export default SalesActions
