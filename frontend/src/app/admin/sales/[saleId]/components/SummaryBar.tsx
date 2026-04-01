// app/admin/sales/[saleId]/components/SummaryBar.tsx
import { SaleDetail } from "@/types/sales"
 // handles summary bar functionality
export default function SummaryBar({ sale }: { sale: SaleDetail }) {
  const commission =
    sale.commission_percent != null
      ? (sale.total_value * sale.commission_percent) / 100
      : null

  return (
    <div className="bg-white px-9 py-6 rounded-xl border border-gray-400">
      <div className="flex flex-col gap-6">
        <span className="text-gray-700 font-extrabold">Sale Overview</span>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="flex flex-col col-span-2">
            <span className="text-gray-500 text-sm">Total Value</span>
            <span className="font-extrabold text-4xl">
              ₹ {sale.total_value.toLocaleString("en-IN")}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-gray-500 text-sm">Sale Date</span>
            <span className="font-bold text-lg">
              {new Date(sale.initiated_at).toLocaleDateString("en-IN")}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-gray-500 text-sm">Property</span>
            <span className="font-bold text-lg">
              {sale.plot_code} · Floor {sale.floor_no}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-gray-500 text-sm">Broker</span>
            <span className="font-bold text-lg">{sale.broker_name}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-gray-500 text-sm">Customer</span>
            <span className="font-bold text-lg">{sale.customer_name}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-gray-500 text-sm">KYC</span>
            <span className={`font-bold text-lg ${sale.customer_kyc_status === "DONE" ? "text-green-600" : "text-red-500"}`}>
              {sale.customer_kyc_status}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-gray-500 text-sm">Commission</span>
            <span className="font-bold text-lg">
              {commission != null
                ? `₹ ${commission.toLocaleString("en-IN")} (${sale.commission_percent}%)`
                : "—"}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
