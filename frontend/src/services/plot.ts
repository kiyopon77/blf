import api from "@/lib/api"

export const getPlotDetail = async (plotCode: string, floorNo: number) => {

  const { data: plots } = await api.get("/plots")
  const plot = plots.find((p: any) => p.plot_code === plotCode)

  const { data: floors } = await api.get(`/plots/${plot.plot_id}/floors`)
  const floor = floors.find((f: any) => f.floor_no === floorNo)

  let sale = null
  let payments = []

  if (floor.active_sale_id) {

    const { data } = await api.get(`/sales/${floor.active_sale_id}`)
    sale = data

    const res = await api.get(`/sales/${floor.active_sale_id}/payments`)
    payments = res.data
  }

  return {
    plot,
    floor,
    sale,
    payments
  }
}
