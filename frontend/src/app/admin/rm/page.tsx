// app/admin/rm/page.tsx
"use client"

import { useEffect, useState } from "react"
import { getRMs } from "@/services/rm"
import { RM } from "@/types/rm"
import RMHeader from "./components/RMHeader"
import RMTable from "./components/RMTable"

const RMPage = () => {
  const [rms, setRms] = useState<RM[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getRMs()
        setRms(data)
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
      <RMHeader />

      {loading ? (
        <div className="flex justify-center items-center h-64">
          Loading...
        </div>
      ) : (
        <RMTable rms={rms} setRms={setRms} />
      )}
    </div>
  )
}

export default RMPage
