// ValueCard.tsx
const ValueCard = ({
  value,
  date,
  length,
  breadth,
}: {
  value?: number
  date?: string
  length?: number
  breadth?: number
}) => {
  const formatted = value?.toLocaleString("en-IN")
  return (
    <div className="bg-white px-9 py-6 rounded-xl border border-gray-400">
      <div className="flex flex-col gap-9">
        <span className="text-gray-700 font-extrabold">Floor & Value</span>
        <div className="flex justify-between">
          <div className="flex flex-col">
            <span className="text-gray-600">Floor Value</span>
            <span className="font-extrabold text-4xl">₹ {formatted ?? "—"}</span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-gray-600 text-sm">Selling Date</span>
            <span className="text-lg">
              {date ? new Date(date).toLocaleDateString() : "—"}
            </span>
          </div>
        </div>
        <div className="flex gap-8 border-t border-gray-100 pt-4">
          <div className="flex flex-col">
            <span className="text-gray-600 text-sm">Length</span>
            <span className="font-bold text-lg">{length ? `${length} ft` : "—"}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-gray-600 text-sm">Breadth</span>
            <span className="font-bold text-lg">{breadth ? `${breadth} ft` : "—"}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
export default ValueCard
