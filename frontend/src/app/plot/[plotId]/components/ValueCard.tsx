const ValueCard = ({
  value,
  date,
  area_sqft,
  area_sqyd,
}: {
  value?: number
  date?: string
  area_sqft?: number
  area_sqyd?: number
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
              {date ? new Date(date).toLocaleDateString("en-IN") : "—"}
            </span>
          </div>
        </div>
        <div className="flex gap-8 border-t border-gray-100 pt-4">
          <div className="flex flex-col">
            <span className="text-gray-600 text-sm">Area (sq ft)</span>
            <span className="font-bold text-lg">{area_sqft ? `${area_sqft} sq ft` : "—"}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-gray-600 text-sm">Area (sq yd)</span>
            <span className="font-bold text-lg">{area_sqyd ? `${area_sqyd} sq yd` : "—"}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ValueCard
