import api from "@/lib/api"

export const getPlotDetail = async (plotCode: string, floorNo: number) => {
  const { data: plots } = await api.get("/plots")
  const plot = plots.find((p: any) => p.plot_code === plotCode)
  if (!plot) throw new Error("Plot not found")

  const { data: floors } = await api.get(`/plots/${plot.plot_id}/floors`)
  const floor = floors.find((f: any) => f.floor_no === floorNo)
  if (!floor) throw new Error("Floor not found")

  let sale = null
  let broker = null
  let customer = null
  let payments: any[] = []

  if (floor.active_sale_id) {
    const { data: saleDetail } = await api.get(`/sales/${floor.active_sale_id}`)
    const { data: allSales } = await api.get("/sales")
    const saleBase = allSales.find((s: any) => s.sale_id === floor.active_sale_id)

    const brokerId = saleBase?.broker_id ?? null
    const customerId = saleBase?.customer_id ?? null

    const [brokerRes, customerRes, paymentsRes] = await Promise.all([
      brokerId ? api.get(`/brokers/${brokerId}`) : Promise.resolve({ data: null }),
      customerId ? api.get(`/customers/${customerId}`) : Promise.resolve({ data: null }),
      api.get(`/sales/${floor.active_sale_id}/payments`),
    ])

    broker = brokerRes.data
    customer = customerRes.data
    payments = paymentsRes.data
    sale = { ...saleDetail, broker_id: brokerId, customer_id: customerId }
  }

  return { plot, floor, sale, broker, customer, payments }
}

export const updatePlot = async (
  plotId: number,
  payload: { area_sqyd?: number | null; area_sqft?: number | null }
) => {
  const { data } = await api.put(`/plots/${plotId}`, payload)
  return data
}

export const updateFloorStatus = async (
  floorId: number,
  status: "AVAILABLE" | "HOLD" | "SOLD" | "CANCELLED" | "INVESTOR_UNIT"
) => {
  const { data } = await api.put(`/floors/${floorId}/status`, { status })
  return data
}

export const updateBroker = async (
  brokerId: number,
  payload: { broker_name?: string; phone?: string }
) => {
  const { data } = await api.put(`/brokers/${brokerId}`, payload)
  return data
}

export const updateCustomer = async (
  customerId: number,
  payload: {
    full_name?: string
    phone?: string
    email?: string
    address?: string
    kyc_status?: string
  }
) => {
  const { data } = await api.put(`/customers/${customerId}`, payload)
  return data
}

export const updatePayment = async (
  paymentId: number,
  payload: {
    status: "DONE" | "PENDING"
    amount?: number | null
    paid_at?: string | null
  }
) => {
  const { data } = await api.put(`/payments/${paymentId}`, payload)
  return data
}

export const updateSaleStatus = async (
  saleId: number,
  status: "HOLD" | "SOLD" | "CANCELLED" | "INVESTOR_UNIT"
) => {
  const { data } = await api.put(`/sales/${saleId}/status`, { status })
  return data
}

export const updateSale = async (
  saleId: number,
  payload: {
    total_value?: number | null
    initiated_at?: string | null
    commission_percent?: number | null
  }
) => {
  const { data } = await api.put(`/sales/${saleId}`, payload)
  return data
}

export const updateCustomerPan = async (customerId: number, pan: string) => {
  const { data } = await api.patch(`/customers/${customerId}/pan`, { pan })
  return data
}
