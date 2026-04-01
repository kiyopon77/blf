// app/admin/users/page.tsx
"use client"
import { useEffect, useState } from "react"
import { getUsers } from "@/services/admin/user"
import UserHeader from "./components/UserHeader"
import UserTable from "./components/UserTable"
import UserCreateModal from "./components/modals/UserCreateModal"
import UserEditModal from "./components/modals/UserEditModal"
import type { User } from "@/types/user"

// handles users page functionality
const UsersPage = () => {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [createOpen, setCreateOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)

  const handleEdit = (user: User) => {
    setSelectedUser(user)
    setEditOpen(true)
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getUsers()
        setUsers(data)
      } catch (err) {
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  return (
    <div className="p-6 w-full h-full">
      <UserHeader onCreate={() => setCreateOpen(true)} />
      {loading ? (
        <div className="flex justify-center items-center h-64">
          Loading...
        </div>
      ) : (
        <UserTable users={users} onEdit={handleEdit} />
      )}
      <UserCreateModal
        open={createOpen}
        setOpen={setCreateOpen}
        setUsers={setUsers}
      />
      <UserEditModal
        user={selectedUser}
        open={editOpen}
        setOpen={setEditOpen}
        onSuccess={async () => {
          const data = await getUsers()
          setUsers(data)
        }}
      />
    </div>
  )
}

export default UsersPage
