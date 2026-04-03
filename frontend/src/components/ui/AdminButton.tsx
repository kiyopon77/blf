// components/ui/AdminButton.tsx
"use client"
import { ReactNode, useTransition } from "react"
import { ThreeDot } from "react-loading-indicators"

// handles admin button functionality
const AdminButton = ({
  children,
  onClick,
  icon,
  type = "button",
  disabled = false,
  isLoading = false,
}: {
  children: ReactNode
  onClick?: () => void
  icon?: ReactNode
  type?: "button" | "submit"
  disabled?: boolean
  isLoading?: boolean
}) => {
  const [isPending, startTransition] = useTransition()

  const handleClick = () => {
    if (!onClick) return
    if (type === "submit") {
      onClick()
      return
    }
    startTransition(() => {
      onClick()
    })
  }

  const showLoading = isPending || isLoading

  return (
    <button
      type={type}
      onClick={handleClick}
      disabled={disabled || showLoading}
      className="mt-4 hover:cursor-pointer sm:mt-0 flex items-center justify-center space-x-2 border. border-[#D4A22A] text-[#D4A22A] hover:bg-[#D4A22A] hover:text-white px-5 py-2.5 rounded text-sm font-medium transition-colors duration-200 disabled:opacity-50"
    >
      {showLoading ? (
        <ThreeDot color="currentColor" size="small" text="" textColor="" />
      ) : (
        icon
      )}
      <span>{children}</span>
    </button>
  )
}

export default AdminButton
