type Payment = {
  milestone: string
  amount?: number
  status: "DONE" | "PENDING"
}

const PaymentInfoCard = ({ payments = [] }: { payments?: Payment[] }) => {

  if (!payments.length) {
    return (
      <div className="bg-white px-9 py-6 rounded-xl border border-gray-400">
        <span className="text-gray-500">
          No payment data available
        </span>
      </div>
    )
  }

  const token = payments.find(p => p.milestone === "TOKEN")

  const paymentComplete = payments.every(p => p.status === "DONE")

  const status = paymentComplete ? "Received" : "Pending"

  const color = paymentComplete
    ? "bg-green-600"
    : "bg-yellow-500"

  return (
    <div className="bg-white px-9 py-6 rounded-xl border border-gray-400">

      <div className="flex flex-col gap-9">

        <span className="text-gray-700 font-extrabold">
          Payment & Financial Status
        </span>

        <div className="flex flex-col gap-3">

          <div>
            <span className="text-gray-600">
              Payment Status
            </span>

            <div>
              <span className={`rounded-3xl text-white px-3 py-1 ${color}`}>
                {status}
              </span>
            </div>
          </div>

          <div>
            <span className="text-gray-600">
              Token Amount Paid
            </span>

            <div className="font-extrabold text-xl">
              ₹ {token?.amount?.toLocaleString("en-IN") ?? "—"}
            </div>
          </div>

        </div>

      </div>

    </div>
  )
}

export default PaymentInfoCard
