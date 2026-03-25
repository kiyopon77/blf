import BrokerRow from "./BrokerRow"

const BrokerTable = ({ brokers, setBrokers, onEdit }: any) => {
  return (
    <div className="border rounded-xl overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-100 text-left">
          <tr>
            <th className="p-4">ID</th>
            <th className="p-4">Name</th>
            <th className="p-4">Phone</th>
            <th className="p-4">Created</th>
            <th className="p-4">Actions</th>
          </tr>
        </thead>

        <tbody>
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
  )
}

export default BrokerTable
