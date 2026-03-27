"use client"

import { useEffect, useState } from "react"
import { getPlots } from "@/services/admin/plot"
import { Plot } from "@/types/plot"
import PlotSection from "./components/PlotSection"
import AdminButton from "@/components/ui/AdminButton"
import PlotCreateModal from "./components/modals/PlotCreateModal"
import { Plus } from "lucide-react"
import { useAuth } from "@/context/AuthContext"

const PlotsPage = () => {
  const [plots, setPlots] = useState<Plot[]>([])
  const [createOpen, setCreateOpen] = useState(false)

  const {society} = useAuth()

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await getPlots()

        const order = ["C", "A", "B"]

        const sorted = data.sort((a, b) => {
          const getPrefix = (code: string) => code?.[0] || ""

          const diff =
            order.indexOf(getPrefix(a.plot_code)) -
            order.indexOf(getPrefix(b.plot_code))

          if (diff !== 0) return diff

          return a.plot_code.localeCompare(b.plot_code, undefined, {
            numeric: true,
          })
        })

        setPlots(sorted)
      } catch (err) {
        console.error(err)
      }
    }

    fetch()
  }, [])

  return (
    <div className="max-w-350 mx-auto px-8 py-10 w-full">

      {/* HEADER */}
      <div className="mb-10 flex items-center justify-between">
        <div>
          <h1 className="text-[28px] font-bold text-gray-900">
            Plots & Floors
          </h1>
          <p className="text-gray-500 mt-1 text-sm">
            Manage inventory structure and availability
          </p>
        </div>

        <AdminButton
          onClick={() => setCreateOpen(true)}
          icon={<Plus size={16} />}
        >
          Create Plot
        </AdminButton>
      </div>

      {/* PLOTS */}
      <div className="flex flex-col gap-8 pb-16">
        {plots.map((plot) => (
          <PlotSection key={plot.plot_id} plot={plot} setPlots={setPlots} />
        ))}
      </div>

      {/* MODAL */}
      <PlotCreateModal
        open={createOpen}
        setOpen={setCreateOpen}
        setPlots={setPlots}
        societyId={society}
      />
    </div>
  )
}

export default PlotsPage
