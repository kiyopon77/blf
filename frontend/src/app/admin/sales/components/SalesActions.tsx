import { Eye, Pencil, Trash } from "lucide-react"
import { updateSaleStatus } from "@/services/admin/sales"

const SalesActions = ({ s, setSales, onEdit, onView }: any) => {
  const handleCancel = async () => {
    try {
      await updateSaleStatus(s.sale_id, "CANCELLED")

      setSales((prev: any) =>
        prev.map((x: any) =>
          x.sale_id === s.sale_id ? { ...x, status: "CANCELLED" } : x
        )
      )
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="flex justify-center gap-3">
      <Eye className="text-yellow-500 cursor-pointer" size={18} onClick= {() => onView(s)} />

      <Pencil
        className="text-gray-600 cursor-pointer"
        size={18}
        onClick={() => onEdit(s)}
      />

      <Trash
        className="text-red-500 cursor-pointer"
        size={18}
        onClick={handleCancel}
      />
    </div>
  )
}

export default SalesActions
