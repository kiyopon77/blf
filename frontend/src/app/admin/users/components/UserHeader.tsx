import AdminButton from "@/components/ui/AdminButton"
import { Plus } from "lucide-react"

const UserHeader = ({ onCreate }: any) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">

      <div>
        <h1 className="text-2xl font-bold text-black">Users</h1>
        <p className="text-sm text-gray-500 mt-1">
          Manage all platform users
        </p>
      </div>

      <AdminButton onClick={onCreate} icon={<Plus size={16} />}>
        Create User
      </AdminButton>

    </div>
  )
}

export default UserHeader
