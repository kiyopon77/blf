"use client"

import { useAuth } from "@/context/AuthContext"
import { useRouter } from "next/navigation"
import { useState, useMemo } from "react"
import { Edit3, Trash2, Plus } from "lucide-react"

import SocietyCreateModal from "./components/modals/SocietyCreateModal"
import SocietyEditModal from "./components/modals/SocietyEditModal"
import SocietyDeleteModal from "./components/modals/SocietyDeleteModal"

const SelectSocietyPage = () => {
  const { societies, setSociety, setSocieties, role } = useAuth()
  const router = useRouter()

  const [selected, setSelected] = useState<number | null>(null)

  // Dialog visibility state
  const [showCreate, setShowCreate] = useState(false)
  const [showEdit, setShowEdit] = useState(false)
  const [showDelete, setShowDelete] = useState(false)

  // Memoize currently selected full object matching active IDs
  const selectedSociety = useMemo(() => {
    return societies.find((s) => s.society_id === selected) || null
  }, [selected, societies])

  const handleNext = () => {
    if (!selected) return
    setSociety(selected)
    router.push("/dashboard")
  }

  // Only allow admins to manage societies natively in context
  const canManage = role === "admin"

  return (
    <>
      <SocietyCreateModal
        open={showCreate}
        setOpen={setShowCreate}
        setSocieties={setSocieties}
      />
      <SocietyEditModal
        open={showEdit}
        setOpen={setShowEdit}
        society={selectedSociety}
        setSocieties={setSocieties}
      />
      <SocietyDeleteModal
        open={showDelete}
        setOpen={setShowDelete}
        society={selectedSociety}
        setSocieties={setSocieties}
        onDeleted={() => setSelected(null)}
      />

      <div className="h-screen w-full flex items-center justify-center bg-gray-50">
        <div className="bg-white shadow-xl rounded-2xl p-8 w-[400px]">
          
          <div className="flex justify-between items-start mb-6 w-full">
             <div className="flex flex-col flex-1 items-center">
                <h1 className="text-2xl font-semibold text-gray-800 mb-2 mt-4 text-center">
                  Select Society
                </h1>
                <p className="text-sm text-gray-500 text-center">
                  Choose a society to continue
                </p>
             </div>
          </div>

          <div className="mb-6">
            <select
              value={selected || ""}
              onChange={(e) => setSelected(Number(e.target.value))}
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-yellow-500 bg-white"
            >
              <option value="">-- Select Society --</option>
              {societies.map((s: any) => (
                <option key={s.society_id} value={s.society_id}>
                  {s.society_name || `Society ${s.society_id}`}
                </option>
              ))}
            </select>
          </div>

          {/* Button */}
          <button
            onClick={handleNext}
            disabled={!selected}
            className={`w-full py-3 mb-2 rounded-lg font-medium transition ${
              selected
                ? "bg-yellow-500 hover:bg-yellow-600 text-white"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            Next
          </button>

          {canManage && (
            <div className="flex justify-center mt-6 pt-4 border-t border-gray-100">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreate(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-700 text-sm font-medium rounded shadow-sm hover:bg-green-100 transition"
                  title="Add Society"
                >
                  <Plus size={16} /> Add 
                </button>
                <button
                  type="button"
                  disabled={!selected}
                  onClick={() => setShowEdit(true)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded shadow-sm transition ${
                    selected
                      ? "bg-blue-50 text-blue-700 hover:bg-blue-100"
                      : "bg-gray-50 text-gray-400 cursor-not-allowed border border-gray-200"
                  }`}
                  title="Edit Society"
                >
                  <Edit3 size={16} /> Edit
                </button>
                <button
                  type="button"
                  disabled={!selected}
                  onClick={() => setShowDelete(true)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded shadow-sm transition ${
                    selected
                      ? "bg-red-50 text-red-700 hover:bg-red-100"
                      : "bg-gray-50 text-gray-400 cursor-not-allowed border border-gray-200"
                  }`}
                  title="Delete Society"
                >
                  <Trash2 size={16} /> Delete
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default SelectSocietyPage
