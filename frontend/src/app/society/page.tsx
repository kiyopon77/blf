"use client"

import { useAuth } from "@/context/AuthContext"
import { useRouter } from "next/navigation"
import { useState } from "react"

const SelectSocietyPage = () => {
  const { societies, setSociety } = useAuth()
  const router = useRouter()

  const [selected, setSelected] = useState<number | null>(null)

  const handleNext = () => {
    if (!selected) return
    setSociety(selected)
    router.push("/dashboard")
  }

  return (
    <div className="h-screen w-full flex items-center justify-center bg-gray-50">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-[400px]">
        
        {/* Heading */}
        <h1 className="text-2xl font-semibold text-gray-800 mb-2 text-center">
          Select Society
        </h1>
        <p className="text-sm text-gray-500 mb-6 text-center">
          Choose a society to continue
        </p>

        {/* Dropdown */}
        <select
          value={selected || ""}
          onChange={(e) => setSelected(Number(e.target.value))}
          className="w-full border border-gray-300 rounded-lg p-3 mb-6 focus:outline-none focus:ring-2 focus:ring-yellow-500"
        >
          <option value="">-- Select Society --</option>
          {societies.map((s: any) => (
            <option key={s.society_id} value={s.society_id}>
              {s.society_name || `Society ${s.society_id}`}
            </option>
          ))}
        </select>

        {/* Button */}
        <button
          onClick={handleNext}
          disabled={!selected}
          className={`w-full py-3 rounded-lg font-medium transition ${
            selected
              ? "bg-yellow-500 hover:bg-yellow-600 text-white"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`}
        >
          Next
        </button>
      </div>
    </div>
  )
}

export default SelectSocietyPage
