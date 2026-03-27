"use client"
import { useAuth } from "@/context/AuthContext"

const SocietyPage = () => {
  const { society, societies, setSociety } = useAuth()

  return (
    <select
      value={society || ""}
      onChange={(e) => setSociety(Number(e.target.value))}
      className="border p-2 rounded-md"
    >
      <option value="">Select Society</option>
      {societies.map((s: any) => (
        <option key={s.society_id} value={s.society_id}>
          {s.society_name || `Society ${s.society_id}`}
        </option>
      ))}
    </select>
  )
}

export default SocietyPage
