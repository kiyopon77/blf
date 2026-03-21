// components/RMRow.tsx
import { RM } from "@/types/rm"
import RMActions from "./RMActions"

const RMRow = ({ rm, setRms }: any) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
  }

  return (
    <tr className="border-t hover:bg-gray-50">
      <td className="p-4 font-medium">{rm.rm_id}</td>
      <td className="p-4">{rm.name}</td>
      <td className="p-4">{rm.email}</td>
      <td className="p-4">{rm.phone}</td>
      <td className="p-4 text-gray-500">{formatDate(rm.created_at)}</td>
      <td className="p-4">
        <RMActions rm={rm} setRms={setRms} />
      </td>
    </tr>
  )
}

export default RMRow
