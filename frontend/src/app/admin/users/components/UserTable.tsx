// app/admin/users/components/UserTable.tsx
import UserRow from "./UserRow"

// handles user table functionality
const UserTable = ({ users, onEdit }: any) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-xs text-gray-500 uppercase tracking-wider">
              <th className="px-6 py-4 text-left">ID</th>
              <th className="px-6 py-4 text-left">Name</th>
              <th className="px-6 py-4 text-left">Email</th>
              <th className="px-6 py-4 text-left">Role</th>
              <th className="px-6 py-4 text-left">Status</th>
              <th className="px-6 py-4 text-left">Created</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {users.map((u: any) => (
              <UserRow key={u.user_id} u={u} onEdit={onEdit} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default UserTable
