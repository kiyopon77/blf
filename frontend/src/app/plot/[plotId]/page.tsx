"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"

import BrokerInfoCard from "./components/BrokerInfoCard"
import CustomerCard from "./components/CustomerCard"
import MilestoneCard from "./components/MilestoneCard"
import PaymentInfoCard from "./components/PaymentInfoCard"
import ValueCard from "./components/ValueCard"

import { getPlotDetail } from "@/services/plot"

export default function Plot() {

  const params = useParams()
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

  if (!data) return <div>Loading...</div>

  const { sale } = data

  return (
    <div className="w-3/4 mx-auto mt-5 mb-10">

      <div className="flex flex-col">

        <div className="plotinfo flex justify-between mb-15 mt-5">

          <div className="flex flex-col">
            <span className="font-extrabold text-3xl">{plotId}</span>
            <span className="text-gray-500">
              Category {category} | Floor {floor}
            </span>
          </div>

          <div>
            <span className="py-2 px-5 rounded-3xl bg-red-600 text-white">
              {sale?.status ?? "Available"}
            </span>
          </div>

        </div>

        <div className="flex flex-col gap-3">

          <ValueCard
            value={sale?.total_value}
            date={sale?.initiated_at}
          />

          <BrokerInfoCard
            broker={sale?.broker_name}
          />

          <PaymentInfoCard payments={data.payments}/>

          <CustomerCard
            kyc={sale?.customer_kyc_status}
          />

          <MilestoneCard
            payments={data?.payments}
          />

        </div>

      </div>

    </div>
  )
}
