// components/CustomerHeader.tsx
const CustomerHeader = ({onCreate}:any) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <div>
        <h1 className="text-3xl font-bold">Customers</h1>
        <p className="text-gray-500">
          Manage all customer records and KYC details
        </p>
      </div>

      <button className="border border-yellow-500 text-yellow-500 px-4 py-2 rounded-md" onClick={onCreate}>
        + Create Customer
      </button>
    </div>
  )
}

export default CustomerHeader
