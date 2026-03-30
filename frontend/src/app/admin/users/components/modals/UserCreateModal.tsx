"use client"
import { useState, useEffect } from "react"
import { createUser } from "@/services/admin/user"
import { getSocieties } from "@/services/admin/society"

const UserCreateModal = ({ open, setOpen, setUsers }: any) => {
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    password: "",
    role: "rm" as "admin" | "rm",
    society_id: ""
  })

  const [societies, setSocieties] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  // Fetch societies when modal opens
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
        ...form,
        society_id: form.society_id ? Number(form.society_id) : null
      }

      const newUser = await createUser(payload)
      setUsers((prev: any) => [...prev, newUser])

      setOpen(false)

      // Reset form
      setForm({
        full_name: "",
        email: "",
        password: "",
        role: "rm",
        society_id: ""
      })
    } catch (err) {
      setError("Failed to create user. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Create User</h2>
          <button
            onClick={() => setOpen(false)}
            className="text-gray-400 hover:cursor-pointer hover:text-gray-600 text-xl"
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
              required
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
              required
              className="border border-gray-300 rounded-md p-2 text-sm"
            />
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-600">Password</label>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              required
              className="border border-gray-300 rounded-md p-2 text-sm"
            />
          </div>

          {/* Role */}
          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-600">Role</label>
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="border border-gray-300 rounded-md p-2 text-sm"
            >
              <option value="rm">RM</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {/* Society Dropdown */}
          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-600">Society</label>
            <select
              name="society_id"
              value={form.society_id}
              onChange={handleChange}
              required
              className="border border-gray-300 rounded-md p-2 text-sm"
            >
              <option value="">Select Society</option>
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
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="hover:cursor-pointer px-4 py-2 text-sm border border-gray-300 rounded-md text-gray-600 hover:bg-gray-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm hover:cursor-pointer bg-yellow-500 text-white rounded-md hover:bg-yellow-600 disabled:opacity-50"
            >
              {loading ? "Creating..." : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default UserCreateModal
