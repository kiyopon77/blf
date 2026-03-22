"use client"

import { useEffect, useState } from "react"
import { getSales } from "@/services/admin/sales"
import { Sale } from "@/types/sales"
import SalesHeader from "./components/SalesHeader"
import SalesTable from "./components/SalesTable"
import SaleEditModal from "./components/modals/SaleEditModal"

export default function SalesPage() {
  const [sales, setSales] = useState<Sale[]>([])
  const [loading, setLoading] = useState(true)

  const [editingSale, setEditingSale] = useState<Sale | null>(null)

  const fetchSales = async () => {
    try {
      const data = await getSales()

      const sorted = data.sort(
        (a, b) => Number(a.sale_id) - Number(b.sale_id)
      )

      setSales(sorted)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSales()
  }, [])

  const handleEdit = (sale: Sale) => {
    setEditingSale(sale)
  }

  if (loading) return <div className="p-6">Loading...</div>

  return (
    <div className="p-6 ">
      <SalesHeader onRefresh={fetchSales} />

      <SalesTable
        sales={sales}
        setSales={setSales}
        onEdit={handleEdit}   // ✅ PASS IT HERE
      />

      {editingSale && (
        <SaleEditModal
          sale={editingSale}
          open={!!editingSale}
          setOpen={() => setEditingSale(null)}
          onSuccess={fetchSales}
        />
      )}
    </div>
  )
}
