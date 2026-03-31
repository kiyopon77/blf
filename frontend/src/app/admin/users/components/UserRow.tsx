import {  Pencil } from "lucide-react"

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })

const UserRow = ({ u, onEdit }: any) => {
  return (
    <tr className="group hover:bg-gray-50 transition-colors duration-150 ">
      <td className="px-6 py-3 font-semibold text-gray-900">
        #{u.user_id}
      </td>

      <td className="px-6 py-3 font-medium text-gray-800">
        {u.full_name}
      </td>

      <td className="px-6 py-3 text-gray-600">
        {u.email}
      </td>

      <td className="px-6 py-3">
        <span
          className={`px-2.5 py-0.5 rounded text-xs font-medium ${u.role === "admin"
            ? "bg-purple-100 text-purple-700"
            : "bg-blue-100 text-blue-700"
            }`}
        >
          {u.role.toUpperCase()}
        </span>
      </td>

      <td className="px-6 py-3">
        <span
          className={`px-2.5 py-0.5 rounded text-xs font-medium ${u.is_active
            ? "bg-green-100 text-green-700"
            : "bg-red-100 text-red-600"
            }`}
        >
          {u.is_active ? "ACTIVE" : "INACTIVE"}
        </span>
      </td>

      <td className="px-6 py-3 text-gray-500">
        {formatDate(u.created_at)}
      </td>

      {/* Actions */}
      <td className="px-6 py-3 text-right">
        <div className="flex items-center justify-end space-x-3">

          <Pencil
            className="text-gray-600 cursor-pointer"
            size={18}
            onClick={() => onEdit(u)}
          />
        </div>
      </td>
    </tr>
  )
}

export default UserRow
