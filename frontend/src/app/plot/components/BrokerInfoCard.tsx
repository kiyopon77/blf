const BrokerInfoCard = () => {
  return (
    <div className="bg-white px-9 py-6 rounded-xl border border-gray-400">
      <div className="flex flex-col gap-9">
        <span className="text-gray-700 font-extrabold">
          Broker Information
        </span>
        <div className="flex justify-between">
          <div className="flex flex-col justify-between">
            <span className="text-gray-600">Broker Name</span>
            <span className="font-extrabold text-xl">John Doe</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BrokerInfoCard
