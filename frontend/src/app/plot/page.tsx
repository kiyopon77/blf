import BrokerInfoCard from "./components/BrokerInfoCard"
import CustomerCard from "./components/CustomerCard"
import MilestoneCard from "./components/MilestoneCard"
import PaymentInfoCard from "./components/PaymentInfoCard"
import ValueCard from "./components/ValueCard"

const Plot = () => {
  return (
    <div className="w-3/4 mx-auto mt-5 mb-10">
      <div className="flex flex-col">
        <div className="plotinfo flex justify-between mb-15 mt-5">
          <div className="flex flex-col">
            <span className="font-extrabold text-3xl">C1-10</span>
            <span className="text-gray-500">Category C1 | Floor 1</span>
          </div>

          <div>
            <span className="py-2 px-5 rounded-3xl bg-red-600 text-white">Sold</span>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <ValueCard />
          <BrokerInfoCard />
          <PaymentInfoCard />
          <CustomerCard />
          <MilestoneCard />
        </div>
      </div>
    </div>
  )
}

export default Plot
