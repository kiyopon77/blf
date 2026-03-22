"use client"
import Card from "./Card"
import PlotMatrix from "./PlotMatrix"
import { getDashboard } from "@/services/dashboard"
import { useState, useEffect } from "react"
import { ThreeDot } from "react-loading-indicators"

const Dashboard = () => {
  const [dashboard, setDashboard] = useState<any>(null)

  useEffect(() => {
    const loadDashboard = async () => {
      const data = await getDashboard()
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
      value: dashboard.total_plots,
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
      <div className="grid grid-cols-6 p-10 gap-8">
        {cards.map((card, index) => (
          <Card
            key={index}
            heading={card.heading}
            value={card.value}
            icon={card.icon}
            bgColor={card.bgColor}
          />
        ))}
      </div>
      <PlotMatrix />
    </div>
  )
}

export default Dashboard
