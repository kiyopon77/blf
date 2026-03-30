"use client"

import { useState, useEffect } from "react"
import { updateUser } from "@/services/admin/user"
import { getSocieties } from "@/services/admin/society"
import AdminButton from "@/components/ui/AdminButton"
import DeleteButton from "@/components/ui/DeleteButton"
import { Check, X } from "lucide-react"

const UserEditModal = ({ user, open, setOpen, onSuccess }: any) => {
  const [loading, setLoading] = useState(false)
  const [societies, setSocieties] = useState<any[]>([])
  const [error, setError] = useState("")

  const [form, setForm] = useState({
    full_name: "",
    email: "",
    is_active: true,
    society_id: ""
  })

  // Prefill form
  useEffect(() => {
    if (user && open) {
      setForm({
        full_name: user.full_name || "",
        email: user.email || "",
        is_active: user.is_active ?? true,
        society_id: user.society_id ? String(user.society_id) : ""
      })
    }
  }, [user, open])

  // Fetch societies
  useEffect(() => {
    const fetchSocieties = async () => {
      try {
        const data = await getSocieties()
        setSocieties(data)
      } catch (err) {
        console.error("Failed to fetch societies")
      }
    }

    if (open) fetchSocieties()
  }, [open])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const payload = {
        full_name: form.full_name,
        email: form.email,
        is_active: form.is_active,
        society_id: form.society_id ? Number(form.society_id) : null
      }

      await updateUser(user.user_id, payload)

      onSuccess()
      setOpen(false)
    } catch (err) {
      setError("Failed to update user.")
    } finally {
      setLoading(false)
    }
  }

  if (!open || !user) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">
            Edit User - #{user.user_id}
          </h2>
          <button
            onClick={() => setOpen(false)}
            className="text-gray-400 hover:text-gray-600 text-xl"
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          
          {/* Full Name */}
          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-600">Full Name</label>
            <input
              name="full_name"
              value={form.full_name}
              onChange={handleChange}
              className="border border-gray-300 rounded-md p-2 text-sm"
            />
          </div>

          {/* Email */}
          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-600">Email</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              className="border border-gray-300 rounded-md p-2 text-sm"
            />
          </div>

          {/* Status */}
          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-600">Status</label>
            <select
              name="is_active"
              value={form.is_active ? "ACTIVE" : "INACTIVE"}
              onChange={(e) =>
                setForm({
                  ...form,
                  is_active: e.target.value === "ACTIVE",
                })
              }
              className="border border-gray-300 rounded-md p-2 text-sm"
            >
              <option value="ACTIVE">ACTIVE</option>
              <option value="INACTIVE">INACTIVE</option>
            </select>
          </div>

          {/* Society */}
          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-600">Society</label>
            <select
              name="society_id"
              value={form.society_id}
              onChange={handleChange}
              className="border border-gray-300 rounded-md p-2 text-sm"
            >
              <option value="">No Society</option>
              {societies.map((society) => (
                <option
                  key={society.society_id}
                  value={society.society_id}
                >
                  {society.society_name || `Society ${society.society_id}`}
                </option>
              ))}
            </select>
          </div>

          {/* Error */}
          {error && <p className="text-red-500 text-sm">{error}</p>}

          {/* Actions */}
          <div className="flex justify-end gap-2 mt-2">
            <DeleteButton onClick={() => setOpen(false)} icon={<X size={16} />}>
              Cancel
            </DeleteButton>

            <AdminButton type="submit" disabled={loading} icon={<Check size={16} />}>
              {loading ? "Updating..." : "Update"}
            </AdminButton>
          </div>
        </form>
      </div>
    </div>
  )
}

export default UserEditModal
