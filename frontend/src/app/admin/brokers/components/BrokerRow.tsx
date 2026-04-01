// app/admin/brokers/components/BrokerRow.tsx
import BrokerActions from "./BrokerActions"

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
}

// handles broker row functionality
const BrokerRow = ({ b, setBrokers, onEdit }: any) => {
  return (
    <tr className="hover:bg-gray-50 transition-colors duration-150">

      <td className="px-6 py-3 font-semibold text-gray-900">
        #{b.broker_id}
      </td>

      <td className="px-6 py-3 font-semibold text-gray-900">
        #{b.society_id}
      </td>

      <td className="px-6 py-3 font-medium text-gray-800">
        {b.broker_name || "-"}
      </td>

      <td className="px-6 py-3 text-gray-600">
        {b.phone || "-"}
      </td>

      <td className="px-6 py-3 text-gray-500">
        {formatDate(b.created_at)}
      </td>

      <td className="px-6 py-3 text-right">
        <BrokerActions
          b={b}
          setBrokers={setBrokers}
          onEdit={onEdit}
        />
      </td>
    </tr>
  )
}

export default BrokerRow
