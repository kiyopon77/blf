"use client"

import { Controller } from "react-hook-form"

import SectionCard from "./ui/SectionCard"
import Field from "./ui/Field"
import StatusRadio from "./ui/StatusRadio"

import { useEditPlotForm } from "./components/useEditPlotForm"
import { PriceBadge } from "./components/ui"
import { PricingSection } from "./components/PricingSection"
import { BrokerSection } from "./components/BrokerSection"
import { CustomerSection } from "./components/CustomerSection"
import { MilestonesSection } from "./components/MilestoneSection"
import { AddBrokerDialog } from "./components/AddBrokerDialog"
import { AddCustomerDialog } from "./components/AddCustomerDialog"
import { CreateSaleDialog } from "./components/CreateSaleDialog"

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
  } = useEditPlotForm()

  return (
    <>
      {/* ── Dialogs ── */}
      <AddBrokerDialog
        open={showAddBroker}
        onClose={() => setShowAddBroker(false)}
        societyId={society}
        onCreated={broker => {
          setBrokers(prev => [...prev, broker])
          handleBrokerChange(broker)
        }}
      />

      <AddCustomerDialog
        open={showAddCustomer}
        onClose={() => setShowAddCustomer(false)}
        societyId={society}
        onCreated={customer => {
          setCustomers(prev => [...prev, customer])
          handleCustomerChange(customer)
        }}
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
          setValue("commission_percent", sale.commission_percent ?? "")

          if (sale.broker_id) handleBrokerChange(sale.broker_id)
          if (sale.customer_id) handleCustomerChange(sale.customer_id)

          await loadPlot()
        }}
      />

      {/* ── Form ── */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-8 p-10 bg-gray-50 min-h-screen w-3/4 mx-auto"
      >
        {/* Header */}
        <div className="flex justify-between items-center">
          <span className="text-3xl font-bold">Edit Floor: {plotId}</span>
          <button
            type="submit"
            disabled={sumExceedsSaleValue}
            className="px-6 py-2 bg-green-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Save Changes
          </button>
        </div>

        {/* Price overview */}
        <div className="grid grid-cols-3 gap-4">
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
            sublabel={hasSale ? "Agreed amount — Sale record" : "No sale created yet"}
          />
          <PriceBadge
            label="Milestones Collected"
            amount={paymentsSum > 0 ? paymentsSum : null}
            variant={sumExceedsSaleValue ? "red" : "neutral"}
            sublabel={
              sumExceedsSaleValue
                ? `Over by ₹ ${(paymentsSum - saleValueNum).toLocaleString("en-IN")}`
                : "Sum of all milestone amounts"
            }
          />
        </div>

        {/* Floor status */}
        <SectionCard title="FLOOR STATUS">
          <div className="flex flex-col gap-2 w-64">
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
          <div className="grid grid-cols-2 gap-6">
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
          />
        </SectionCard>
      </form>
    </>
  )
}
