// app/admin/sales/components/SalesRow.tsx
import SalesActions from "./SalesActions"

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
}

// handles sales row functionality
const SalesRow = ({ s, setSales, onEdit, onView }: any) => {
  return (
    <tr className="group hover:bg-[#F9FAFB] transition h-13">
      
      {/* SALE ID */}
      <td className="px-6 py-3 font-semibold text-black">
        ID-{s.sale_id}
      </td>

      {/* FLOOR */}
      <td className="px-6 py-3 text-gray-600">
        {s.floor_code}
      </td>

      {/* BROKER */}
      <td className="px-6 py-3 text-gray-700">
        {s.broker_id}
      </td>

      {/* CUSTOMER */}
      <td className="px-6 py-3 text-gray-700">
        {s.customer_id}
      </td>

      {/* VALUE (RIGHT ALIGNED 🔥) */}
      <td className="px-6 py-3 font-semibold text-black">
        ₹ {s.total_value.toLocaleString()}
      </td>

      {/* STATUS */}
      <td className="px-6 py-3">
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium ${
            s.status === "SOLD"
              ? "bg-green-50 text-green-800"
              : s.status === "HOLD"
              ? "bg-yellow-50 text-yellow-800"
              : s.status === "INVESTOR_UNIT"
              ? "bg-purple-50 text-purple-700"
              : "bg-gray-100 text-gray-700"
          }`}
        >
          {s.status === "INVESTOR_UNIT" ? "INVESTOR" : s.status}
        </span>
      </td>

      {/* DATE */}
      <td className="px-6 py-3 text-gray-500">
        {formatDate(s.initiated_at)}
      </td>

      {/* ACTIONS */}
      <td className="px-6 py-3 text-right">
        <SalesActions
          s={s}
          setSales={setSales}
          onEdit={onEdit}
          onView={onView}
        />
      </td>
    </tr>
  )
}

export default SalesRow
