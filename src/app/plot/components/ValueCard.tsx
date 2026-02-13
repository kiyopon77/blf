const ValueCard = () => {
  return (
    <div className="bg-white px-9 py-6 rounded-xl border border-gray-400">
      <div className="flex flex-col gap-9">
        <span className="text-gray-700 font-extrabold">
          Plot & Value
        </span>
        <div className="flex justify-between">
          <div className="flex flex-col justify-between">
            <span className="text-gray-600">Plot Value</span>
            <span className="font-extrabold text-4xl">2,45,000</span>
          </div>
          <div className="flex flex-col gap-1.5 items-end">
            <span className="text-gray-600 text-sm">
              Selling Date
            </span>
            <span className="text-lg">
              15 Jan, 2026
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ValueCard
