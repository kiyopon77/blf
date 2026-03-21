// app/admin/plots/page.tsx
"use client"

import { useEffect, useState } from "react"
import { getPlots } from "@/services/admin/plot"
import PlotSection from "./components/PlotSection"

const PlotsPage = () => {
  const [plots, setPlots] = useState([])

  useEffect(() => {
  const fetch = async () => {
    const data = await getPlots()

    const order = ["C", "A", "B"]

    const sorted = data.sort((a: any, b: any) => {
      const getPrefix = (code: string) => code?.[0] || ""

      const diff =
        order.indexOf(getPrefix(a.plot_code)) -
        order.indexOf(getPrefix(b.plot_code))

      if (diff !== 0) return diff

      // optional: sort inside same group (C1, C2, C10 correctly)
      return a.plot_code.localeCompare(b.plot_code, undefined, {
        numeric: true,
      })
    })

    setPlots(sorted)
  }

  fetch()
}, [])

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-3xl font-bold">Plots & Floors</h1>

      {plots.map((plot: any) => (
        <PlotSection key={plot.plot_id} plot={plot} />
      ))}
    </div>
  )
}

export default PlotsPage
