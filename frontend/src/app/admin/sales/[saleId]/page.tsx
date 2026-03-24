"use client"
import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { ThreeDot } from "react-loading-indicators"
import api from "@/lib/api"

// ─── Types ────────────────────────────────────────────────────────────────────

type SaleDetail = {
  sale_id: number
  total_value: number
  commission_percent?: number
  status: "HOLD" | "SOLD" | "CANCELLED" | "INVESTOR_UNIT"
  initiated_at: string
  broker_name: string
  customer_name: string
  customer_kyc_status: string
  floor_no: number
  plot_code: string
}

type Payment = {
  payment_id: number
  sale_id: number
  milestone: "TOKEN" | "ATS" | "SUPERSTRUCTURE" | "PROPERTY_ID" | "REGISTRY" | "POSSESSION"
  amount?: number
  status: "PENDING" | "DONE"
  paid_at?: string
}

// ─── Constants ────────────────────────────────────────────────────────────────

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

const STATUS_STYLES: Record<string, string> = {
  HOLD: "bg-yellow-500",
  SOLD: "bg-red-600",
  CANCELLED: "bg-gray-500",
  INVESTOR_UNIT: "bg-blue-500",
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function SummaryBar({ sale }: { sale: SaleDetail }) {
  const commission =
    sale.commission_percent != null
      ? (sale.total_value * sale.commission_percent) / 100
      : null

  return (
    <div className="bg-white px-9 py-6 rounded-xl border border-gray-400">
      <div className="flex flex-col gap-6">
        <span className="text-gray-700 font-extrabold">Sale Overview</span>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="flex flex-col col-span-2">
            <span className="text-gray-500 text-sm">Total Value</span>
            <span className="font-extrabold text-4xl">
              ₹ {sale.total_value.toLocaleString("en-IN")}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-gray-500 text-sm">Sale Date</span>
            <span className="font-bold text-lg">
              {new Date(sale.initiated_at).toLocaleDateString("en-IN")}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-gray-500 text-sm">Property</span>
            <span className="font-bold text-lg">
              {sale.plot_code} · Floor {sale.floor_no}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-gray-500 text-sm">Broker</span>
            <span className="font-bold text-lg">{sale.broker_name}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-gray-500 text-sm">Customer</span>
            <span className="font-bold text-lg">{sale.customer_name}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-gray-500 text-sm">KYC</span>
            <span className={`font-bold text-lg ${sale.customer_kyc_status === "DONE" ? "text-green-600" : "text-red-500"}`}>
              {sale.customer_kyc_status}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-gray-500 text-sm">Commission</span>
            <span className="font-bold text-lg">
              {commission != null
                ? `₹ ${commission.toLocaleString("en-IN")} (${sale.commission_percent}%)`
                : "—"}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

function PaymentsCard({ payments }: { payments: Payment[] }) {
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
                  <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${isDone ? "bg-green-500" : "bg-gray-200"}`} />
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

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SaleDetailPage() {
  const params = useParams()
  const router = useRouter()
  const saleId = Number(params.saleId)

  const [sale, setSale] = useState<SaleDetail | null>(null)
  const [payments, setPayments] = useState<Payment[]>([])

  useEffect(() => {
    const load = async () => {
      const [saleRes, paymentsRes] = await Promise.all([
        api.get(`/sales/${saleId}`),
        api.get(`/sales/${saleId}/payments`),
      ])
      setSale(saleRes.data)
      setPayments(paymentsRes.data)
    }
    load()
  }, [saleId])

  if (!sale) {
    return (
      <div className="h-screen w-screen flex items-center justify-center">
        <ThreeDot color="#D4A22A" size="medium" text="" textColor="" />
      </div>
    )
  }

  const statusLabel = sale.status
  const statusColor = STATUS_STYLES[statusLabel] ?? "bg-gray-500"

  return (
    <div className="w-3/4 mx-auto mt-5 mb-10">
      <div className="flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-start mb-15 mt-5">
          <div className="flex flex-col">
            <span className="font-extrabold text-3xl">Sale #{saleId}</span>
            <span className="text-gray-500">
              {sale.plot_code} · Floor {sale.floor_no}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className={`py-2 px-5 rounded-3xl text-white ${statusColor}`}>
              {statusLabel.replace("_", " ")}
            </span>
            <button
              onClick={() => router.push(`/sale/edit/${saleId}`)}
              className="py-2 px-5 rounded-3xl border border-gray-300 text-gray-700 hover:bg-gray-100 hover:cursor-pointer transition-colors font-medium"
            >
              Edit
            </button>
          </div>
        </div>

        {/* Cards */}
        <div className="flex flex-col gap-3">
          <SummaryBar sale={sale} />
          <PaymentsCard payments={payments} />
        </div>
      </div>
    </div>
  )
}
