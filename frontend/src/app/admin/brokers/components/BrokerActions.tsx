import { Pencil, Trash } from "lucide-react"
import { deleteBroker } from "@/services/admin/broker"

const BrokerActions = ({ b, setBrokers, onEdit }: any) => {
  const handleDelete = async () => {
    try {
      await deleteBroker(b.broker_id)

      setBrokers((prev: any) =>
        prev.filter((x: any) => x.broker_id !== b.broker_id)
      )
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="flex gap-3">
      <Pencil
        className="text-gray-600 cursor-pointer"
        size={18}
        onClick={() => onEdit(b)}
      />
      <Trash
        className="text-red-500 cursor-pointer"
        size={18}
        onClick={handleDelete}
      />
    </div>
  )
}

export default BrokerActions
