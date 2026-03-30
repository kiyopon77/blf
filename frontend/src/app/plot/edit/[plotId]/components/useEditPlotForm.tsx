import { useCallback, useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useForm, useWatch } from "react-hook-form"
import { App } from "antd"

import { updateCustomerPan, getCustomers, updateCustomer } from "@/services/admin/customer"
import { updateSale } from "@/services/admin/sales"
import { getBrokers, updateBroker } from "@/services/admin/broker"
import { updateFloorStatus } from "@/services/admin/floor"
import { getPlotDetail, updatePlot, updatePayment } from "@/services/plot"

import { MILESTONE_ORDER, EditPlotFormValues } from "../types"
import type { Customer } from "@/types/customer"
import type { Broker } from "@/types/broker"

const SOCIETY_ID = 1 // replace with value from auth context

export function useEditPlotForm() {
  const { plotId } = useParams()
  const router = useRouter()
  const { message } = App.useApp()

  // ── Dropdown data ──────────────────────────────────────────────────────────
  const [brokers, setBrokers] = useState<Broker[]>([])
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loadingBrokers, setLoadingBrokers] = useState(false)
  const [loadingCustomers, setLoadingCustomers] = useState(false)

  // ── Dialog visibility ──────────────────────────────────────────────────────
  const [showAddBroker, setShowAddBroker] = useState(false)
  const [showAddCustomer, setShowAddCustomer] = useState(false)
  const [showCreateSale, setShowCreateSale] = useState(false)

  // ── Form ───────────────────────────────────────────────────────────────────
  const { register, control, handleSubmit, reset, setValue, watch } =
    useForm<EditPlotFormValues>({
      defaultValues: {
        plot_id:    null,
        floor_id:   null,
        broker_id:  null,
        customer_id: null,
        sale_id:    null,
        floor_value: "",
        sale_total_value: "",
        selling_date: "",
        commission_percent: "",
        broker_name: "",
        broker_phone: "",
        customer_name: "",
        customer_pan: "",
        customer_phone: "",
        customer_email: "",
        customer_address: "",
        customer_kyc_status: "PENDING",
        area_sqyd: "",
        area_sqft: "",
        floor_status: "AVAILABLE",
        payments: [],
      },
    })

  const watchedPayments   = useWatch({ control, name: "payments" })
  const watchedSaleValue  = useWatch({ control, name: "sale_total_value" })
  const watchedFloorValue = useWatch({ control, name: "floor_value" })
  const watchedSaleId     = useWatch({ control, name: "sale_id" })

  const hasSale = !!watchedSaleId

  const paymentsSum = (watchedPayments || []).reduce((sum: number, p: any) => {
    const amt = parseFloat(p?.amount)
    return sum + (isNaN(amt) ? 0 : amt)
  }, 0)

  const saleValueNum  = parseFloat(watchedSaleValue as string)
  const floorValueNum = parseFloat(watchedFloorValue as string)
  const sumExceedsSaleValue =
    !isNaN(saleValueNum) && saleValueNum > 0 && paymentsSum > saleValueNum

  // ── Load dropdowns ─────────────────────────────────────────────────────────
  const loadBrokers = useCallback(async () => {
    setLoadingBrokers(true)
    try { setBrokers(await getBrokers(SOCIETY_ID)) } catch { }
    finally { setLoadingBrokers(false) }
  }, [])

  const loadCustomers = useCallback(async () => {
    setLoadingCustomers(true)
    try { setCustomers(await getCustomers(SOCIETY_ID)) } catch { }
    finally { setLoadingCustomers(false) }
  }, [])

  useEffect(() => {
    loadBrokers()
    loadCustomers()
  }, [loadBrokers, loadCustomers])

  // ── Load plot detail ───────────────────────────────────────────────────────
  useEffect(() => {
    if (!plotId) return
    const load = async () => {
      try {
        const [plotCode, floorNo] = (plotId as string).split("-")
        const { plot, floor, sale, broker, customer, payments } =
          await getPlotDetail(plotCode, Number(floorNo))

        reset({
          plot_id:     plot?.plot_id,
          floor_id:    floor?.floor_id,
          broker_id:   sale?.broker_id || null,
          customer_id: sale?.customer_id || null,
          sale_id:     sale?.sale_id || null,
          floor_value: floor?.floor_value ?? "",
          sale_total_value: sale?.total_value || "",
          selling_date: sale?.initiated_at?.split("T")[0] || "",
          commission_percent: sale?.commission_percent ?? "",
          broker_name:  broker?.broker_name || "",
          broker_phone: broker?.phone || "",
          customer_name:    customer?.full_name || "",
          customer_pan:     customer?.pan || "",
          customer_phone:   customer?.phone || "",
          customer_email:   customer?.email || "",
          customer_address: customer?.address || "",
          customer_kyc_status: customer?.kyc_status || "PENDING",
          area_sqyd:    plot?.area_sqyd || "",
          area_sqft:    plot?.area_sqft || "",
          floor_status: floor?.status ?? "AVAILABLE",
          payments: MILESTONE_ORDER.map(milestone => {
            const existing = (payments || []).find((p: any) => p.milestone === milestone)
            return existing
              ? { ...existing, paid_at: existing.paid_at ? existing.paid_at.split("T")[0] : "" }
              : { payment_id: null, milestone, amount: "", status: "PENDING", paid_at: "" }
          }),
        })
      } catch (err) {
        console.log(err)
        message.error("Failed to load plot")
      }
    }
    load()
  }, [plotId, reset])

  // ── Selection handlers ─────────────────────────────────────────────────────
  //
  // Each handler accepts either:
  //   - a plain number (dropdown selection) → looks up from current state
  //   - a full object (called right after createBroker/createCustomer) → uses
  //     the object directly, bypassing the state array which hasn't flushed yet
  //
  const handleBrokerChange = (brokerIdOrObject: number | Broker | null) => {
    if (!brokerIdOrObject) {
      setValue("broker_id",    null)
      setValue("broker_name",  "")
      setValue("broker_phone", "")
      return
    }
    const broker =
      typeof brokerIdOrObject === "object"
        ? brokerIdOrObject
        : brokers.find(b => b.broker_id === brokerIdOrObject) ?? null
    setValue("broker_id",    broker?.broker_id ?? null)
    setValue("broker_name",  broker?.broker_name || "")
    setValue("broker_phone", broker?.phone || "")
  }

  const handleCustomerChange = (customerIdOrObject: number | Customer | null) => {
    if (!customerIdOrObject) {
      setValue("customer_id",          null)
      setValue("customer_name",        "")
      setValue("customer_pan",         "")
      setValue("customer_phone",       "")
      setValue("customer_email",       "")
      setValue("customer_address",     "")
      setValue("customer_kyc_status",  "PENDING")
      return
    }
    const customer =
      typeof customerIdOrObject === "object"
        ? customerIdOrObject
        : customers.find(c => c.customer_id === customerIdOrObject) ?? null
    setValue("customer_id",         customer?.customer_id ?? null)
    setValue("customer_name",       customer?.full_name || "")
    setValue("customer_pan",        customer?.pan || "")
    setValue("customer_phone",      customer?.phone || "")
    setValue("customer_email",      customer?.email || "")
    setValue("customer_address",    customer?.address || "")
    setValue("customer_kyc_status", customer?.kyc_status || "PENDING")
  }

  // ── Submit ─────────────────────────────────────────────────────────────────
  const onSubmit = async (data: EditPlotFormValues) => {
    if (sumExceedsSaleValue) {
      message.error("Total milestone payments cannot exceed the sale value")
      return
    }
    try {
      const requests: Promise<any>[] = []

      if (data.plot_id) {
        requests.push(updatePlot(data.plot_id, {
          area_sqyd: data.area_sqyd ? Number(data.area_sqyd) : null,
          area_sqft: data.area_sqft ? Number(data.area_sqft) : null,
        }))
      }

      if (data.floor_id) {
        requests.push(updateFloorStatus(data.floor_id, data.floor_status))
      }

      if (data.broker_id) {
        requests.push(updateBroker(data.broker_id, {
          broker_name: data.broker_name,
          phone: data.broker_phone,
        }))
      }

      if (data.customer_id) {
        requests.push(updateCustomer(data.customer_id, {
          full_name: data.customer_name,
          phone:     data.customer_phone,
          email:     data.customer_email,
          address:   data.customer_address,
          kyc_status: data.customer_kyc_status,
        }))
        if (data.customer_pan) {
          requests.push(updateCustomerPan(data.customer_id, data.customer_pan))
        }
      }

      if (data.sale_id) {
        requests.push(updateSale(data.sale_id, {
          total_value: data.sale_total_value ? Number(data.sale_total_value) : null,
          commission_percent: data.commission_percent ? Number(data.commission_percent) : null,
          initiated_at: data.selling_date ? new Date(data.selling_date).toISOString() : null,
        }))
      }

      for (const payment of data.payments) {
        if (!payment.payment_id) continue
        requests.push(updatePayment(payment.payment_id, {
          status: payment.status,
          amount: payment.amount ? Number(payment.amount) : null,
          paid_at: payment.paid_at ? new Date(payment.paid_at).toISOString() : null,
        }))
      }

      await Promise.all(requests)
      message.success("Plot updated successfully")
      router.back()
    } catch {
      message.error("Failed to update")
    }
  }

  return {
    // form
    plotId,
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    onSubmit,
    // derived state
    hasSale,
    paymentsSum,
    saleValueNum,
    floorValueNum,
    sumExceedsSaleValue,
    watchedFloorValue,
    watchedSaleValue,
    // dropdowns
    brokers,
    customers,
    loadingBrokers,
    loadingCustomers,
    setBrokers,
    setCustomers,
    handleBrokerChange,
    handleCustomerChange,
    // dialogs
    showAddBroker,   setShowAddBroker,
    showAddCustomer, setShowAddCustomer,
    showCreateSale,  setShowCreateSale,
    // constants
    SOCIETY_ID,
  }
}
