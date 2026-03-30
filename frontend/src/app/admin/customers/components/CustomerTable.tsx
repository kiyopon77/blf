import CustomerRow from "./CustomerRow"

const CustomerTable = ({ customers, setCustomers, onEdit }: any) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="bg-[#FAFAFA] border-b text-xs text-gray-500 uppercase tracking-wider font-semibold">
              <th className="px-6 py-4">ID</th>
              <th className="px-6 py-4">Society ID</th>
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">PAN</th>
              <th className="px-6 py-4">Phone</th>
              <th className="px-6 py-4">Address</th>
              <th className="px-6 py-4">Email</th>
              <th className="px-6 py-4">KYC</th>
              <th className="px-6 py-4">Created</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>

          <tbody className="text-sm divide-y divide-gray-200">
            {customers.map((c: any) => (
              <CustomerRow
                key={c.customer_id}
                c={c}
                setCustomers={setCustomers}
                onEdit={onEdit}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default CustomerTable
