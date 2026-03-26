"use client"

import { useEffect, useState } from "react"
import { getBrokers } from "@/services/admin/broker"
import BrokerHeader from "./components/BrokerHeader"
import BrokerTable from "./components/BrokerTable"
import BrokerCreateModal from "./components/modals/BrokerCreateModal"
import BrokerEditModal from "./components/modals/BrokerEditModal"
import { sortByBrokerId } from "@/app/utils/sort"

const BrokersPage = () => {
  const [brokers, setBrokers] = useState<any>([])
  const [loading, setLoading] = useState(true)
  const [createOpen, setCreateOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [selectedBroker, setSelectedBroker] = useState<any>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getBrokers()
        setBrokers(sortByBrokerId(data))
        console.log(sortByBrokerId(data))
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return (
    <div className="p-6 w-full h-full">
      <BrokerHeader onCreate={() => setCreateOpen(true)} />

      {loading ? (
        <div className="flex justify-center items-center h-64">
          Loading...
        </div>
      ) : (
        <BrokerTable
          brokers={brokers}
          setBrokers={setBrokers}
          onEdit={(b: any) => {
            setSelectedBroker(b)
            setEditOpen(true)
          }}
        />
      )}

      <BrokerCreateModal
        open={createOpen}
        setOpen={setCreateOpen}
        setBrokers={setBrokers}
      />

      <BrokerEditModal
        open={editOpen}
        setOpen={setEditOpen}
        broker={selectedBroker}
        setBrokers={setBrokers}
      />
    </div>
  )
}

export default BrokersPage
