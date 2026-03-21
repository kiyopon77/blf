// components/CustomerTable.tsx
import CustomerRow from "./CustomerRow"

const CustomerTable = ({ customers, setCustomers, onEdit }: any) => {
  return (
    <div className="border rounded-xl overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-100 text-left">
          <tr>
            <th className="p-4">ID</th>
            <th className="p-4">Name</th>
            <th className="p-4">PAN</th>
            <th className="p-4">Phone</th>
            <th className="p-4">Email</th>
            <th className="p-4">KYC</th>
            <th className="p-4">Created</th>
            <th className="p-4">Actions</th>
          </tr>
        </thead>

        <tbody>
          {customers.map((c: any) => (
            <CustomerRow key={c.customer_id} c={c} setCustomers={setCustomers} onEdit={onEdit} />
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default CustomerTable
