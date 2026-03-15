import api from "@/lib/api"

export const getPlotMatrix = async () => {

  const { data: plots } = await api.get("/plots")

  const matrix = await Promise.all(
    plots.map(async (plot: any) => {

      const { data: floors } = await api.get(`/plots/${plot.plot_id}/floors`)

      return {
        plot: plot.plot_code,
        floors: floors.map((f: any) => ({
          floor: f.floor_no,
          status: f.status.toLowerCase()
        }))
      }

    })
  )

  return matrix
}
