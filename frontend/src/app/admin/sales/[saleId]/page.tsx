"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import api from "@/lib/api"
import { SaleDetail } from "@/types/sales"
import { Payment } from "@/types/payment"

import SaleHeader from "./components/SaleHeader"
import SummaryBar from "./components/SummaryBar"
import PaymentsCard from "./components/PaymentsCard"

export default function SaleDetailPage() {
  const params = useParams()
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

  if (!sale) return <div>Loading...</div>

  return (
    <div className="w-3/4 mx-auto mt-5 mb-10 flex flex-col gap-4">
      <SaleHeader sale={sale} />
      <SummaryBar sale={sale} />
      <PaymentsCard payments={payments} />
    </div>
  )
}
