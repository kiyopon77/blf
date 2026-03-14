const PaymentInfoCard = () => {
  return (
    <div className="bg-white px-9 py-6 rounded-xl border border-gray-400">
      <div className="flex flex-col gap-9">
        <span className="text-gray-700 font-extrabold">
          Payment & Financial Status
        </span>
        <div className="flex justify-between">
          <div className="flex flex-col justify-between">
            <span className="text-gray-600">Payment Status</span>
            <span className="rounded-3xl bg-green-600 text-white w-fit px-3 py-1">Received</span>
          </div>
        </div>
        <div className="flex justify-between">
          <div className="flex flex-col justify-between">
            <span className="text-gray-600">Token Amount Paid</span>
            <span className="font-extrabold text-xl">45,000</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PaymentInfoCard
