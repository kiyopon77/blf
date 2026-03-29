"use client"

import { useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { useForm, Controller, useWatch } from "react-hook-form"
import { App } from "antd"

import MilestoneSection from "./components/MilestoneStatus"
import SectionCard from "./components/SectionCard"
import Field from "./components/Field"
import StatusRadio from "./components/StatusRadio"
import { updateCustomerPan } from "@/services/admin/customer"
import { updateSale } from "@/services/admin/sales"
import { updateCustomer } from "@/services/admin/customer"
import { updateBroker } from "@/services/admin/broker"
import { updateFloorStatus } from "@/services/admin/floor"
import {
  getPlotDetail,
  updatePlot,
  updatePayment,
} from "@/services/plot"

export default function EditPlot() {
  const { plotId } = useParams()
  const router = useRouter()
  const { message } = App.useApp()

  const { register, control, handleSubmit, reset, setValue } = useForm({
    defaultValues: {
      plot_id: null,
      floor_id: null,
      broker_id: null,
      customer_id: null,
      sale_id: null,
      plot_value: "",
      selling_date: "",
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
      floor_status: "AVAILABLE" as "AVAILABLE" | "HOLD" | "SOLD" | "CANCELLED" | "INVESTOR_UNIT",
      payments: [] as any[]
    }
  })

  const watchedPayments = useWatch({ control, name: "payments" })
  const watchedPlotValue = useWatch({ control, name: "plot_value" })

  const paymentsSum = (watchedPayments || []).reduce((sum: number, p: any) => {
    const amt = parseFloat(p?.amount)
    return sum + (isNaN(amt) ? 0 : amt)
  }, 0)
  const plotValueNum = parseFloat(watchedPlotValue as string)
  const floorValueNum = parseFloat(watchedPlotValue as string) || null
  const sumExceedsPlotValue = !isNaN(plotValueNum) && plotValueNum > 0 && paymentsSum > plotValueNum

  useEffect(() => {
    if (!plotId) return
    const load = async () => {
      try {
        const [plotCode, floorNo] = (plotId as string).split("-")
        const { plot, floor, sale, broker, customer, payments } = await getPlotDetail(plotCode, Number(floorNo))

        const MILESTONE_ORDER = ["TOKEN", "ATS", "SUPERSTRUCTURE", "PROPERTY_ID", "REGISTRY", "POSSESSION"]

        reset({
          plot_id: plot?.plot_id,
          floor_id: floor?.floor_id,
          broker_id: sale?.broker_id || null,
          customer_id: sale?.customer_id || null,
          sale_id: sale?.sale_id || null,
          plot_value: sale?.total_value || "",
          selling_date: sale?.initiated_at?.split("T")[0] || "",
          broker_name: broker?.broker_name || "",
          broker_phone: broker?.phone || "",
          customer_name: customer?.full_name || "",
          customer_pan: customer?.pan || "",
          customer_phone: customer?.phone || "",
          customer_email: customer?.email || "",
          customer_address: customer?.address || "",
          customer_kyc_status: customer?.kyc_status || "PENDING",
          area_sqyd: plot?.area_sqyd || "",
          area_sqft: plot?.area_sqft || "",
          floor_status: floor?.status ?? "AVAILABLE",
          payments: MILESTONE_ORDER.map(milestone => {
            const existing = (payments || []).find((p: any) => p.milestone === milestone)
            return existing
              ? { ...existing, paid_at: existing.paid_at ? existing.paid_at.split("T")[0] : "" }
              : { payment_id: null, milestone, amount: "", status: "PENDING", paid_at: "" }
          })
        })
      } catch (err) {
        console.log(err)
        message.error("Failed to load plot")
      }
    }
    load()
  }, [plotId, reset])

  const onSubmit = async (data: any) => {
    if (sumExceedsPlotValue) {
      message.error("Total milestone payments cannot exceed the plot value")
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
          phone: data.customer_phone,
          email: data.customer_email,
          address: data.customer_address,
          kyc_status: data.customer_kyc_status,
        }))

        if (data.customer_pan) {
          requests.push(updateCustomerPan(data.customer_id, data.customer_pan))
        }
      }

      if (data.sale_id) {
        requests.push(updateSale(data.sale_id, {
          total_value: data.plot_value ? Number(data.plot_value) : null,
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

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-8 p-10 bg-gray-50 min-h-screen w-3/4 mx-auto"
    >
      <div className="flex justify-between items-center">
        <span className="text-3xl font-bold">Edit Floor: {plotId}</span>
        <button
          type="submit"
          className="px-6 py-2 bg-green-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={sumExceedsPlotValue}
        >
          Save Changes
        </button>
      </div>

      <SectionCard title="FLOOR STATUS">
        <div className="flex flex-col gap-2 w-64">
          <span className="text-xs text-gray-500 font-semibold">AVAILABILITY STATUS</span>
          <select
            {...register("floor_status")}
            className="h-11 rounded-lg border border-gray-300 px-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-green-600"
          >
            <option value="AVAILABLE">Available</option>
            <option value="HOLD">Hold</option>
            <option value="SOLD">Sold</option>
            <option value="CANCELLED">Cancelled</option>
            <option value="INVESTOR_UNIT">Investor Unit</option>
          </select>
        </div>
      </SectionCard>

      <SectionCard title="FLOOR & VALUE">
        <div className="grid grid-cols-2 gap-6">
          <Field label="FLOOR VALUE" {...register("plot_value")} />
          <Field label="SELLING DATE" type="date" {...register("selling_date")} />
        </div>
      </SectionCard>

      <SectionCard title="BROKER INFORMATION">
        <div className="grid grid-cols-2 gap-6">
          <Field label="BROKER NAME" {...register("broker_name")} />
          <Field label="BROKER PHONE" {...register("broker_phone")} />
        </div>
      </SectionCard>

      <SectionCard title="CUSTOMER INFORMATION">
        <div className="grid grid-cols-2 gap-6">
          <Field label="CUSTOMER NAME" {...register("customer_name")} />
          <Field label="PAN" {...register("customer_pan")} />
          <Field label="PHONE" {...register("customer_phone")} />
          <Field label="EMAIL" {...register("customer_email")} />
          <div className="col-span-2">
            <Field label="ADDRESS" {...register("customer_address")} />
          </div>
        </div>
      </SectionCard>

      <SectionCard title="CUSTOMER COMPLIANCE">
        <Controller
          name="customer_kyc_status"
          control={control}
          render={({ field }) => (
            <StatusRadio
              label="CUSTOMER KYC STATUS"
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />
      </SectionCard>

      <SectionCard title="FLOOR DETAILS">
        <div className="grid grid-cols-2 gap-6">
          <Field label="AREA (SQ YD)" {...register("area_sqyd")} />
          <Field label="AREA (SQ FT)" {...register("area_sqft")} />
        </div>
      </SectionCard>

      <SectionCard title="PAYMENT MILESTONES">
        <div className={`flex items-center justify-between mb-4 px-4 py-3 rounded-lg border ${sumExceedsPlotValue ? "bg-red-50 border-red-300" : "bg-gray-50 border-gray-200"
          }`}>
          <span className="text-sm text-gray-600">
            Total entered:{" "}
            <span className={`font-bold ${sumExceedsPlotValue ? "text-red-600" : "text-gray-800"}`}>
              ₹ {paymentsSum.toLocaleString("en-IN")}
            </span>
          </span>
          <span className="text-sm text-gray-500">
            Plot value:{" "}
            <span className="font-bold text-gray-800">
              ₹ {isNaN(plotValueNum) ? "—" : plotValueNum.toLocaleString("en-IN")}
            </span>
          </span>
          {sumExceedsPlotValue && (
            <span className="text-xs text-red-600 font-semibold">
              ⚠ Exceeds plot value by ₹ {(paymentsSum - plotValueNum).toLocaleString("en-IN")}
            </span>
          )}
        </div>
        <MilestoneSection control={control} register={register} setValue={setValue} floorValue={floorValueNum} />
      </SectionCard>
    </form>
  )
}
