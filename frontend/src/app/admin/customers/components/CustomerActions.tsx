// components/CustomerActions.tsx
import { Pencil, Trash } from "lucide-react"
import { deleteCustomer } from "@/services/admin/customer"

const CustomerActions = ({ c, setCustomers, onEdit }: any) => {
  const handleDelete = async () => {
    try {
      await deleteCustomer(c.customer_id)

      setCustomers((prev: any) =>
        prev.filter((x: any) => x.customer_id !== c.customer_id)
      )
    } catch (err: any) {
      console.error("DELETE ERROR:", err.response?.data || err.message)
    }
  }

  return (
    <div className="flex gap-3 justify-end">
      <Pencil className="text-gray-600 cursor-pointer" size={18} onClick={() => onEdit(c)} />
      <Trash
        className="text-red-500 cursor-pointer"
        size={18}
        onClick={handleDelete}
      />
    </div>
  )
}

export default CustomerActions
