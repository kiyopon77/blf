// app/admin/sales/page.tsx
"use client"

import { useEffect, useState } from "react"
import { getSales } from "@/services/admin/sales"
import { Sale } from "@/types/sales"
import SalesHeader from "./components/SalesHeader"
import SalesTable from "./components/SalesTable"
import SaleEditModal from "./components/modals/SaleEditModal"
import SaleCreateModal from "./components/modals/SaleCreateModal"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"

// handles sales page functionality
export default function SalesPage() {
  const [sales, setSales] = useState<Sale[]>([])
  const [loading, setLoading] = useState(true)

  const [editingSale, setEditingSale] = useState<Sale | null>(null)
  const [openCreate, setOpenCreate] = useState(false)

  const router = useRouter()
  const {society} = useAuth()

  const fetchSales = async () => {
    try {
      const data = await getSales(society)

      const sorted = data.sort(
        (a, b) => Number(a.sale_id) - Number(b.sale_id)
      )

      setSales(sorted)
    } catch (err) {
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

  const handleView = (sale: Sale) => {
    router.push(`/admin/sales/${sale.sale_id}`)
  }

  if (loading) return <div className="p-6">Loading...</div>

  return (
    <div className="p-6">

      {/* ✅ FIXED: pass onCreate */}
      <SalesHeader onCreate={() => setOpenCreate(true)} />

      <SalesTable
        sales={sales}
        setSales={setSales}
        onEdit={handleEdit}
        onView={handleView}
      />

      {/* EDIT MODAL */}
      {editingSale && (
        <SaleEditModal
          sale={editingSale}
          open={!!editingSale}
          setOpen={() => setEditingSale(null)}
          onSuccess={fetchSales}
        />
      )}

      {openCreate && (
        <SaleCreateModal
          onClose={() => setOpenCreate(false)}
          onSuccess={fetchSales}
        />
      )}

    </div>
  )
}
