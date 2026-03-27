import SalesRow from "./SalesRow"

const SalesTable = ({ sales, setSales, onEdit, onView }: any) => {
  return (
    <div className="bg-white border border-[#E5E5E5] rounded-lg shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          
          <thead>
            <tr className="bg-[#FAFAFA] border-b border-[#E5E5E5] text-xs text-gray-500 uppercase tracking-wider font-semibold">
              <th className="px-6 py-4 text-left">Sale ID</th>
              <th className="px-6 py-4 text-left">Floor</th>
              <th className="px-6 py-4 text-left">Broker</th>
              <th className="px-6 py-4 text-left">Customer</th>
              <th className="px-6 py-4 text-left">Value</th>
              <th className="px-6 py-4 text-left">Status</th>
              <th className="px-6 py-4 text-left">Created</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>

          <tbody className="text-sm divide-y divide-[#E5E5E5]">
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
    </div>
  )
}

export default SalesTable
