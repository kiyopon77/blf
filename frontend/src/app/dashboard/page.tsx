"use client"

import Card from "./Card"
import PlotMatrix from "./PlotMatrix"
import { getDashboard } from "@/services/dashboard"
import { useState, useEffect } from "react"

const Dashboard = () => {
  const [dashboard, setDashboard] = useState<any>(null)

  useEffect(() => {
    const loadDashboard = async () => {
      const data = await getDashboard()
      setDashboard(data)
    }

    loadDashboard()
  }, [])

  if (!dashboard) return <div>Loading...</div>

  const cards = [
    {
      heading: "total plots",
      value: dashboard.total_plots,
      icon: "icons/totalPlots.svg",
    },
    {
      heading: "available",
      value: dashboard.available,
      icon: "icons/available.svg",
    },
    {
      heading: "sold",
      value: dashboard.sold,
      icon: "icons/sold.svg",
    },
    {
      heading: "on hold",
      value: dashboard.hold,
      icon: "icons/onHold.svg",
    },
    {
      heading: "cancelled",
      value: dashboard.cancelled,
      icon: "icons/cancelled.svg",
    },
  ]

  return (
    <div>
      <div className="grid grid-cols-5 p-10 gap-8">
        {cards.map((card, index) => (
          <Card
            key={index}
            heading={card.heading}
            value={card.value}
            icon={card.icon}
          />
        ))}
      </div>
      <PlotMatrix />
    </div>
  )
}

export default Dashboard
