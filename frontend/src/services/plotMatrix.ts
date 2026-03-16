import api from "@/lib/api"

export const getPlotMatrix = async () => {
  const { data } = await api.get("/plots/matrix")

  const matrix = data.map((plot: any) => ({
    plot: plot.plot_code,
    plot_id: plot.plot_id,
    floors: plot.floors.map((f: any) => ({
      floor: f.floor_no,
      floor_id: f.floor_id,
      status: f.status.toLowerCase() as "available" | "sold" | "hold" | "cancelled",
      active_sale_id: f.active_sale_id ?? null,
    })),
  }))

  return matrix.sort((a: any, b: any) => {
    const n = (s: string) => parseInt(s.replace(/\D/g, ""))
    return n(a.plot) - n(b.plot)
  })
}
