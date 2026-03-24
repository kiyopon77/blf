import SalesRow from "./SalesRow"

const SalesTable = ({ sales, setSales, onEdit, onView }: any) => {
  return (
    <div className="border rounded-xl overflow-hidden bg-white text-gray-800">
      <table className="w-full">
        <thead className="bg-gray-100 text-gray-700 text-center">
          <tr>
            <th className="p-4 text-center">Sale ID</th>
            <th className="p-4 text-center">Floor</th>
            <th className="p-4 text-center">Broker</th>
            <th className="p-4 text-center">Customer</th>
            <th className="p-4 text-center">Value</th>
            <th className="p-4 text-center">Status</th>
            <th className="p-4 text-center">Created</th>
            <th className="p-4 text-center">Actions</th>
          </tr>
        </thead>

        <tbody>
          {sales.map((s: any) => (
            <SalesRow
              key={s.sale_id}
              s={s}
              setSales={setSales}
              onEdit={onEdit}
              onView={onView}
            />
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default SalesTable
