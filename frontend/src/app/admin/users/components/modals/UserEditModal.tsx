"use client"

import { useState, useEffect } from "react"
import { updateUser } from "@/services/admin/user"

const UserEditModal = ({ user, open, setOpen, onSuccess }: any) => {
  const [loading, setLoading] = useState(false)

  const [form, setForm] = useState({
    full_name: "",
    email: "",
    is_active: true,
  })

  useEffect(() => {
    if (user && open) {
      setForm({
        full_name: user.full_name || "",
        email: user.email || "",
        is_active: user.is_active ?? true,
      })
    }
  }, [user, open])

  if (!open || !user) return null

  const handleSubmit = async () => {
    try {
      setLoading(true)

      await updateUser(user.user_id, {
        full_name: form.full_name,
        email: form.email,
        is_active: form.is_active,
      })

      onSuccess()
      setOpen(false)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-[400px] p-6 shadow-xl">
        <h2 className="text-xl font-semibold mb-4">
          Edit User - #{user.user_id}
        </h2>

        <div className="flex flex-col gap-3">
          <input
            type="text"
            value={form.full_name}
            onChange={(e) =>
              setForm({ ...form, full_name: e.target.value })
            }
            className="border p-2 rounded-md"
          />

          <input
            type="email"
            value={form.email}
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
            className="border p-2 rounded-md"
          />

          <select
            value={form.is_active ? "ACTIVE" : "INACTIVE"}
            onChange={(e) =>
              setForm({
                ...form,
                is_active: e.target.value === "ACTIVE",
              })
            }
            className="border p-2 rounded-md"
          >
            <option value="ACTIVE">ACTIVE</option>
            <option value="INACTIVE">INACTIVE</option>
          </select>
        </div>

        <div className="flex justify-end gap-3 mt-5">
          <button
            onClick={() => setOpen(false)}
            className="px-4 py-2 border rounded-md"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-4 py-2 bg-yellow-500 text-white rounded-md"
          >
            {loading ? "Updating..." : "Update"}
          </button>
        </div>
      </div>
    </div>
  )
}

export default UserEditModal
