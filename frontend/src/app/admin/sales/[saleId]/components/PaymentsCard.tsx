import { Payment } from "@/types/payment"

const MILESTONE_ORDER = [
  "TOKEN",
  "ATS",
  "SUPERSTRUCTURE",
  "PROPERTY_ID",
  "REGISTRY",
  "POSSESSION",
] as const

const formatMilestone = (m: string) =>
  m.replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (l) => l.toUpperCase())
    .replace(/\bAts\b/g, "ATS")
    .replace(/\bId\b/g, "ID")

export default function PaymentsCard({ payments }: { payments: Payment[] }) {
  const ordered = MILESTONE_ORDER.map((m) => payments.find((p) => p.milestone === m))
  const doneCount = payments.filter((p) => p.status === "DONE").length
  const totalPaid = payments
    .filter((p) => p.status === "DONE" && p.amount != null)
    .reduce((sum, p) => sum + (p.amount ?? 0), 0)

  return (
    <div className="bg-white px-9 py-6 rounded-xl border border-gray-400">
      <div className="flex flex-col gap-6">
        {/* Header row */}
        <div className="flex items-center justify-between">
          <span className="text-gray-700 font-extrabold">Payment Milestones</span>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">
              {doneCount}/{MILESTONE_ORDER.length} done
            </span>
            <span className="text-sm font-semibold text-gray-700">
              Collected: ₹ {totalPaid.toLocaleString("en-IN")}
            </span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-green-500 rounded-full transition-all duration-500"
            style={{ width: `${(doneCount / MILESTONE_ORDER.length) * 100}%` }}
          />
        </div>

        {/* Milestone rows */}
        <div className="flex flex-col divide-y divide-gray-100">
          {ordered.map((payment, idx) => {
            const name = MILESTONE_ORDER[idx]
            const isDone = payment?.status === "DONE"

            return (
              <div key={name} className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${isDone ? "bg-green-500" : "bg-gray-200"}`} />
                  <span className={`font-medium text-sm ${isDone ? "text-gray-800" : "text-gray-400"}`}>
                    {formatMilestone(name)}
                  </span>
                </div>
                <div className="flex items-center gap-6">
                  <span className={`text-sm ${isDone ? "text-gray-500" : "text-gray-300"}`}>
                    {payment?.paid_at
                      ? new Date(payment.paid_at).toLocaleDateString("en-IN")
                      : "—"}
                  </span>
                  <span className={`font-bold text-sm w-32 text-right ${isDone ? "text-gray-800" : "text-gray-300"}`}>
                    {payment?.amount != null
                      ? `₹ ${payment.amount.toLocaleString("en-IN")}`
                      : "—"}
                  </span>
                  <span className={`text-xs font-semibold w-16 text-right ${isDone ? "text-green-600" : "text-red-400"}`}>
                    {payment?.status ?? "PENDING"}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
