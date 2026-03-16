// CustomerCard.tsx
const CustomerCard = ({
  kyc,
  fullName,
  pan,
  phone,
  email,
  address,
}: {
  kyc?: string
  fullName?: string
  pan?: string
  phone?: string
  email?: string
  address?: string
}) => {
  const color = kyc === "DONE" ? "text-green-500" : "text-red-500"
  return (
    <div className="bg-white px-9 py-6 rounded-xl border border-gray-400">
      <div className="flex flex-col gap-9">
        <span className="text-gray-700 font-extrabold">Customer Compliance</span>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          <div className="flex flex-col">
            <span className="text-gray-600">Customer Name</span>
            <span className="font-bold text-lg">{fullName ?? "—"}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-gray-600">PAN</span>
            <span className="font-bold text-lg tracking-widest">{pan ?? "—"}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-gray-600">Phone</span>
            <span className="font-bold text-lg">{phone ?? "—"}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-gray-600">Email</span>
            <span className="font-bold text-lg break-all">{email ?? "—"}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-gray-600">Address</span>
            <span className="font-bold text-lg">{address ?? "—"}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-gray-600">KYC Status</span>
            <span className={`text-xl font-bold ${color}`}>{kyc ?? "Pending"}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
export default CustomerCard
