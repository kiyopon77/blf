// components/RMTable.tsx
import { RM } from "@/types/rm"
import RMRow from "./RMRow"

const RMTable = ({ rms, setRms }: any) => {
  return (
    <div className="border rounded-xl overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-100 text-left">
          <tr>
            <th className="p-4">RM ID</th>
            <th className="p-4">Name</th>
            <th className="p-4">Email</th>
            <th className="p-4">Phone</th>
            <th className="p-4">Created on</th>
            <th className="p-4">Actions</th>
          </tr>
        </thead>

        <tbody>
          {rms.map((rm: RM) => (
            <RMRow key={rm.rm_id} rm={rm} setRms={setRms} />
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default RMTable
