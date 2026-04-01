// components/ui/AdminButton.tsx
import { ReactNode } from "react"

// handles admin button functionality
const AdminButton = ({
  children,
  onClick,
  icon,
  type = "button",
  disabled = false,
}: {
  children: ReactNode
  onClick?: () => void
  icon?: ReactNode
  type?: "button" | "submit"
  disabled?: boolean
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className="mt-4 hover:cursor-pointer sm:mt-0 flex items-center space-x-2 border border-[#D4A22A] text-[#D4A22A] hover:bg-[#D4A22A] hover:text-white px-5 py-2.5 rounded text-sm font-medium transition-colors duration-200 disabled:opacity-50"
    >
      {icon}
      <span>{children}</span>
    </button>
  )
}

export default AdminButton
