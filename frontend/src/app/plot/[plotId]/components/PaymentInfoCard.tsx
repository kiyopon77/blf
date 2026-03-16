// PaymentInfoCard.tsx
type Payment = {
  milestone: string
  amount?: number
  status: "DONE" | "PENDING"
}

const milestoneOrder = [
  "TOKEN",
  "ATS",
  "SUPERSTRUCTURE",
  "PROPERTY_ID",
  "REGISTRY",
  "POSSESSION",
]

const formatMilestone = (m: string) =>
  m
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, l => l.toUpperCase())
    .replace(/\bAts\b/g, "ATS")
    .replace(/\bId\b/g, "ID")

const PaymentInfoCard = ({ payments = [] }: { payments?: Payment[] }) => {
  if (!payments.length) {
    return (
      <div className="bg-white px-9 py-6 rounded-xl border border-gray-400">
        <span className="text-gray-500">No payment data available</span>
      </div>
    )
  }

  const paymentComplete = payments.every((p) => p.status === "DONE")
  const status = paymentComplete ? "Received" : "Pending"
  const statusColor = paymentComplete ? "bg-green-600" : "bg-yellow-500"

  return (
    <div className="bg-white px-9 py-6 rounded-xl border border-gray-400">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <span className="text-gray-700 font-extrabold">Payment & Financial Status</span>
          <span className={`rounded-3xl text-white px-3 py-1 text-sm ${statusColor}`}>
            {status}
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {milestoneOrder.map((m) => {
            const payment = payments.find((p) => p.milestone === m)
            const isDone = payment?.status === "DONE"
            return (
              <div
                key={m}
                className={`flex flex-col gap-1 p-4 rounded-xl border ${
                  isDone ? "border-green-200 bg-green-50" : "border-gray-200 bg-gray-50"
                }`}
              >
                <span className="text-xs text-gray-500">{formatMilestone(m)}</span>
                <span className={`font-bold text-lg ${isDone ? "text-gray-800" : "text-gray-400"}`}>
                  {payment?.amount != null
                    ? `₹ ${payment.amount.toLocaleString("en-IN")}`
                    : "—"}
                </span>
                <span className={`text-xs font-semibold ${isDone ? "text-green-600" : "text-red-400"}`}>
                  {payment?.status ?? "PENDING"}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default PaymentInfoCard
