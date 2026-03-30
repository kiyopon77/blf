import {
  Control,
  UseFormRegister,
  UseFormSetValue,
} from "react-hook-form"
import MilestoneSection from "../ui/MilestoneStatus"
import type { EditPlotFormValues } from "../types"

interface Props {
  control: Control<EditPlotFormValues>
  register: UseFormRegister<EditPlotFormValues>
  setValue: UseFormSetValue<EditPlotFormValues>
  hasSale: boolean
  paymentsSum: number
  saleValueNum: number
  floorValueNum: number
  sumExceedsSaleValue: boolean
  onCreateSale: () => void
}

export function MilestonesSection({
  control,
  register,
  setValue,
  hasSale,
  paymentsSum,
  saleValueNum,
  floorValueNum,
  sumExceedsSaleValue,
  onCreateSale,
}: Props) {
  if (!hasSale) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-4 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50">
        <span className="text-4xl">🔒</span>
        <div className="text-center">
          <p className="text-sm font-semibold text-gray-600">Payment milestones are locked</p>
          <p className="text-xs text-gray-400 mt-1 max-w-xs">
            A sale record must exist for this floor before milestone payments can be tracked.
          </p>
        </div>
        <button
          type="button"
          onClick={onCreateSale}
          className="px-5 py-2.5 bg-green-700 text-white text-sm font-semibold rounded-lg hover:bg-green-800 transition-colors"
        >
          + Create Sale to Unlock
        </button>
      </div>
    )
  }

  return (
    <>
      {/* Summary bar */}
      <div
        className={`flex flex-wrap items-center justify-between gap-3 mb-4 px-4 py-3 rounded-lg border ${
          sumExceedsSaleValue ? "bg-red-50 border-red-300" : "bg-gray-50 border-gray-200"
        }`}
      >
        <span className="text-sm text-gray-600">
          Milestones total:{" "}
          <span className={`font-bold ${sumExceedsSaleValue ? "text-red-600" : "text-gray-800"}`}>
            ₹ {paymentsSum.toLocaleString("en-IN")}
          </span>
        </span>

        <span className="text-sm text-gray-500 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-green-500" />
          Sale value:{" "}
          <span className="font-bold text-gray-800">
            ₹ {isNaN(saleValueNum) ? "—" : saleValueNum.toLocaleString("en-IN")}
          </span>
        </span>

        <span className="text-sm text-gray-500 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-blue-400" />
          Floor value:{" "}
          <span className="font-bold text-gray-800">
            ₹ {isNaN(floorValueNum) ? "—" : floorValueNum.toLocaleString("en-IN")}
          </span>
        </span>

        {sumExceedsSaleValue && (
          <span className="text-xs text-red-600 font-semibold">
            ⚠ Exceeds sale value by ₹{" "}
            {(paymentsSum - saleValueNum).toLocaleString("en-IN")}
          </span>
        )}
      </div>

      <MilestoneSection
        control={control}
        register={register}
        setValue={setValue}
        floorValue={isNaN(saleValueNum) ? null : saleValueNum}
      />
    </>
  )
}
