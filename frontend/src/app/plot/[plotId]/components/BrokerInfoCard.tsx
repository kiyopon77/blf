// BrokerInfoCard.tsx
const BrokerInfoCard = ({
  broker,
  company,
  phone,
  email,
}: {
  broker?: string
  company?: string
  phone?: string
  email?: string
}) => {
  return (
    <div className="bg-white px-9 py-6 rounded-xl border border-gray-400">
      <div className="flex flex-col gap-9">
        <span className="text-gray-700 font-extrabold">Broker Information</span>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="flex flex-col">
            <span className="text-gray-600">Broker Name</span>
            <span className="font-extrabold text-xl">{broker ?? "—"}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-gray-600">Company</span>
            <span className="font-bold text-lg">{company ?? "—"}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-gray-600">Phone</span>
            <span className="font-bold text-lg">{phone ?? "—"}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-gray-600">Email</span>
            <span className="font-bold text-lg break-all">{email ?? "—"}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
export default BrokerInfoCard
