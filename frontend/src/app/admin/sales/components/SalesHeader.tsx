"use client"

import { useState } from "react"
import SaleCreateModal from "./modals/SaleCreateModal"

const SalesHeader = ({ onCreate }: any) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Sales</h1>

        <p className="text-gray-500">
          Manage all sales, deals and transactions
        </p>
      </div>

      <button
        className="border border-yellow-500 text-yellow-500 px-4 py-2 rounded-md"
        onClick={onCreate}
      >
        + Create Sale
      </button>
    </div>
  )
}

export default SalesHeader
