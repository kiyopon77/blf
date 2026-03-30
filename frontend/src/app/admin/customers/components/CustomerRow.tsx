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
    <tr className="group hover:bg-[#F9FAFB] transition-colors duration-150 h-[52px]">
      <td className="px-6 py-3 font-semibold text-black">
        {c.customer_id}
      </td>

      <td className="px-6 py-3 font-semibold text-black">
        {c.society_id}
      </td>

      <td className="px-6 py-3 text-gray-800 font-medium">
        {c.full_name}
      </td>

      <td className="px-6 py-3 text-gray-600">
        {c.pan}
      </td>

      <td className="px-6 py-3 text-gray-600">
        {c.phone || "-"}
      </td>

      <td className="px-6 py-3 text-gray-600">
        {c.address}
      </td>

      <td className="px-6 py-3 text-gray-600">
        {c.email || "-"}
      </td>

      {/* KYC Badge */}
      <td className="px-6 py-3">
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium ${c.kyc_status === "DONE"
            ? "bg-green-50 text-green-700"
            : "bg-yellow-50 text-yellow-700"
            }`}
        >
          {c.kyc_status}
        </span>
      </td>

      <td className="px-6 py-3 text-gray-500">
        {formatDate(c.created_at)}
      </td>

      <td className="px-6 py-3 text-right">
        <CustomerActions
          c={c}
          setCustomers={setCustomers}
          onEdit={onEdit}
        />
      </td>
    </tr>
  )
}

export default CustomerRow
