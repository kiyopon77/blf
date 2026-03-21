// page.tsx
"use client"
import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import BrokerInfoCard from "./components/BrokerInfoCard"
import CustomerCard from "./components/CustomerCard"
import MilestoneCard from "./components/MilestoneCard"
import PaymentInfoCard from "./components/PaymentInfoCard"
import ValueCard from "./components/ValueCard"
import { getPlotDetail } from "@/services/plot"
import { ThreeDot } from "react-loading-indicators"

export default function Plot() {
  const params = useParams()
  const router = useRouter()
  const plotId = params.plotId as string
  const [data, setData] = useState<any>(null)
  const [category, floor] = plotId.split("-")

  useEffect(() => {
    const load = async () => {
      const res = await getPlotDetail(category, Number(floor))
      setData(res)
    }
    load()
  }, [plotId])

  if (!data) return <div className="h-screen w-screen flex items-center justify-center">
      <ThreeDot color="#D4A22A" size="medium" text="" textColor="" />
    </div>

  const { sale, plot, broker, customer } = data

  const statusColors: Record<string, string> = {
    AVAILABLE: "bg-green-600",
    HOLD: "bg-yellow-500",
    SOLD: "bg-red-600",
    CANCELLED: "bg-gray-500",
  }
  const statusLabel = data?.floor?.status ?? "AVAILABLE"
  const statusColor = statusColors[statusLabel] ?? "bg-blue-500"

  return (
    <div className="w-3/4 mx-auto mt-5 mb-10">
      <div className="flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-start mb-15 mt-5">
          <div className="flex flex-col">
            <span className="font-extrabold text-3xl">{plotId}</span>
            <span className="text-gray-500">
              Category {category} | Floor {floor}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className={`py-2 px-5 rounded-3xl text-white ${statusColor}`}>
              {statusLabel}
            </span>
            <button
              onClick={() => router.push(`/plot/edit/${plotId}`)}
              className="py-2 px-5 rounded-3xl border border-gray-300 text-gray-700 hover:bg-gray-100 hover:cursor-pointer transition-colors font-medium"
            >
              Edit
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <ValueCard
            value={sale?.total_value}
            date={sale?.initiated_at}
            length={plot?.length}
            breadth={plot?.breadth}
          />
          <BrokerInfoCard
            broker={broker?.broker_name ?? sale?.broker_name}
            company={broker?.company}
            phone={broker?.phone}
            email={broker?.email}
          />
          <PaymentInfoCard payments={data.payments} />
          <CustomerCard
            kyc={customer?.kyc_status ?? sale?.customer_kyc_status}
            fullName={customer?.full_name ?? sale?.customer_name}
            pan={customer?.pan}
            phone={customer?.phone}
            email={customer?.email}
            address={customer?.address}
          />
          <MilestoneCard payments={data?.payments} />
        </div>
      </div>
    </div>
  )
}
