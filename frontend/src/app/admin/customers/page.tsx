// app/admin/customers/page.tsx
"use client"

import { useEffect, useState } from "react"
import { getCustomers } from "@/services/admin/customer"
import CustomerHeader from "./components/CustomerHeader"
import CustomerTable from "./components/CustomerTable"
import CustomerCreateModal from "./components/modals/CustomerCreateModal"
import CustomerEditModal from "./components/modals/CustomerEditModal"
import { sortByCustomerId } from "@/app/utils/sort"
import { useAuth } from "@/context/AuthContext"
import type { Customer } from "@/types/customer"

// handles customers page functionality
const CustomersPage = () => {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [createOpen, setCreateOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null)
  const {society} = useAuth()
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getCustomers(society)
        setCustomers(sortByCustomerId(data))
      } catch (err) {
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return (
    <div className="p-6 w-full h-full">

      <CustomerHeader onCreate={() => setCreateOpen(true)} />


      {loading ? (
        <div className="flex justify-center items-center h-64">
          Loading...
        </div>
      ) : (
        <CustomerTable
          customers={customers}
          setCustomers={setCustomers}
          onEdit={(c: any) => {
            setSelectedCustomer(c)
            setEditOpen(true)
          }}
        />
      )}

      <CustomerCreateModal
        open={createOpen}
        setOpen={setCreateOpen}
        setCustomers={setCustomers}
      />

      <CustomerEditModal
        open={editOpen}
        setOpen={setEditOpen}
        customer={selectedCustomer}
        setCustomers={setCustomers}
      />
    </div>
  )
}

export default CustomersPage
