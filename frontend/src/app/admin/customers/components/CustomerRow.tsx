// components/CustomerRow.tsx
import CustomerActions from "./CustomerActions"

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
}

const CustomerRow = ({ c, setCustomers, onEdit }: any) => {
  return (
    <tr className="border-t hover:bg-gray-50">
      <td className="p-4">{c.customer_id}</td>
      <td className="p-4 font-medium">{c.full_name}</td>
      <td className="p-4">{c.pan}</td>
      <td className="p-4">{c.phone || "-"}</td>
      <td className="p-4">{c.email || "-"}</td>

      {/* KYC badge */}
      <td className="p-4">
        <span
          className={`px-2 py-1 text-xs rounded-full ${
            c.kyc_status === "VERIFIED"
              ? "bg-green-100 text-green-600"
              : "bg-yellow-100 text-yellow-600"
          }`}
        >
          {c.kyc_status}
        </span>
      </td>

      <td className="p-4 text-gray-500">
        {formatDate(c.created_at)}
      </td>

      <td className="p-4">
        <CustomerActions c={c} setCustomers={setCustomers} onEdit={onEdit} />
      </td>
    </tr>
  )
}

export default CustomerRow
