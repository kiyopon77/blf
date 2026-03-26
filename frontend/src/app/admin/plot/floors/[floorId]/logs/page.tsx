"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { getFloorLogs } from "@/services/admin/floor"
import { FloorLog } from "@/types/floor"

const getStatusStyle = (status?: string | null) => {
  switch (status) {
    case "AVAILABLE":
      return "bg-green-100 text-green-700 border-green-200"
    case "SOLD":
      return "bg-red-100 text-red-700 border-red-200"
    case "HOLD":
      return "bg-amber-100 text-amber-700 border-amber-200"
    case "INVESTOR_UNIT":
      return "bg-gray-200 text-gray-700 border-gray-300"
    case "CANCELLED":
      return "bg-gray-300 text-gray-800 border-gray-400"
    default:
      return "bg-gray-100 text-gray-600 border-gray-200"
  }
}

const FloorLogsPage = () => {
  const params = useParams()
  const floorId = Number(params.floorId)

  const [logs, setLogs] = useState<FloorLog[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const data = await getFloorLogs(floorId)

        // latest first
        setLogs(data.reverse())
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    if (floorId) fetchLogs()
  }, [floorId])

  return (
    <div className="max-w-[800px] mx-auto px-6 py-10">

      {/* HEADER */}
      <div className="mb-10">
        <h1 className="text-2xl font-bold text-gray-900">
          Floor Activity
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Timeline of all status changes
        </p>
      </div>

      {loading ? (
        <div className="text-center py-10 text-gray-500">
          Loading logs...
        </div>
      ) : logs.length === 0 ? (
        <div className="text-center py-10 text-gray-400">
          No activity found
        </div>
      ) : (
        <div className="relative border-l border-gray-200 pl-6 space-y-8">

          {logs.map((log) => (
            <div key={log.log_id} className="relative">

              {/* Dot */}
              <div className="absolute -left-[10px] top-1 w-4 h-4 bg-white border-2 border-[#D4A22A] rounded-full" />

              {/* Content */}
              <div className="bg-white border border-[#E5E5E5] rounded-lg p-4 shadow-sm">

                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-gray-800">
                    {log.changed_by_name || `User ${log.changed_by}`}
                  </p>

                  <span className="text-xs text-gray-500">
                    {new Date(log.changed_at).toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center gap-3 text-sm">

                  {/* Old Status */}
                  <span
                    className={`px-2 py-1 rounded border text-xs font-medium ${getStatusStyle(
                      log.old_status
                    )}`}
                  >
                    {log.old_status || "—"}
                  </span>

                  <span className="text-gray-400">→</span>

                  {/* New Status */}
                  <span
                    className={`px-2 py-1 rounded border text-xs font-medium ${getStatusStyle(
                      log.new_status
                    )}`}
                  >
                    {log.new_status || "—"}
                  </span>

                </div>

              </div>
            </div>
          ))}

        </div>
      )}
    </div>
  )
}

export default FloorLogsPage
