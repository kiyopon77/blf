// app/dashboard/page.tsx
"use client"
import DashboardCard from "@/components/ui/DashboardCard"
import PlotMatrix from "./PlotMatrix"
import { getDashboard } from "@/services/dashboard"
import { useState, useEffect } from "react"
import { ThreeDot } from "react-loading-indicators"
import { useAuth } from "@/context/AuthContext"
import { useRouter } from "next/navigation"

// handles dashboard functionality
const Dashboard = () => {
  const [dashboard, setDashboard] = useState<any>(null)
  const [activeFilter, setActiveFilter] = useState<string | null>(null)
  const {society} = useAuth()
  const router = useRouter()

  useEffect(() => {
    if(!society) router.replace("/society")
    const loadDashboard = async () => {
      const data = await getDashboard(society)
      setDashboard(data)
    }
    loadDashboard()
  }, [])
  if (!dashboard) return <div className="h-screen w-screen flex items-center justify-center">
    <ThreeDot color="#D4A22A" size="medium" text="" textColor="" />
  </div>

  const cards = [
    {
      heading: "total floors",
      value: dashboard.total_floors,
      icon: "icons/totalPlots.svg",
      bgColor: "bg-white"
    },
    {
      heading: "available",
      value: dashboard.available,
      icon: "icons/available.svg",
      bgColor: "bg-white"
    },
    {
      heading: "sold",
      value: dashboard.sold,
      icon: "icons/sold.svg",
      bgColor: "bg-green-200"
    },
    {
      heading: "on hold",
      value: dashboard.hold,
      icon: "icons/onHold.svg",
      bgColor: "bg-yellow-200"
    },
    {
      heading: "cancelled",
      value: dashboard.cancelled,
      icon: "icons/cancelled.svg",
      bgColor: "bg-gray-300"
    },
    {
      heading: "investor unit",
      value: dashboard.investor_unit,
      icon: "icons/investorUnit.svg",
      bgColor: "bg-blue-200"
    },
  ]

  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 p-4 md:p-10 gap-4 md:gap-8">
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
              <DashboardCard
                heading={card.heading}
                value={card.value}
                icon={card.icon}
                bgColor={card.bgColor}
              />
            </div>
          )
        })}
      </div>
      <PlotMatrix filter={activeFilter} />
    </div>
  )
}

export default Dashboard
