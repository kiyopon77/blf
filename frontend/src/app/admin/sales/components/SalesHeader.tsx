// app/admin/sales/components/SalesHeader.tsx
import AdminButton from "@/components/ui/AdminButton"
import { Plus } from "lucide-react"

// handles sales header functionality
const SalesHeader = ({ onCreate }: any) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8">

      <div>
        <h1 className="text-[28px] font-bold text-black">Sales</h1>
        <p className="text-sm text-gray-500 mt-1">
          Manage all sales, deals, and transactions
        </p>
      </div>

      <AdminButton onClick={onCreate} icon={<Plus size={16} />} >
        Create Sale
      </AdminButton>

    </div>
  )
}

export default SalesHeader
