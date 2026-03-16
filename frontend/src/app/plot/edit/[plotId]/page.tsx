"use client"

import { useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { useForm, Controller, useWatch } from "react-hook-form"
import { message } from "antd"

import MilestoneSection from "./components/MilestoneStatus"
import SectionCard from "./components/SectionCard"
import Field from "./components/Field"
import StatusRadio from "./components/StatusRadio"

import {
  getPlotDetail,
  updatePlot,
  updateFloorStatus,
  updateBroker,
  updateCustomer,
  updatePayment,
  updateSale,
  updateCustomerPan
} from "@/services/plot"

export default function EditPlot() {

  const { plotId } = useParams()
  const router = useRouter()

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    defaultValues: {
      plot_id: null,
      floor_id: null,
      broker_id: null,
      customer_id: null,
      sale_id: null,
      plot_value: "",
      selling_date: "",
      broker_name: "",
      broker_company: "",
      broker_phone: "",
      broker_email: "",
      customer_name: "",
      customer_pan: "",
      customer_phone: "",
      customer_email: "",
      customer_address: "",
      customer_kyc_status: "PENDING",
      length: "",
      breadth: "",
      floor_status: "AVAILABLE" as "AVAILABLE" | "HOLD" | "SOLD" | "CANCELLED",
      payments: [] as any[]
    }
  })

  // Watch payments + plot_value reactively for live sum validation
  const watchedPayments = useWatch({ control, name: "payments" })
  const watchedPlotValue = useWatch({ control, name: "plot_value" })

  const paymentsSum = (watchedPayments || []).reduce((sum: number, p: any) => {
    const amt = parseFloat(p?.amount)
    return sum + (isNaN(amt) ? 0 : amt)
  }, 0)
  const plotValueNum = parseFloat(watchedPlotValue as string)
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
          broker_company: broker?.company || "",
          broker_phone: broker?.phone || "",
          broker_email: broker?.email || "",
          customer_name: customer?.full_name || "",
          customer_pan: customer?.pan || "",
          customer_phone: customer?.phone || "",
          customer_email: customer?.email || "",
          customer_address: customer?.address || "",
          customer_kyc_status: customer?.kyc_status || "PENDING",
          length: plot?.length || "",
          breadth: plot?.breadth || "",
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
          length: Number(data.length),
          breadth: Number(data.breadth)
        }))
      }

      if (data.floor_id) {
        requests.push(updateFloorStatus(data.floor_id, data.floor_status))
      }

      if (data.broker_id) {
        requests.push(updateBroker(data.broker_id, {
          broker_name: data.broker_name,
          company: data.broker_company,
          phone: data.broker_phone
        }))
      }

      if (data.customer_id) {
        requests.push(updateCustomer(data.customer_id, {
          full_name: data.customer_name,
          phone: data.customer_phone,
          email: data.customer_email,
          address: data.customer_address,
          kyc_status: data.customer_kyc_status
        }))

        // update sale value + selling date
        if (data.sale_id) {
          requests.push(
            updateSale(data.sale_id, {
              total_value: data.plot_value ? Number(data.plot_value) : null,
              initiated_at: data.selling_date ? new Date(data.selling_date).toISOString() : null,
            })
          )
        }

        // update customer PAN separately via PATCH
        if (data.customer_id && data.customer_pan) {
          requests.push(updateCustomerPan(data.customer_id, data.customer_pan))
        }
      }

      for (const payment of data.payments) {
        if (!payment.payment_id) continue
        requests.push(updatePayment(payment.payment_id, {
          status: payment.status,
          amount: payment.amount || null,
          paid_at: payment.paid_at || null
        }))
      }

      await Promise.all(requests)
      message.success("Plot updated successfully")
      router.back()
    } catch {
      message.error("Failed to update")
    }
  }

  const err = (field: any) =>
    field ? <p className="text-red-500 text-xs mt-1">{field.message}</p> : null

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-8 p-10 bg-gray-50 min-h-screen w-3/4 mx-auto"
    >
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div className="flex flex-col">
          <span className="text-3xl font-bold">Edit Floor: {plotId}</span>
        </div>
        <button
          type="submit"
          className="px-6 py-2 bg-green-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={sumExceedsPlotValue}
        >
          Save Changes
        </button>
      </div>

      {/* PLOT STATUS */}
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
          </select>
        </div>
      </SectionCard>

      {/* PLOT VALUE */}
      <SectionCard title="FLOOR & VALUE">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <Field
              label="FLOOR VALUE"
              {...register("plot_value", {
                required: "Floor value is required",
                validate: v => !isNaN(parseFloat(v)) && parseFloat(v) > 0 || "Must be a positive number"
              })}
            />
            {err(errors.plot_value)}
          </div>
          <div>
            <Field
              label="SELLING DATE"
              type="date"
              {...register("selling_date")}
            />
          </div>
        </div>
      </SectionCard>

      {/* BROKER */}
      <SectionCard title="BROKER INFORMATION">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <Field label="BROKER NAME" {...register("broker_name", { required: "Broker name is required" })} />
            {err(errors.broker_name)}
          </div>
          <div>
            <Field label="BROKER COMPANY" {...register("broker_company")} />
          </div>
          <div>
            <Field
              label="BROKER PHONE"
              {...register("broker_phone", {
                pattern: { value: /^[0-9]{10}$/, message: "Phone number must be exactly 10 digits" }
              })}
            />
            {err(errors.broker_phone)}
          </div>
          <div>
            <Field
              label="BROKER EMAIL"
              {...register("broker_email", {
                pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Invalid email address" }
              })}
            />
            {err(errors.broker_email)}
          </div>
        </div>
      </SectionCard>

      {/* CUSTOMER */}
      <SectionCard title="CUSTOMER INFORMATION">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <Field label="CUSTOMER NAME" {...register("customer_name", { required: "Customer name is required" })} />
            {err(errors.customer_name)}
          </div>
          <div>
            <Field
              label="PAN"
              {...register("customer_pan", {
                pattern: { value: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, message: "Invalid PAN format (e.g. ABCDE1234F)" }
              })}
            />
            {err(errors.customer_pan)}
          </div>
          <div>
            <Field
              label="PHONE"
              {...register("customer_phone", {
                pattern: { value: /^[0-9]{10}$/, message: "Phone number must be exactly 10 digits" }
              })}
            />
            {err(errors.customer_phone)}
          </div>
          <div>
            <Field
              label="EMAIL"
              {...register("customer_email", {
                pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Invalid email address" }
              })}
            />
            {err(errors.customer_email)}
          </div>
          <div className="col-span-2">
            <Field label="ADDRESS" {...register("customer_address")} />
          </div>
        </div>
      </SectionCard>

      {/* CUSTOMER KYC */}
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

      {/* PLOT DETAILS */}
      <SectionCard title="FLOOR DETAILS">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <Field
              label="LENGTH"
              {...register("length", {
                required: "Length is required",
                validate: v => !isNaN(parseFloat(v)) && parseFloat(v) > 0 || "Must be a positive number"
              })}
            />
            {err(errors.length)}
          </div>
          <div>
            <Field
              label="BREADTH"
              {...register("breadth", {
                required: "Breadth is required",
                validate: v => !isNaN(parseFloat(v)) && parseFloat(v) > 0 || "Must be a positive number"
              })}
            />
            {err(errors.breadth)}
          </div>
        </div>
      </SectionCard>

      {/* PAYMENT MILESTONES */}
      <SectionCard title="PAYMENT MILESTONES">
        {/* Live sum indicator */}
        <div className={`flex items-center justify-between mb-4 px-4 py-3 rounded-lg border ${sumExceedsPlotValue
          ? "bg-red-50 border-red-300"
          : "bg-gray-50 border-gray-200"
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
              ⚠ Exceeds plot value by ₹{" "}
              {(paymentsSum - plotValueNum).toLocaleString("en-IN")}
            </span>
          )}
        </div>

        <MilestoneSection control={control} register={register} />
      </SectionCard>

    </form>
  )
}
