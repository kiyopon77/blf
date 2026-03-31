const ValueCard = ({
  floorValue,
  saleValue,
  date,
  area_sqft,
  area_sqyd,
}: {
  floorValue?: number | null
  saleValue?: number | null
  date?: string
  area_sqft?: number | null
  area_sqyd?: number | null
}) => {
  return (
    <div className="bg-white px-9 py-6 rounded-xl border border-gray-400">
      <div className="flex flex-col gap-6">
        <span className="text-gray-700 font-extrabold">Floor & Value</span>

        {/* ── Two price columns ── */}
        <div className="grid grid-cols-2 gap-4">
          {/* Floor base value — from FloorResponse.floor_value */}
          <div className="flex flex-col gap-1 rounded-xl border border-blue-200 bg-blue-50 px-5 py-4">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              <span className="text-xs font-bold text-blue-700 uppercase tracking-wide">
                Floor Base Value
              </span>
            </div>
            <span className="font-extrabold text-3xl text-blue-900">
              {floorValue != null ? `₹ ${floorValue.toLocaleString("en-IN")}` : "—"}
            </span>
            <span className="text-xs font-bold text-blue-600">Listed floor price</span>
          </div>

          {/* Sale value — from SaleResponse.total_value */}
          <div className="flex flex-col gap-1 rounded-xl border border-green-200 bg-green-50 px-5 py-4">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-green-500" />
              <span className="text-xs font-bold text-green-700 uppercase tracking-wide">
                Sale Value
              </span>
            </div>
            <span className="font-extrabold text-3xl text-green-900">
              {saleValue != null ? `₹ ${saleValue.toLocaleString("en-IN")}` : "—"}
            </span>
            <span className="text-xs font-bold text-green-600">
              {date
                ? `Sold on ${new Date(date).toLocaleDateString("en-IN")}`
                : "No sale yet"}
            </span>
          </div>
        </div>

        {/* ── Area row ── */}
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
