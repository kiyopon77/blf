const CustomerCard = ({ kyc }: { kyc?: string }) => {

  const color =
    kyc === "DONE"
      ? "text-green-500"
      : "text-red-500"

  return (
    <div className="bg-white px-9 py-6 rounded-xl border border-gray-400">

      <div className="flex flex-col gap-9">

        <span className="text-gray-700 font-extrabold">
          Customer Compliance
        </span>

        <div className="flex justify-between">

          <div className="flex flex-col">

            <span className="text-gray-600">
              Customer KYC Status
            </span>

            <span className={`text-xl font-bold ${color}`}>
              {kyc ?? "Pending"}
            </span>

          </div>

        </div>

      </div>

    </div>
  )
}

export default CustomerCard
