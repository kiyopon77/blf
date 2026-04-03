// app/plot/edit/[plotId]/ui/Field.tsx
"use client"
import { forwardRef } from "react"

type Props = {
  label: string
} & React.InputHTMLAttributes<HTMLInputElement>

const Field = forwardRef<HTMLInputElement, Props>(({ label, ...props }, ref) => {
  return (
    <div className="flex flex-col gap-2 w-full">
      <span className="text-xs text-gray-500 font-semibold">
        {label}
      </span>
      <input
        {...props}
        ref={ref}
        className="h-11 rounded-lg border border-gray-300 px-3 text-sm w-full focus:outline-none focus:ring-2 focus:ring-green-600"
      />
    </div>
  )
})

Field.displayName = "Field"
export default Field
