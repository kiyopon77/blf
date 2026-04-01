// app/admin/sales/[saleId]/components/SaleHeader.tsx
import { SaleDetail } from "@/types/sales"

const STATUS_STYLES: Record<string, string> = {
  HOLD: "bg-yellow-500",
  SOLD: "bg-green-600",
  CANCELLED: "bg-gray-500",
  INVESTOR_UNIT: "bg-blue-500",
}

// handles sale header functionality
export default function SaleHeader({ sale }: { sale: SaleDetail }) {
  const statusColor = STATUS_STYLES[sale.status] ?? "bg-gray-500"

  return (
    <div className="flex justify-between items-start mt-5">
      <div>
        <h1 className="text-3xl font-extrabold">
          Sale #{sale.sale_id}
        </h1>
        <p className="text-gray-500">
          {sale.plot_code} · Floor {sale.floor_no}
        </p>
      </div>

      <span className={`py-2 px-5 rounded-3xl text-white ${statusColor}`}>
        {sale.status.replace("_", " ")}
      </span>
    </div>
  )
}
