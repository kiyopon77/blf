"use client"

import DashboardCard from "@/components/ui/DashboardCard"
import PlotMatrix from "./PlotMatrix"
import { getDashboard } from "@/services/dashboard"
import { useState, useEffect } from "react"
import { ThreeDot } from "react-loading-indicators"
import { useAuth } from "@/context/AuthContext"

const RMDashboard = () => {
  const [dashboard, setDashboard] = useState<any>(null)
  const [activeFilter, setActiveFilter] = useState<string | null>(null)
  const { user_society_id } = useAuth()

  useEffect(() => {
    const loadDashboard = async () => {
      const data = await getDashboard(user_society_id)
      setDashboard(data)
    }
    loadDashboard()
  }, [user_society_id])

  const handleStatusChange = (oldStatus: string, newStatus: string) => {
    setDashboard((prev: any) => {
      if (!prev) return prev

      const updated = { ...prev }

      const normalize = (s: string) => {
        switch (s) {
          case "available": return "available"
          case "sold": return "sold"
          case "hold": return "hold"
          case "cancelled": return "cancelled"
          case "investor_unit": return "investor_unit"
          default: return s
        }
      }

      const oldKey = normalize(oldStatus)
      const newKey = normalize(newStatus.toLowerCase())

      if (updated[oldKey] !== undefined) updated[oldKey]--
      if (updated[newKey] !== undefined) updated[newKey]++

      return updated
    })
  }

  if (!dashboard)
    return (
      <div className="h-screen w-screen flex items-center justify-center">
        <ThreeDot color="#D4A22A" size="medium" text="" textColor="" />
      </div>
    )

  const cards = [
    { heading: "total floors", value: dashboard.total_floors, icon: "icons/totalPlots.svg", bgColor: "bg-white" },
    { heading: "available", value: dashboard.available, icon: "icons/available.svg", bgColor: "bg-white" },
    { heading: "sold", value: dashboard.sold, icon: "icons/sold.svg", bgColor: "bg-green-200" },
    { heading: "on hold", value: dashboard.hold, icon: "icons/onHold.svg", bgColor: "bg-yellow-200" },
    { heading: "cancelled", value: dashboard.cancelled, icon: "icons/cancelled.svg", bgColor: "bg-gray-300" },
    { heading: "investor unit", value: dashboard.investor_unit, icon: "icons/investorUnit.svg", bgColor: "bg-blue-200" },
  ]

  return (
    <div>
      <div className="grid grid-cols-6 p-10 gap-8">
        {cards.map((card, index) => {
          const isActive = activeFilter === card.heading

          return (
            <div
              key={index}
              onClick={() =>
                setActiveFilter(prev =>
                  prev === card.heading ? null : card.heading
                )
              }
              className={`
                cursor-pointer transition-transform duration-200 
                ${isActive ? "scale-105 border-2 border-black rounded-2xl" : "hover:scale-105"}
              `}
            >
              <DashboardCard {...card} />
            </div>
          )
        })}
      </div>

      <PlotMatrix filter={activeFilter} onStatusChange={handleStatusChange} />
    </div>
  )
}

export default RMDashboard
