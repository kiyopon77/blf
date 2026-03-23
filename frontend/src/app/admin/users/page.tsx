"use client"
import { useEffect, useState } from "react"
import { getUsers } from "@/services/admin/user"
import UserHeader from "./components/UserHeader"
import UserTable from "./components/UserTable"
import UserCreateModal from "./components/modals/UserCreateModal"

const UsersPage = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [createOpen, setCreateOpen] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getUsers()
        setUsers(data)
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
      <UserHeader onCreate={() => setCreateOpen(true)} />
      {loading ? (
        <div className="flex justify-center items-center h-64">
          Loading...
        </div>
      ) : (
        <UserTable users={users} />
      )}
      <UserCreateModal
        open={createOpen}
        setOpen={setCreateOpen}
        setUsers={setUsers}
      />
    </div>
  )
}

export default UsersPage
