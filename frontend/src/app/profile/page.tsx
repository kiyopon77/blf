"use client"
import { useEffect, useState } from "react"
import { FaUserCircle } from "react-icons/fa"
import Link from "next/link"
import { User } from "@/types/user"
import { getMe } from "@/services/profile"
import GoToHome from "@/components/GoToHome"

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getMe()
      .then(setUser)
      .finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className="flex justify-center items-center h-screen text-gray-400">
      Loading...
    </div>
  )

  if (!user) return (
    <div className="flex justify-center items-center h-screen text-gray-400">
      Failed to load profile.
    </div>
  )

  return (
    <div className="flex justify-center items-start min-h-screen bg-gray-50 pt-20">
      <div className="bg-white border border-gray-200 rounded-lg p-8 w-full max-w-sm flex flex-col items-center">
        <div className="flex flex-col items-center mb-6">
          <FaUserCircle size={64} className="text-gray-400 mb-3" />
          <h1 className="text-lg font-semibold text-gray-900">{user.full_name}</h1>
          <span className="text-xs uppercase tracking-wide text-gray-400 mt-1">{user.role}</span>
        </div>

        <div className="divide-y divide-gray-100 text-sm">
          <div className="flex justify-between py-3">
            <span className="text-gray-400">Email</span>
            <span className="text-gray-800">{user.email}</span>
          </div>
          <div className="flex justify-between py-3">
            <span className="text-gray-400">Status</span>
            <span className={user.is_active ? "text-green-600" : "text-red-500"}>
              {user.is_active ? "Active" : "Inactive"}
            </span>
          </div>
          <div className="flex justify-between py-3">
            <span className="text-gray-400">Member since</span>
            <span className="text-gray-800">
              {new Date(user.created_at).toLocaleDateString("en-IN", {
                day: "numeric", month: "short", year: "numeric"
              })}
            </span>
          </div>
          <div className="flex justify-between py-3 mb-5">
            <span className="text-gray-400">User ID</span>
            <span className="text-gray-800">#{user.user_id}</span>
          </div>
        </div>

        <GoToHome />
      </div>
    </div>
  )
}
