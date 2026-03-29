import { UseFormRegister } from "react-hook-form"
import type { EditPlotFormValues } from "../types"

interface Props {
  register: UseFormRegister<EditPlotFormValues>
  hasSale: boolean
}

export function PricingSection({ register, hasSale }: Props) {
  return (
    <div className="flex flex-col gap-6">

      {/* ── Floor base value ─────────────────────────────────────────────────
          Stored on FloorResponse.floor_value / FloorUpdate.floor_value
          Independent of any sale record.
      ──────────────────────────────────────────────────────────────────────── */}
      <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
        <div className="flex items-center gap-2 mb-3">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
          <span className="text-xs font-bold text-blue-700 uppercase tracking-wide">
            Floor Base Value
          </span>
          <span className="text-xs text-blue-400 ml-1">Floor model</span>
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div className="flex flex-col gap-1">
            <span className="text-xs text-gray-500 font-semibold">FLOOR VALUE</span>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">₹</span>
              <input
                {...register("floor_value")}
                type="number"
                className="h-11 w-full rounded-lg border border-blue-300 bg-white pl-7 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Base floor price"
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── Sale value ───────────────────────────────────────────────────────
          Stored on SaleResponse.total_value / SaleUpdate.total_value
          Only editable once a sale record exists.
      ──────────────────────────────────────────────────────────────────────── */}
      <div
        className={`rounded-xl border p-4 transition-opacity ${
          hasSale
            ? "border-green-200 bg-green-50"
            : "border-gray-200 bg-gray-50 opacity-60"
        }`}
      >
        <div className="flex items-center gap-2 mb-3">
          <span className={`w-2.5 h-2.5 rounded-full ${hasSale ? "bg-green-500" : "bg-gray-400"}`} />
          <span
            className={`text-xs font-bold uppercase tracking-wide ${
              hasSale ? "text-green-700" : "text-gray-500"
            }`}
          >
            Sale Value
          </span>
          <span className={`text-xs ml-1 ${hasSale ? "text-green-400" : "text-gray-400"}`}>
            Sale model
          </span>
          {!hasSale && (
            <span className="ml-auto text-xs text-gray-400 italic">Create a sale to edit</span>
          )}
        </div>
        <div className="grid grid-cols-3 gap-6">
          <div className="flex flex-col gap-1">
            <span className="text-xs text-gray-500 font-semibold">SALE TOTAL VALUE</span>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">₹</span>
              <input
                {...register("sale_total_value")}
                type="number"
                disabled={!hasSale}
                className="h-11 w-full rounded-lg border border-green-300 bg-white pl-7 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                placeholder="Agreed sale price"
              />
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs text-gray-500 font-semibold">COMMISSION %</span>
            <div className="relative">
              <input
                {...register("commission_percent")}
                type="number"
                step="0.01"
                disabled={!hasSale}
                className="h-11 w-full rounded-lg border border-green-300 bg-white pl-3 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                placeholder="0.0"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">%</span>
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs text-gray-500 font-semibold">SELLING DATE</span>
            <input
              {...register("selling_date")}
              type="date"
              disabled={!hasSale}
              className="h-11 rounded-lg border border-green-300 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
