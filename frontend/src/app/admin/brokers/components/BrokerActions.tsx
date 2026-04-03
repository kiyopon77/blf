// app/admin/brokers/components/BrokerActions.tsx
import { Pencil, Trash } from "lucide-react"
import { deleteBroker } from "@/services/admin/broker"

// handles broker actions functionality
const BrokerActions = ({ b, setBrokers, onEdit }: any) => {
  const handleDelete = async () => {
    try {
      await deleteBroker(b.broker_id)

      setBrokers((prev: any) =>
        prev.filter((x: any) => x.broker_id !== b.broker_id)
      )
    } catch (err) {
    }
  }

  return (
    <div className="flex justify-end gap-3 w-full">
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
