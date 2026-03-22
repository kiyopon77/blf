import SalesActions from "./SalesActions"

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
}

const SalesRow = ({ s, setSales, onEdit }: any) => {
  return (
    <tr className="border-t hover:bg-gray-50">
      <td className="p-4 font-medium text-center">
        SALE{s.sale_id.toString().padStart(3, "0")}
      </td>

      <td className="p-4 text-center">Floor {s.floor_id}</td>

      <td className="p-4 text-center">{s.broker_id}</td>

      <td className="p-4 text-center">{s.customer_id}</td>

      <td className="p-4 text-center font-medium">
        ₹ {s.total_value.toLocaleString()}
      </td>

      {/* STATUS BADGE (like KYC) */}
      <td className="p-4 text-center">
        <span
          className={`px-2 py-1 text-xs rounded-full ${s.status === "SOLD"
              ? "bg-green-100 text-green-600"
              : s.status === "HOLD"
                ? "bg-yellow-100 text-yellow-600"
                : s.status === "INVESTOR_UNIT"
                  ? "bg-purple-100 text-purple-600"   // ✅ NEW COLOR
                  : "bg-red-100 text-red-600"
            }`}
        >
          {s.status === "INVESTOR_UNIT" ? "INVESTOR" : s.status}
        </span>
      </td>

      <td className="p-4 text-center text-gray-500">
        {formatDate(s.initiated_at)}
      </td>

      <td className="p-4 text-center">
        <SalesActions s={s} setSales={setSales} onEdit={onEdit} />
      </td>
    </tr>
  )
}

export default SalesRow
