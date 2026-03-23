const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })

const UserRow = ({ u }: any) => {
  return (
    <tr className="border-t hover:bg-gray-50">
      <td className="p-4">{u.user_id}</td>
      <td className="p-4 font-medium">{u.full_name}</td>
      <td className="p-4">{u.email}</td>
      <td className="p-4">
        <span
          className={`px-2 py-1 text-xs rounded-full ${
            u.role === "admin"
              ? "bg-purple-100 text-purple-600"
              : "bg-blue-100 text-blue-600"
          }`}
        >
          {u.role.toUpperCase()}
        </span>
      </td>
      <td className="p-4">
        <span
          className={`px-2 py-1 text-xs rounded-full ${
            u.is_active
              ? "bg-green-100 text-green-600"
              : "bg-red-100 text-red-500"
          }`}
        >
          {u.is_active ? "Active" : "Inactive"}
        </span>
      </td>
      <td className="p-4 text-gray-500">{formatDate(u.created_at)}</td>
    </tr>
  )
}

export default UserRow
