import { Plus } from "lucide-react"

const BrokerHeader = ({ onCreate }: any) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
      
      <div>
        <h1 className="text-2xl font-bold text-black">Brokers</h1>
        <p className="text-sm text-gray-500 mt-1">
          Manage all broker records
        </p>
      </div>

      <button
        onClick={onCreate}
        className="mt-4 sm:mt-0 flex items-center space-x-2 border border-[#D4A22A] text-[#D4A22A] hover:bg-[#D4A22A] hover:text-white px-5 py-2.5 rounded text-sm font-medium transition-colors duration-200"
      >
        <Plus size={16} />
        <span>Create Broker</span>
      </button>

    </div>
  )
}

export default BrokerHeader
