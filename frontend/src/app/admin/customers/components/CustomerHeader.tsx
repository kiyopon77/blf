import AdminButton from "@/components/ui/AdminButton"
import { Plus } from "lucide-react"

const CustomerHeader = ({ onCreate }: any) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8">
      <div>
        <h1 className="text-[28px] font-bold text-black leading-tight">
          Customers
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Manage all customer records and KYC details
        </p>
      </div>

      <div className="mt-4 sm:mt-0">
        <AdminButton onClick={onCreate} icon={<Plus size={16} />} >
        Add Customer
        </AdminButton>
      </div>
    </div>
  )
}

export default CustomerHeader
