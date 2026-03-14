const CustomerCard = () => {
  return (
    <div className="bg-white px-9 py-6 rounded-xl border border-gray-400">
      <div className="flex flex-col gap-9">
        <span className="text-gray-700 font-extrabold">
          Customer Compliance
        </span>
        <div className="flex justify-between">
          <div className="flex flex-col justify-between">
            <span className="text-gray-600">Customer KYC Status</span>
            <span className="text-xl text-green-500 font-bold">Completed</span>
          </div>
        </div>
      </div>
    </div>

  )
}

export default CustomerCard
