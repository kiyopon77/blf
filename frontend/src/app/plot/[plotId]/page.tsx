"use client"

import { useEffect, useState, useMemo } from "react"
import { useParams, useRouter } from "next/navigation"
import BrokerInfoCard from "./components/BrokerInfoCard"
import CustomerCard from "./components/CustomerCard"
import MilestoneCard from "./components/MilestoneCard"
import PaymentInfoCard from "./components/PaymentInfoCard"
import ValueCard from "./components/ValueCard"
import DocumentsCard from "./components/DocumentsCard"
import { getPlotDetail } from "@/services/plot"
import { ThreeDot } from "react-loading-indicators"
import type { SaleDetail } from "@/types/sales"
import type { Plot } from "@/types/plot"
import type { Floor, FloorStatus } from "@/types/floor"
import type { Broker } from "@/types/broker"
import type { Customer } from "@/types/customer"
import type { Payment } from "@/types/payment"

type PlotDetailResponse = {
  sale?: SaleDetail
  plot: Plot
  floor: Floor
  broker?: Broker
  customer?: Customer
  payments: Payment[]
}

export default function Plot() {
  const router = useRouter()
  const { plotId } = useParams() as { plotId: string }
  const [data, setData] = useState<PlotDetailResponse | null>(null)
  const [category, floor] = useMemo(() => plotId.split("-"), [plotId])

  useEffect(() => {
    const load = async () => {
      const res: PlotDetailResponse = await getPlotDetail(category, Number(floor))
      setData(res)
    }
    load()
  }, [category, floor])

  if (!data) {
    return (
      <div className="h-screen w-screen flex items-center justify-center">
        <ThreeDot color="#D4A22A" size="medium" text="" textColor="" />
      </div>
    )
  }

  const { sale, plot, floor: floorData, broker, customer } = data

  const statusColors: Record<FloorStatus, string> = {
    AVAILABLE: "bg-green-600",
    HOLD: "bg-yellow-500",
    SOLD: "bg-red-600",
    CANCELLED: "bg-gray-500",
    INVESTOR_UNIT: "bg-blue-500",
  }
  const statusLabel: FloorStatus = floorData?.status ?? "AVAILABLE"
  const statusColor = statusColors[statusLabel] ?? "bg-blue-500"

  return (
    <div className="w-3/4 mx-auto mt-5 mb-10">
      <div className="flex flex-col">

        {/* ── Header ── */}
        <div className="flex justify-between items-start mb-15 mt-5">
          <div className="flex flex-col">
            <span className="font-extrabold text-3xl">{plotId}</span>
            <span className="text-gray-500">
              Category {category} | Floor {floor}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className={`py-2 px-5 rounded-3xl text-white ${statusColor}`}>
              {statusLabel.replace("_", " ")}
            </span>
            <button
              onClick={() => router.push(`/plot/edit/${plotId}`)}
              className="py-2 px-5 rounded-3xl border border-gray-300 text-gray-700 hover:bg-gray-100 hover:cursor-pointer transition-colors font-medium"
            >
              Edit
            </button>
          </div>
        </div>

        {/* ── Cards ── */}
        <div className="flex flex-col gap-3">
          <ValueCard
            // floor_value lives on FloorResponse — the base listed price of the unit
            floorValue={floorData?.floor_value}
            // total_value lives on SaleResponse — the agreed transaction price
            saleValue={sale?.total_value}
            date={sale?.initiated_at}
            area_sqyd={plot?.area_sqyd}
            area_sqft={plot?.area_sqft}
          />
          <BrokerInfoCard
            broker={broker?.broker_name ?? sale?.broker_name}
            phone={broker?.phone}
          />
          <PaymentInfoCard payments={data.payments} />
          <CustomerCard
            kyc={
              customer?.kyc_status ??
              sale?.customer_kyc_status ??
              undefined
            }
            fullName={
              customer?.full_name ??
              sale?.customer_name ??
              undefined
            }
            pan={customer?.pan ?? undefined}
            phone={customer?.phone ?? undefined}
            email={customer?.email ?? undefined}
            address={customer?.address ?? undefined}
          />
          <MilestoneCard payments={data?.payments} />
          {sale && (
            <DocumentsCard entityType="SALE" entityId={sale.sale_id} />
          )}
        </div>
      </div>
    </div>
  )
}
