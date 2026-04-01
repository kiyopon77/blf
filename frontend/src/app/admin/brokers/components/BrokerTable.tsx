// app/admin/brokers/components/BrokerTable.tsx
import BrokerRow from "./BrokerRow"

// handles broker table functionality
const BrokerTable = ({ brokers, setBrokers, onEdit }: any) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-xs text-gray-500 uppercase tracking-wider">
              <th className="px-6 py-4 text-left">User ID</th>
              <th className="px-6 py-4 text-left">Society ID</th>
              <th className="px-6 py-4 text-left">Name</th>
              <th className="px-6 py-4 text-left">Phone</th>
              <th className="px-6 py-4 text-left">Created</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {brokers.map((b: any) => (
              <BrokerRow
                key={b.broker_id}
                b={b}
                setBrokers={setBrokers}
                onEdit={onEdit}
              />
            ))}
          </tbody>

        </table>
      </div>
    </div>
  )
}

export default BrokerTable
