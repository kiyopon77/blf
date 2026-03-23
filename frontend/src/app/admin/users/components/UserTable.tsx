import UserRow from "./UserRow"

const UserTable = ({ users }: any) => {
  return (
    <div className="border rounded-xl overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-100 text-left">
          <tr>
            <th className="p-4">ID</th>
            <th className="p-4">Name</th>
            <th className="p-4">Email</th>
            <th className="p-4">Role</th>
            <th className="p-4">Status</th>
            <th className="p-4">Created</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u: any) => (
            <UserRow key={u.user_id} u={u} />
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default UserTable
