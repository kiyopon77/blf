import BrokerActions from "./BrokerActions"

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
}

const BrokerRow = ({ b, setBrokers, onEdit }: any) => {
  return (
    <tr className="border-t hover:bg-gray-50">
      <td className="p-4">{b.broker_id}</td>
      <td className="p-4 font-medium">{b.broker_name || "-"}</td>
      <td className="p-4">{b.phone || "-"}</td>
      <td className="p-4 text-gray-500">
        {formatDate(b.created_at)}
      </td>
      <td className="p-4">
        <BrokerActions b={b} setBrokers={setBrokers} onEdit={onEdit} />
      </td>
    </tr>
  )
}

export default BrokerRow
