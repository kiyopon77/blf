// app/plot/edit/[plotId]/page.tsx
"use client"

import { useState } from "react"
import { Controller } from "react-hook-form"

import SectionCard from "./ui/SectionCard"
import Field from "./ui/Field"
import StatusRadio from "./ui/StatusRadio"

import { ThreeDot } from "react-loading-indicators"
import { useEditPlotForm } from "./components/useEditPlotForm"
import { PriceBadge } from "./components/ui"
import { PricingSection } from "./components/PricingSection"
import { BrokerSection } from "./components/BrokerSection"
import { CustomerSection } from "./components/CustomerSection"
import { MilestonesSection } from "./components/MilestoneSection"
import { AddBrokerDialog } from "./components/AddBrokerDialog"
import { AddCustomerDialog } from "./components/AddCustomerDialog"
import { CreateSaleDialog } from "./components/CreateSaleDialog"
import { CoApplicantSection } from "./components/CoApplicantSection"
import AddCoApplicantModal from "@/app/admin/customers/components/modals/AddCoApplicantModal"
import { deleteCoApplicant } from "@/services/admin/coapplicant"
import { App } from "antd"

// handles edit plot functionality
export default function EditPlot() {
  const {
    plotId,
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    onSubmit,
    hasSale,
    paymentsSum,
    saleValueNum,
    floorValueNum,
    sumExceedsSaleValue,
    watchedFloorValue,
    watchedSaleValue,
    brokers,
    customers,
    loadingBrokers,
    loadingCustomers,
    setBrokers,
    setCustomers,
    handleBrokerChange,
    handleCustomerChange,
    showAddBroker,   setShowAddBroker,
    showAddCustomer, setShowAddCustomer,
    showCreateSale,  setShowCreateSale,
    society,
    loadPlot,
    initialBrokerId,
    initialCustomerId,
    isSubmitting,
    coApplicants,
    setCoApplicants,
    totalPaidAmount,
    paymentPlanRatio,
  } = useEditPlotForm()

  const [showAddCoApplicant, setShowAddCoApplicant] = useState(false)
  const { modal, message } = App.useApp()

  const handleDeleteCoApplicant = (caId: number) => {
    modal.confirm({
      title: "Delete Co-Applicant",
      content: "Are you sure you want to delete this co-applicant?",
      okText: "Delete",
      okButtonProps: { danger: true },
      onOk: async () => {
        try {
          await deleteCoApplicant(caId)
          setCoApplicants(prev => prev.filter(ca => ca.coapplicant_id !== caId))
          message.success("Co-applicant deleted")
        } catch (e) {
          message.error("Failed to delete co-applicant")
        }
      }
    })
  }

  return (
    <>
      {/* ── Dialogs ── */}
      <AddBrokerDialog
        open={showAddBroker}
        onClose={() => setShowAddBroker(false)}
        societyId={society!}
        onCreated={broker => {
          setBrokers(prev => [...prev, broker])
          handleBrokerChange(broker)
        }}
      />

      <AddCustomerDialog
        open={showAddCustomer}
        onClose={() => setShowAddCustomer(false)}
        societyId={society!}
        onCreated={customer => {
          setCustomers(prev => [...prev, customer])
          handleCustomerChange(customer)
        }}
      />

      <AddCoApplicantModal
        open={showAddCoApplicant}
        onClose={() => setShowAddCoApplicant(false)}
        customerId={watch("customer_id")!}
        onCreated={ca => setCoApplicants(prev => [...prev, ca])}
      />

      <CreateSaleDialog
        open={showCreateSale}
        onClose={() => setShowCreateSale(false)}
        floorId={watch("floor_id")}
        floorValue={isNaN(floorValueNum) ? null : floorValueNum}
        brokerId={watch("broker_id")}
        customerId={watch("customer_id")}
        brokers={brokers}
        customers={customers}
        onCreated={async sale => {
          // set basic sale fields
          setValue("sale_id", sale.sale_id)
          setValue("sale_total_value", sale.total_value || "")
          setValue("selling_date", sale.initiated_at?.split("T")[0] || "")
          setValue("commission_amount", sale.commission_amount ?? "")

          if (sale.broker_id) handleBrokerChange(sale.broker_id)
          if (sale.customer_id) handleCustomerChange(sale.customer_id)

          await loadPlot()
        }}
      />

      {/* ── Form ── */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-8 p-4 md:p-10 bg-gray-50 min-h-screen w-full md:w-3/4 mx-auto"
      >
        {/* Header */}
        <div className="flex justify-between items-center">
          <span className="text-3xl font-bold">Edit Floor: {plotId}</span>
          <button
            type="submit"
            disabled={sumExceedsSaleValue || isSubmitting}
            className="px-6 py-2 bg-green-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[140px]"
          >
            {isSubmitting ? (
              <div style={{ transform: "scale(0.5)", margin: "-10px 0" }}>
                <ThreeDot color="currentColor" size="small" text="" textColor="" />
              </div>
            ) : (
              "Save Changes"
            )}
          </button>
        </div>

        {/* Price overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <PriceBadge
            label="Floor Base Value"
            amount={watchedFloorValue}
            variant="blue"
            sublabel="Listed price — Floor record"
          />
          <PriceBadge
            label="Sale Value"
            amount={hasSale ? watchedSaleValue : null}
            variant={hasSale ? "green" : "neutral"}
            sublabel={
              hasSale
                ? `Agreed amount${paymentPlanRatio ? ` (Plan: ${paymentPlanRatio})` : ""}`
                : "No sale created yet"
            }
          />
          <PriceBadge
            label="Total Paid Amount"
            amount={totalPaidAmount}
            variant="purple"
            sublabel="Amount collected so far"
          />
          <PriceBadge
            label="Pending Amount"
            amount={
              hasSale && watchedSaleValue && totalPaidAmount != null
                ? Number(watchedSaleValue) - totalPaidAmount
                : null
            }
            variant={(hasSale && watchedSaleValue && totalPaidAmount != null && Number(watchedSaleValue) - totalPaidAmount > 0) ? "yellow" : "neutral"}
            sublabel="Difference between agreed and paid"
          />
        </div>

        {/* Floor status */}
        <SectionCard title="FLOOR STATUS">
          <div className="flex flex-col gap-2 w-full md:w-64">
            <span className="text-xs text-gray-500 font-semibold">AVAILABILITY STATUS</span>
            <select
              {...register("floor_status")}
              className="h-11 rounded-lg border border-gray-300 px-3 text-sm font-medium"
            >
              <option value="AVAILABLE">Available</option>
              <option value="HOLD">Hold</option>
              <option value="SOLD">Sold</option>
              <option value="CANCELLED">Cancelled</option>
              <option value="INVESTOR_UNIT">Investor Unit</option>
            </select>
          </div>
        </SectionCard>

        {/* Pricing */}
        <SectionCard title="FLOOR & PRICING">
          <PricingSection register={register} hasSale={hasSale} />
        </SectionCard>

        {/* Broker */}
        <SectionCard title="BROKER INFORMATION">
          <BrokerSection
            control={control}
            watch={watch}
            brokers={brokers}
            loadingBrokers={loadingBrokers}
            onBrokerChange={handleBrokerChange}
            onAddNew={() => setShowAddBroker(true)}
            isLocked={!!initialBrokerId}
          />
        </SectionCard>

        {/* Customer */}
        <SectionCard title="CUSTOMER INFORMATION">
          <CustomerSection
            control={control}
            watch={watch}
            customers={customers}
            loadingCustomers={loadingCustomers}
            onCustomerChange={handleCustomerChange}
            onAddNew={() => setShowAddCustomer(true)}
            isLocked={!!initialCustomerId}
          />
        </SectionCard>

        {/* Co-Applicants */}
        <SectionCard title="CO-APPLICANTS">
          <CoApplicantSection
            coApplicants={coApplicants}
            customerId={watch("customer_id")}
            onAddNew={() => setShowAddCoApplicant(true)}
            onDelete={handleDeleteCoApplicant}
          />
        </SectionCard>

        {/* KYC */}
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

        {/* Floor details */}
        <SectionCard title="FLOOR DETAILS">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Field label="AREA (SQ YD)" {...register("area_sqyd")} />
            <Field label="AREA (SQ FT)" {...register("area_sqft")} />
          </div>
        </SectionCard>

        {/* Payment milestones */}
        <SectionCard title="PAYMENT MILESTONES">
          <MilestonesSection
            control={control}
            register={register}
            setValue={setValue}
            hasSale={hasSale}
            paymentsSum={paymentsSum}
            saleValueNum={saleValueNum}
            floorValueNum={floorValueNum}
            sumExceedsSaleValue={sumExceedsSaleValue}
            onCreateSale={() => setShowCreateSale(true)}
            paymentPlanRatio={paymentPlanRatio}
          />
        </SectionCard>

        {/* Floor Notes */}
        <SectionCard title="FLOOR NOTES">
          <div className="flex flex-col gap-2 w-full">
            <span className="text-xs text-gray-500 font-semibold">NOTES</span>
            <textarea
              {...register("floor_notes")}
              className="min-h-[120px] rounded-lg border border-gray-300 p-3 text-sm font-medium resize-y"
              placeholder="Add any notes related to this floor..."
            />
          </div>
        </SectionCard>
      </form>
    </>
  )
}
