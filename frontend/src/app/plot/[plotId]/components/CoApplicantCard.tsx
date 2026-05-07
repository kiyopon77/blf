// app/plot/[plotId]/components/CoApplicantCard.tsx
import type { CoApplicantResponse } from "@/types/customer"

export default function CoApplicantCard({ coApplicants }: { coApplicants: CoApplicantResponse[] }) {
  if (!coApplicants || coApplicants.length === 0) return null

  return (
    <div className="bg-white px-9 py-6 rounded-xl border border-gray-400">
      <div className="flex flex-col gap-9">
        <span className="text-gray-700 font-extrabold uppercase">Co-Applicants</span>
        <div className="flex flex-col gap-8">
          {coApplicants.map((ca, idx) => {
            const color =
              ca.kyc_status === "DONE"
                ? "text-green-500"
                : ca.kyc_status === "PENDING"
                  ? "text-red-500"
                  : "text-gray-400"

            return (
              <div key={ca.coapplicant_id} className="flex flex-col gap-6">
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="font-bold text-xl text-black">Co-Applicant {idx + 1}</span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  <div className="flex flex-col">
                    <span className="text-gray-600">Name</span>
                    <span className="font-bold text-lg">{ca.full_name ?? "—"}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-gray-600">PAN</span>
                    <span className="font-bold text-lg tracking-widest">{ca.pan ?? "—"}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-gray-600">Phone</span>
                    <span className="font-bold text-lg">{ca.phone ?? "—"}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-gray-600">Email</span>
                    <span className="font-bold text-lg break-all">{ca.email ?? "—"}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-gray-600">Address</span>
                    <span className="font-bold text-lg">{ca.address ?? "—"}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-gray-600">KYC Status</span>
                    <span className={`text-xl font-bold ${color}`}>{ca.kyc_status ?? "PENDING"}</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
