import type { CoApplicantResponse } from "@/types/customer"
import { ReadOnlyField } from "./ui"

interface Props {
  coApplicants: CoApplicantResponse[]
  customerId: number | null
  onAddNew: () => void
  onDelete: (caId: number) => void
}

export function CoApplicantSection({ coApplicants, customerId, onAddNew, onDelete }: Props) {
  if (!customerId) {
    return (
      <div className="flex flex-col items-center justify-center py-6 text-gray-500">
        Please select a customer first to view or add co-applicants.
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-end -mt-12 mb-2">
        <button
          type="button"
          onClick={onAddNew}
          className="text-xs text-green-700 font-semibold hover:underline"
        >
          + Add New
        </button>
      </div>

      {coApplicants.length === 0 ? (
        <div className="text-sm text-gray-500 italic py-4 text-center">
          No co-applicants found for this customer.
        </div>
      ) : (
        <div className="flex flex-col gap-8">
          {coApplicants.map((ca, idx) => (
            <div key={ca.coapplicant_id} className="flex flex-col gap-4 relative">
              {idx > 0 && <div className="border-t border-gray-200 w-full mb-2" />}
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <span className="font-bold text-gray-700">Co-Applicant {idx + 1}</span>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${ca.kyc_status === "DONE" ? "bg-green-50 text-green-700" : "bg-yellow-50 text-yellow-700"}`}>
                    {ca.kyc_status}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => onDelete(ca.coapplicant_id)}
                  className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50 transition-colors"
                  title="Delete Co-Applicant"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <ReadOnlyField label="NAME" value={ca.full_name} placeholder="—" />
                <ReadOnlyField label="PAN" value={ca.pan || "—"} placeholder="—" />
                <ReadOnlyField label="PHONE" value={ca.phone || "—"} placeholder="—" />
                <ReadOnlyField label="EMAIL" value={ca.email || "—"} placeholder="—" />
                <div className="col-span-2">
                  <ReadOnlyField label="ADDRESS" value={ca.address || "—"} placeholder="—" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
