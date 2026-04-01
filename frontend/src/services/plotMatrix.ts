import api from "@/lib/api"

export const getPlotMatrix = async (society_id?: number | null) => {
  const { data } = await api.get("/plots/matrix", {
    params: { society_id },
  })

  const matrix = data.map((plot: any) => ({
    plot: plot.plot_code,
    plot_id: plot.plot_id,
    area_sqyd: plot.area_sqyd,
    area_sqft: plot.area_sqft,
    floors: plot.floors.map((f: any) => ({
      floor: f.floor_no,
      floor_id: f.floor_id,
      status: f.status.toLowerCase() as
        | "available"
        | "sold"
        | "hold"
        | "cancelled"
        | "investor_unit",
      active_sale_id: f.active_sale_id ?? null,
      sale_status: f.sale_status ?? null,
      broker_name: f.broker_name ?? null,
      last_changed_by: f.last_changed_by ?? null,
      last_changed_at: f.last_changed_at ?? null,
    })),
  }))

  return matrix.sort((a: any, b: any) => {
    const n = (s: string) => parseInt(s.replace(/\D/g, ""))
    return n(a.plot) - n(b.plot)
  })
}
