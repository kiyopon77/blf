"use client"

import { useEffect } from "react"
import { useParams } from "next/navigation"
import { useForm, Controller } from "react-hook-form"
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
  updatePayment
} from "@/services/plot"

export default function EditPlot() {

  const { plotId } = useParams()

  const {
    register,
    control,
    handleSubmit,
    reset
  } = useForm({
    defaultValues: {

      plot_id: null,
      floor_id: null,
      broker_id: null,
      customer_id: null,

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
  useEffect(() => {

    if (!plotId) return

    const load = async () => {

      try {

        const [plotCode, floorNo] = (plotId as string).split("-")

        const { plot, floor, sale, broker, customer, payments } = await getPlotDetail(plotCode, Number(floorNo))

        console.log(plot);
        console.log(floor);
        console.log(sale)
        console.log(broker)
        console.log(customer)

        const MILESTONE_ORDER = [
          "TOKEN",
          "ATS",
          "SUPERSTRUCTURE",
          "PROPERTY_ID",
          "REGISTRY",
          "POSSESSION"
        ]

        reset({
          plot_id: plot?.plot_id,
          floor_id: floor?.floor_id,
          broker_id: sale?.broker_id || null,
          customer_id: sale?.customer_id || null,

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

    try {

      const requests: Promise<any>[] = []

      // update plot
      if (data.plot_id) {
        requests.push(
          updatePlot(data.plot_id, {
            length: Number(data.length),
            breadth: Number(data.breadth)
          })
        )
      }

      if (data.floor_id) {
        requests.push(updateFloorStatus(data.floor_id, data.floor_status))
      }

      // update floor
      if (data.floor_id) {
        requests.push(
          updateFloorStatus(data.floor_id, data.floor_status)
        )
      }

      // update broker
      if (data.broker_id) {
        requests.push(
          updateBroker(data.broker_id, {
            broker_name: data.broker_name,
            company: data.broker_company,
            phone: data.broker_phone
          })
        )
      }

      // update customer
      if (data.customer_id) {
        requests.push(
          updateCustomer(data.customer_id, {
            full_name: data.customer_name,
            phone: data.customer_phone,
            email: data.customer_email,
            address: data.customer_address,
            kyc_status: data.customer_kyc_status
          })
        )
      }

      // update payments
      for (const payment of data.payments) {
        if (!payment.payment_id) continue  // ← skip non-existent ones
        requests.push(
          updatePayment(payment.payment_id, {
            status: payment.status,
            amount: payment.amount || null,
            paid_at: payment.paid_at || null
          })
        )
      }
      await Promise.all(requests)

      message.success("Plot updated successfully")

    } catch {

      message.error("Failed to update")

    }

  }

  return (

    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-8 p-10 bg-gray-50 min-h-screen"
    >

      {/* HEADER */}

      <div className="flex justify-between items-center">

        <div className="flex flex-col">
          <span className="text-3xl font-bold">
            Edit Plot
          </span>
        </div>

        <button
          type="submit"
          className="px-6 py-2 bg-green-700 text-white rounded-lg"
        >
          Save Changes
        </button>

      </div>


      {/* PLOT STATUS */}
      <SectionCard title="PLOT STATUS">
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

      <SectionCard title="PLOT & VALUE">

        <div className="grid grid-cols-2 gap-6">

          <Field
            label="PLOT VALUE"
            {...register("plot_value")}
          />

          <Field
            label="SELLING DATE"
            {...register("selling_date")}
          />

        </div>

      </SectionCard>


      {/* BROKER */}

      <SectionCard title="BROKER INFORMATION">

        <div className="grid grid-cols-2 gap-6">

          <Field
            label="BROKER NAME"
            {...register("broker_name")}
          />

          <Field
            label="BROKER COMPANY"
            {...register("broker_company")}
          />

          <Field
            label="BROKER PHONE"
            {...register("broker_phone")}
          />

          <Field
            label="BROKER EMAIL"
            {...register("broker_email")}
          />

        </div>

      </SectionCard>


      {/* CUSTOMER */}

      <SectionCard title="CUSTOMER INFORMATION">

        <div className="grid grid-cols-2 gap-6">

          <Field
            label="CUSTOMER NAME"
            {...register("customer_name")}
          />

          <Field
            label="PAN"
            {...register("customer_pan")}
          />

          <Field
            label="PHONE"
            {...register("customer_phone")}
          />

          <Field
            label="EMAIL"
            {...register("customer_email")}
          />

          <Field
            label="ADDRESS"
            {...register("customer_address")}
          />

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


      {/* PLOT */}

      <SectionCard title="PLOT DETAILS">

        <div className="grid grid-cols-2 gap-6">

          <Field
            label="LENGTH"
            {...register("length")}
          />

          <Field
            label="BREADTH"
            {...register("breadth")}
          />

        </div>

      </SectionCard>


      {/* FLOOR */}

      <SectionCard title="FLOOR STATUS">

        <Controller
          name="floor_status"
          control={control}
          render={({ field }) => (
            <StatusRadio
              label="FLOOR STATUS"
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />

      </SectionCard>
      <SectionCard title="PAYMENT MILESTONES">
        <MilestoneSection control={control} register={register} />
      </SectionCard>

    </form>

  )
}
