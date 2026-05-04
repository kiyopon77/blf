import { useState } from "react"
import { App } from "antd"
import CustomerActions from "./CustomerActions"
import AddCoApplicantModal from "./modals/AddCoApplicantModal"
import { getCoApplicantsByCustomer, deleteCoApplicant } from "@/services/admin/coapplicant"
import type { CoApplicantResponse } from "@/types/customer"

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
}

// handles customer row functionality
const CustomerRow = ({ c, setCustomers, onEdit }: any) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [coApplicants, setCoApplicants] = useState<CoApplicantResponse[]>([])
  const [loading, setLoading] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const { modal, message } = App.useApp()

  const toggleExpand = async () => {
    const newExpanded = !isExpanded
    setIsExpanded(newExpanded)
    if (newExpanded && coApplicants.length === 0) {
      setLoading(true)
      try {
        const data = await getCoApplicantsByCustomer(c.customer_id)
        setCoApplicants(data)
      } catch (e) {
        console.error("Failed to load co-applicants")
      } finally {
        setLoading(false)
      }
    }
  }

  const handleDelete = (caId: number) => {
    modal.confirm({
      title: "Delete Co-Applicant",
      content: "Are you sure you want to delete this co-applicant? This action cannot be undone.",
      okText: "Delete",
      okButtonProps: { danger: true },
      onOk: async () => {
        try {
          await deleteCoApplicant(caId)
          setCoApplicants(prev => prev.filter(ca => ca.coapplicant_id !== caId))
          message.success("Co-applicant deleted")
        } catch (e) {
          message.error("Failed to delete co-applicant")
        }
      }
    })
  }

  return (
    <>
    <tr className="group hover:bg-[#F9FAFB] transition-colors duration-150 h-[52px]">
      <td className="px-6 py-3 font-semibold text-black flex items-center gap-2">
        <button onClick={toggleExpand} className="text-gray-400 hover:text-black w-4 text-center">
          {isExpanded ? "▼" : "▶"}
        </button>
        {c.customer_id}
      </td>

      <td className="px-6 py-3 font-semibold text-black">
        {c.society_id}
      </td>

      <td className="px-6 py-3 text-gray-800 font-medium">
        {c.full_name}
      </td>

      <td className="px-6 py-3 text-gray-600">
        {c.pan}
      </td>

      <td className="px-6 py-3 text-gray-600">
        {c.phone || "-"}
      </td>

      <td className="px-6 py-3 text-gray-600">
        {c.address}
      </td>

      <td className="px-6 py-3 text-gray-600">
        {c.email || "-"}
      </td>

      {/* KYC Badge */}
      <td className="px-6 py-3">
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium ${c.kyc_status === "DONE"
            ? "bg-green-50 text-green-700"
            : "bg-yellow-50 text-yellow-700"
            }`}
        >
          {c.kyc_status}
        </span>
      </td>

      <td className="px-6 py-3 text-gray-500">
        {formatDate(c.created_at)}
      </td>

      <td className="px-6 py-3 text-right">
        <CustomerActions
          c={c}
          setCustomers={setCustomers}
          onEdit={onEdit}
        />
      </td>
    </tr>
    {isExpanded && (
      <tr className="bg-[#FDFDFD] border-b">
        <td colSpan={10} className="px-10 py-6">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-sm font-bold text-gray-700 uppercase tracking-wider">Co-Applicants</h4>
            <button 
              onClick={() => setShowAddModal(true)} 
              className="text-xs font-semibold text-green-700 hover:underline"
            >
              + Add Co-Applicant
            </button>
          </div>
          {loading ? (
            <div className="flex justify-center py-4">
              <p className="text-sm text-gray-500">Loading...</p>
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
              <table className="w-full text-sm text-left">
                <thead className="bg-[#FAFAFA] border-b text-xs text-gray-500 uppercase tracking-wider font-semibold">
                  <tr>
                    <th className="px-6 py-4">Name</th>
                    <th className="px-6 py-4">PAN</th>
                    <th className="px-6 py-4">Phone</th>
                    <th className="px-6 py-4">Email</th>
                    <th className="px-6 py-4">Address</th>
                    <th className="px-6 py-4">KYC</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {coApplicants.map(ca => (
                    <tr key={ca.coapplicant_id} className="hover:bg-gray-50 transition-colors h-[52px]">
                      <td className="px-6 py-3 text-gray-800 font-medium">{ca.full_name}</td>
                      <td className="px-6 py-3 text-gray-600">{ca.pan || "-"}</td>
                      <td className="px-6 py-3 text-gray-600">{ca.phone || "-"}</td>
                      <td className="px-6 py-3 text-gray-600">{ca.email || "-"}</td>
                      <td className="px-6 py-3 text-gray-600 max-w-xs truncate" title={ca.address || ""}>{ca.address || "-"}</td>
                      <td className="px-6 py-3">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium ${ca.kyc_status === "DONE" ? "bg-green-50 text-green-700" : "bg-yellow-50 text-yellow-700"}`}>
                          {ca.kyc_status}
                        </span>
                      </td>
                      <td className="px-6 py-3 text-right">
                        <button 
                          onClick={() => handleDelete(ca.coapplicant_id)}
                          className="text-red-500 hover:text-red-700 p-1"
                          title="Delete Co-Applicant"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                  {coApplicants.length === 0 && (
                    <tr>
                      <td colSpan={7} className="px-6 py-8 text-gray-500 italic text-center">
                        No co-applicants found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </td>
      </tr>
    )}
    <AddCoApplicantModal 
      open={showAddModal} 
      onClose={() => setShowAddModal(false)} 
      customerId={c.customer_id}
      onCreated={(ca) => setCoApplicants(prev => [...prev, ca])}
    />
    </>
  )
}

export default CustomerRow
