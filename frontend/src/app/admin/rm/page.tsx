// app/admin/rm/page.tsx
"use client"

import { useEffect, useState } from "react"
import { getRMs } from "@/services/rm"
import { RM } from "@/types/rm"
import RMHeader from "./components/RMHeader"
import RMTable from "./components/RMTable"
import RMCreateModal from "./components/RMCreateModal"
import RMEditModal from "./components/RMEditModal"

// handles r m page functionality
const RMPage = () => {
  const [rms, setRms] = useState<RM[]>([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [selectedRM, setSelectedRM] = useState<any>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getRMs()
        setRms(data)
      } catch (err) {
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return (
    <div className="p-6 w-full h-full">
      <RMHeader onCreate={() => setOpen(true)} />

      <RMCreateModal open={open} setOpen={setOpen} setRms={setRms} />

      {loading ? (
        <div className="flex justify-center items-center h-64">
          Loading...
        </div>
      ) : (
        <RMTable
          rms={rms}
          setRms={setRms}
          onEdit={(rm: any) => {
            setSelectedRM(rm)
            setEditOpen(true)
          }}
        />
      )}
      <RMEditModal
        open={editOpen}
        setOpen={setEditOpen}
        rm={selectedRM}
        setRms={setRms}
      />
    </div>
  )
}

export default RMPage
