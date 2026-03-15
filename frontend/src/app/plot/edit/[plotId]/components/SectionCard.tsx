// components/SectionCard.tsx
import React from "react"

type Props = {
  title: string
  children: React.ReactNode
}

const SectionCard = ({ title, children }: Props) => {
  return (
    <div className="bg-white border border-gray-300 rounded-xl p-6">
      <div className="flex flex-col gap-6">
        <span className="text-gray-700 font-bold tracking-wide">
          {title}
        </span>

        {children}
      </div>
    </div>
  )
}

export default SectionCard
